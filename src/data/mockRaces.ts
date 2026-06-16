import type { Race, TrainingRecord, RaceResult, Announcement } from '@/types';

export const mockRaces: Race[] = [
  {
    id: 'R001',
    name: '2024年秋季大奖赛-资格赛',
    type: 'qualifier',
    typeText: '资格赛',
    date: '2024-10-15',
    releaseTime: '06:30',
    location: '河北保定',
    distance: 200,
    totalPigeons: 580,
    returnedCount: 542,
    status: 'completed',
    statusText: '已完成',
    prizePool: 50000,
    weather: '晴'
  },
  {
    id: 'R002',
    name: '2024年秋季大奖赛-预赛',
    type: 'preliminary',
    typeText: '预赛',
    date: '2024-10-25',
    releaseTime: '06:00',
    location: '河南郑州',
    distance: 400,
    totalPigeons: 542,
    returnedCount: 468,
    status: 'completed',
    statusText: '已完成',
    prizePool: 150000,
    weather: '多云'
  },
  {
    id: 'R003',
    name: '2024年秋季大奖赛-决赛',
    type: 'final',
    typeText: '决赛',
    date: '2024-11-05',
    releaseTime: '05:45',
    location: '湖北武汉',
    distance: 600,
    totalPigeons: 468,
    returnedCount: 156,
    status: 'completed',
    statusText: '已完成',
    prizePool: 500000,
    weather: '晴'
  },
  {
    id: 'R004',
    name: '2024年冬季精英赛-资格赛',
    type: 'qualifier',
    typeText: '资格赛',
    date: '2024-12-01',
    releaseTime: '07:00',
    location: '天津',
    distance: 150,
    totalPigeons: 320,
    returnedCount: 0,
    status: 'upcoming',
    statusText: '即将开始',
    prizePool: 30000,
    weather: '预计晴'
  },
  {
    id: 'R005',
    name: '2024年冬季精英赛-预赛',
    type: 'preliminary',
    typeText: '预赛',
    date: '2024-12-10',
    releaseTime: '06:30',
    location: '山东济南',
    distance: 350,
    totalPigeons: 300,
    returnedCount: 0,
    status: 'upcoming',
    statusText: '即将开始',
    prizePool: 100000,
    weather: '预计多云'
  }
];

export const mockTrainingRecords: TrainingRecord[] = [
  {
    id: 'T001',
    type: 'home',
    typeText: '家飞训练',
    date: '2024-10-28',
    location: '公棚上空',
    distance: 0,
    totalPigeons: 500,
    returnedCount: 500,
    status: 'completed',
    statusText: '已完成'
  },
  {
    id: 'T002',
    type: 'short',
    typeText: '短程训放',
    date: '2024-10-26',
    location: '廊坊',
    distance: 50,
    totalPigeons: 480,
    returnedCount: 475,
    status: 'completed',
    statusText: '已完成'
  },
  {
    id: 'T003',
    type: 'short',
    typeText: '短程训放',
    date: '2024-10-24',
    location: '霸州',
    distance: 80,
    totalPigeons: 490,
    returnedCount: 482,
    status: 'completed',
    statusText: '已完成'
  },
  {
    id: 'T004',
    type: 'long',
    typeText: '长程训放',
    date: '2024-10-20',
    location: '石家庄',
    distance: 280,
    totalPigeons: 520,
    returnedCount: 498,
    status: 'completed',
    statusText: '已完成'
  },
  {
    id: 'T005',
    type: 'home',
    typeText: '家飞训练',
    date: '2024-10-29',
    location: '公棚上空',
    distance: 0,
    totalPigeons: 468,
    returnedCount: 0,
    status: 'ongoing',
    statusText: '进行中'
  },
  {
    id: 'T006',
    type: 'short',
    typeText: '短程训放',
    date: '2024-10-30',
    location: '沧州',
    distance: 120,
    totalPigeons: 450,
    returnedCount: 0,
    status: 'pending',
    statusText: '待开始'
  }
];

