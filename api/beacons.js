const { Redis } = require('@upstash/redis');

const BEACON_TTL_SEC = 24 * 60 * 60;
const EVENT_TTL_MS = 10 * 60 * 1000;
const MAX_EVENTS = 30;

const BEACON_KEY_PREFIX = 'beacon:';
const BEACON_IDS_KEY = 'beacon:ids';
const EVENTS_KEY = 'beacon:events';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? Redis.fromEnv()
  : null;

/** @type {Map<string, object>} */
const memoryStore = global.__beaconMemoryStore || new Map();
global.__beaconMemoryStore = memoryStore;

/** @type {object[]} */
const eventLog = global.__beaconEventLog || [];
global.__beaconEventLog = eventLog;

function beaconKey(id) {
  return `${BEACON_KEY_PREFIX}${id}`;
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseRequestBody(req) {
  if (req.body == null) return null;
  if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  const raw = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : String(req.body);
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function pushEventMemory(event) {
  eventLog.unshift(event);
  while (eventLog.length > MAX_EVENTS) eventLog.pop();
}

async function pushEvent(event) {
  if (!redis) {
    pushEventMemory(event);
    return;
  }

  await redis.lpush(EVENTS_KEY, event);
  await redis.ltrim(EVENTS_KEY, 0, MAX_EVENTS - 1);
}

function listRecentEventsMemory() {
  const now = Date.now();
  return eventLog.filter((event) => now - new Date(event.at).getTime() < EVENT_TTL_MS);
}

async function listRecentEvents() {
  if (!redis) return listRecentEventsMemory();

  const events = await redis.lrange(EVENTS_KEY, 0, MAX_EVENTS - 1);
  const now = Date.now();
  return events.filter((event) => now - new Date(event.at).getTime() < EVENT_TTL_MS);
}

function validateBeacon(body) {
  if (!body || typeof body !== 'object') return null;
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  const lat = Number(body.lat);
  const lng = Number(body.lng);
  if (!id || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return {
    id,
    lat,
    lng,
    accuracy: Number.isFinite(Number(body.accuracy)) ? Number(body.accuracy) : null,
    device: String(body.device ?? 'Unknown'),
    os: String(body.os ?? 'Unknown'),
    model: String(body.model ?? '—'),
    manufacturer: String(body.manufacturer ?? '—'),
    appVersion: String(body.appVersion ?? '—'),
    battery: Number.isFinite(Number(body.battery)) ? Number(body.battery) : null,
    updatedAt: new Date().toISOString(),
  };
}

function validateExit(body) {
  if (!body || typeof body !== 'object' || body.event !== 'exit') return null;
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  if (!id) return null;
  return {
    id,
    device: String(body.device ?? 'Unknown'),
  };
}

function listActiveBeaconsMemory() {
  const now = Date.now();
  for (const [id, beacon] of memoryStore.entries()) {
    const age = now - new Date(beacon.updatedAt).getTime();
    if (age >= BEACON_TTL_SEC * 1000) memoryStore.delete(id);
  }
  return Array.from(memoryStore.values());
}

async function saveBeacon(beacon) {
  if (!redis) {
    memoryStore.set(beacon.id, beacon);
    return;
  }

  await redis.set(beaconKey(beacon.id), beacon, { ex: BEACON_TTL_SEC });
  await redis.sadd(BEACON_IDS_KEY, beacon.id);
}

async function removeBeacon(id) {
  if (!redis) {
    memoryStore.delete(id);
    return;
  }

  await redis.del(beaconKey(id));
  await redis.srem(BEACON_IDS_KEY, id);
}

async function listActiveBeacons() {
  if (!redis) return listActiveBeaconsMemory();

  const ids = await redis.smembers(BEACON_IDS_KEY);
  if (!ids.length) return [];

  const keys = ids.map((id) => beaconKey(id));
  const values = await redis.mget(...keys);
  const now = Date.now();
  const beacons = [];
  const staleIds = [];

  values.forEach((beacon, index) => {
    if (!beacon) {
      staleIds.push(ids[index]);
      return;
    }

    const age = now - new Date(beacon.updatedAt).getTime();
    if (age >= BEACON_TTL_SEC * 1000) {
      staleIds.push(beacon.id);
      return;
    }

    beacons.push(beacon);
  });

  if (staleIds.length) {
    await Promise.all(staleIds.map((id) => removeBeacon(id)));
  }

  return beacons;
}

module.exports = async function handler(req, res) {
  cors(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const [beacons, events] = await Promise.all([
        listActiveBeacons(),
        listRecentEvents(),
      ]);
      res.status(200).json({ beacons, events });
      return;
    }

    if (req.method === 'POST') {
      const body = parseRequestBody(req);
      if (!body) {
        res.status(400).json({ error: 'Invalid JSON' });
        return;
      }

      const exit = validateExit(body);
      if (exit) {
        await removeBeacon(exit.id);
        await pushEvent({
          type: 'exit',
          id: exit.id,
          device: exit.device,
          message: '앱 종료',
          at: new Date().toISOString(),
        });
        res.status(200).json({ ok: true, event: 'exit' });
        return;
      }

      const beacon = validateBeacon(body);
      if (!beacon) {
        res.status(400).json({ error: 'Invalid beacon payload' });
        return;
      }

      await saveBeacon(beacon);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
};
