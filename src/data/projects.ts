export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  github?: string;
  highlights: string[];
  icon: string;
  accent: string;
}

export const projects: Project[] = [
  {
    id: 'beacon-guardian',
    title: 'BeaconGuardian',
    subtitle: '엔드포인트 보안 모니터링 에이전트',
    description:
      'USB·프로세스·파일·네트워크·브라우저 활동을 수집해 Beacon 서버로 전송하는 Windows/Linux 보안 에이전트입니다. GUI 설정 마법사, 트레이 모드, JWT 인증을 지원합니다.',
    tags: ['Python', 'Scapy', 'PyYAML', 'Security', 'Windows Service'],
    github: 'https://github.com/mandur23/BeaconGuardian',
    highlights: [
      'USB 연결/제거, 프로세스, 파일시스템 실시간 감시',
      'Chrome/Edge/Firefox 웹 방문 기록 수집',
      '관리자·일반 사용자 역할 기반 UI 제어',
      'PyInstaller exe 빌드 및 NSSM/systemd 서비스 지원',
    ],
    icon: '🛡️',
    accent: '#3b82f6',
  },
  {
    id: 'tendo-aris',
    title: '아리스 (Tendo Aris)',
    subtitle: 'Discord 음악 봇 & TTS & 야추 게임',
    description:
      'Discord에서 YouTube 음악 재생, TTS(음성 합성), 야추 다이스 게임을 즐길 수 있는 다기능 봇입니다. 슬래시 명령어와 인터랙티브 버튼 UI를 제공합니다.',
    tags: ['Python', 'discord.py', 'yt-dlp', 'MySQL', 'gTTS', 'RVC'],
    github: 'https://github.com/mandur23/Tendo_Aris',
    highlights: [
      'YouTube 재생, 플레이리스트, 히스토리, 대기열 관리',
      'gTTS / RVC 기반 고품질 TTS 엔진',
      '멀티플레이어 야추 다이스 게임 (버튼 UI)',
      'MySQL 또는 JSON 데이터 저장, 명령어 자동 완성',
    ],
    icon: '🎵',
    accent: '#a855f7',
  },
  {
    id: 'face-recognition',
    title: 'Face Recognition V3',
    subtitle: '실시간 얼굴 인식 & 감정 분석',
    description:
      '웹캠을 통한 실시간 얼굴 감지와 나이·성별·감정(7종) 분석 AI 애플리케이션입니다. CustomTkinter 기반 다크 테마 GUI와 적응형 성능 최적화를 제공합니다.',
    tags: ['Python', 'DeepFace', 'OpenCV', 'TensorFlow', 'CustomTkinter'],
    github: 'https://github.com/mandur23/Face_Recognition_Project_V2',
    highlights: [
      '다중 얼굴 동시 감지 및 분석',
      'FPS 기반 적응형 성능 최적화',
      'GPU 자동 인식 및 CUDA 가속',
      '카메라 밝기·대비·흑백·좌우 반전 설정',
    ],
    icon: '🎭',
    accent: '#ec4899',
  },
  {
    id: 'game-server',
    title: '라즈베리파이 게임 서버',
    subtitle: '게임 컨트롤러 → 키보드 입력 변환',
    description:
      '게임 컨트롤러의 조이스틱·버튼 입력을 키보드 키로 변환해 PC 게임에 전달하는 Flask 서버입니다. HTTP API와 MQTT 프로토콜을 모두 지원합니다.',
    tags: ['Python', 'Flask', 'MQTT', 'Raspberry Pi', 'IoT'],
    github: 'https://github.com/mandur23/raspberry_pi_game_server',
    highlights: [
      'RESTful HTTP API 및 MQTT 실시간 통신',
      '조이스틱/버튼 → WASD·스페이스 키 매핑',
      '웹 기반 실시간 모니터링 대시보드',
      '모듈화된 패키지 구조 (game_server/)',
    ],
    icon: '🎮',
    accent: '#22c55e',
  },
  {
    id: 'biometric-ml',
    title: '행동 생체인식 ML',
    subtitle: '마우스 움직임 기반 이상 탐지',
    description:
      '마우스 움직임 패턴(속도, 가속도, 각도 변화)을 수집·정규화하고, Isolation Forest와 딥러닝 모델로 이상 행동을 탐지하는 연구 프로젝트입니다.',
    tags: ['Python', 'PyTorch', 'scikit-learn', 'NumPy', 'ML'],
    highlights: [
      '20Hz 샘플링 기반 마우스 피처 추출',
      'Isolation Forest 이상 탐지 모델',
      'PyTorch 기반 시퀀스 분류 모델',
      'BeaconGuardian 입력 생체 모듈과 연계 가능',
    ],
    icon: '🖱️',
    accent: '#f59e0b',
  },
];

export const wipProject: Project = {
  id: 'wip-mystery',
  title: '??? (WIP)',
  subtitle: '아직 커밋 안 함',
  description:
    '로컬에만 있는 비밀 프로젝트입니다. README는 TODO, 테스트는 없고, somehow 돌아갑니다.',
  tags: ['???', 'TODO', 'Works on my machine'],
  highlights: [
    'git push --force 고민 중',
    '변수명 temp_final_v2_real',
    '주석: 나중에 고치기 (2023)',
  ],
  icon: '🚧',
  accent: '#64748b',
};

export const skills = [
  'Python',
  'React / TypeScript',
  'Discord Bot Development',
  'Computer Vision & Deep Learning',
  'Flask / REST API',
  'MQTT / IoT',
  'MySQL',
  'Security Monitoring',
  'Windows / Linux',
];

export const profile = {
  name: 'nano',
  title: '풀스택 & AI 개발자',
  bio: '보안 모니터링, Discord 봇, 컴퓨터 비전, IoT 게임 서버 등 다양한 분야에서 Python 기반 프로젝트를 설계하고 구현합니다. 실용적인 기능과 안정적인 운영을 중시합니다.',
  github: 'https://github.com/mandur23',
  email: 'mandur23@users.noreply.github.com',
};
