const BEACON_TTL_MS = 24 * 60 * 60 * 1000;
const EVENT_TTL_MS = 10 * 60 * 1000;
const MAX_EVENTS = 30;

/** @type {Map<string, object>} */
const memoryStore = global.__beaconMemoryStore || new Map();
global.__beaconMemoryStore = memoryStore;

/** @type {object[]} */
const eventLog = global.__beaconEventLog || [];
global.__beaconEventLog = eventLog;

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function pushEvent(event) {
  eventLog.unshift(event);
  while (eventLog.length > MAX_EVENTS) eventLog.pop();
}

function listRecentEvents() {
  const now = Date.now();
  return eventLog.filter((event) => now - new Date(event.at).getTime() < EVENT_TTL_MS);
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

function listActiveBeacons() {
  const now = Date.now();
  for (const [id, beacon] of memoryStore.entries()) {
    const age = now - new Date(beacon.updatedAt).getTime();
    if (age >= BEACON_TTL_MS) memoryStore.delete(id);
  }
  return Array.from(memoryStore.values());
}

module.exports = async function handler(req, res) {
  cors(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      res.status(200).json({
        beacons: listActiveBeacons(),
        events: listRecentEvents(),
      });
      return;
    }

    if (req.method === 'POST') {
      const exit = validateExit(req.body);
      if (exit) {
        memoryStore.delete(exit.id);
        pushEvent({
          type: 'exit',
          id: exit.id,
          device: exit.device,
          message: '앱 종료',
          at: new Date().toISOString(),
        });
        res.status(200).json({ ok: true, event: 'exit' });
        return;
      }

      const beacon = validateBeacon(req.body);
      if (!beacon) {
        res.status(400).json({ error: 'Invalid beacon payload' });
        return;
      }

      memoryStore.set(beacon.id, beacon);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
};