export const mockRaceResults: RaceResult[] = [
  {
    rank: 1,
    raceId: 'R003',
    pigeonId: '4',
    ringNumber: 'CHN2024-004',
    ownerName: '赵六',
    returnTime: '2024-11-05 12:15',
    speed: 1428.57,
    distance: 600,
    duration: '6小时30分',
    prize: 100000
  },
  {
    rank: 2,
    raceId: 'R003',
    pigeonId: '9',
    ringNumber: 'CHN2024-009',
    ownerName: '吴九',
    returnTime: '2024-11-05 12:18',
    speed: 1418.23,
    distance: 600,
    duration: '6小时33分',
    prize: 50000
  },
  {
    rank: 3,
    raceId: 'R003',
    pigeonId: '7',
    ringNumber: 'CHN2024-007',
    ownerName: '李四',
    returnTime: '2024-11-05 12:22',
    speed: 1406.78,
    distance: 600,
    duration: '6小时37分',
    prize: 30000
  },
  {
    rank: 4,
    raceId: 'R003',
    pigeonId: '3',
    ringNumber: 'CHN2024-003',
    ownerName: '王五',
    returnTime: '2024-11-05 12:28',
    speed: 1388.89,
    distance: 600,
    duration: '6小时43分',
    prize: 15000
  },
  {
    rank: 5,
    raceId: 'R003',
    pigeonId: '10',
    ringNumber: 'CHN2024-010',
    ownerName: '郑十',
    returnTime: '2024-11-05 12:32',
    speed: 1375.42,
    distance: 600,
    duration: '6小时47分',
    prize: 10000
  },
  {
    rank: 6,
    raceId: 'R003',
    pigeonId: '2',
    ringNumber: 'CHN2024-002',
    ownerName: '李四',
    returnTime: '2024-11-05 12:40',
    speed: 1353.98,
    distance: 600,
    duration: '6小时55分',
    prize: 8000
  },
  {
    rank: 7,
    raceId: 'R003',
    pigeonId: '1',
    ringNumber: 'CHN2024-001',
    ownerName: '张三',
    returnTime: '2024-11-05 12:48',
    speed: 1331.18,
    distance: 600,
    duration: '7小时03分',
    prize: 6000
  },
  {
    rank: 8,
    raceId: 'R003',
    pigeonId: '5',
    ringNumber: 'CHN2024-005',
    ownerName: '张三',
    returnTime: '2024-11-05 12:55',
    speed: 1312.78,
    distance: 600,
    duration: '7小时10分',
    prize: 5000
  },
  {
    rank: 9,
    raceId: 'R003',
    pigeonId: '8',
    ringNumber: 'CHN2024-008',
    ownerName: '周八',
    returnTime: '2024-11-05 13:05',
    speed: 1288.89,
    distance: 600,
    duration: '7小时20分',
    prize: 4000
  },
  {
    rank: 10,
    raceId: 'R003',
    pigeonId: '6',
    ringNumber: 'CHN2024-006',
    ownerName: '孙七',
    returnTime: '2024-11-05 13:18',
    speed: 1258.99,
    distance: 600,
    duration: '7小时33分',
    prize: 3000
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'A001',
    title: '2024秋季大奖赛决赛成绩公布',
    content: '2024年秋季大奖赛决赛已于11月5日顺利完成，共156羽赛鸽成功归巢，现将成绩公布如下...',
    date: '2024-11-06',
    type: 'race'
  },
  {
    id: 'A002',
    title: '冬季精英赛报名通知',
    content: '2024年冬季精英赛报名通道已开启，请各位鸽主于11月20日前完成报名手续...',
    date: '2024-11-01',
    type: 'notice'
  },
  {
    id: 'A003',
    title: '系统维护通知',
    content: '系统将于11月10日凌晨2:00-4:00进行维护升级，届时部分功能可能无法使用...',
    date: '2024-11-08',
    type: 'system'
  }
];
