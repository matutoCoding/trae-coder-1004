export interface Pigeon {
  id: string;
  ringNumber: string;
  electronicRing: string;
  name: string;
  ownerName: string;
  ownerPhone: string;
  breed: string;
  gender: '雄' | '雌';
  birthDate: string;
  color: string;
  loftArea: string;
  status: 'health' | 'healthy' | 'training' | 'racing' | 'lost' | 'returned';
  statusText: string;
  receiveDate?: string;
  entryDate?: string;
  avatar: string;
  paid: boolean;
  raceCount: number;
}

export interface LoftArea {
  id: string;
  name: string;
  capacity: number;
  used: number;
  area: string;
  manager: string;
  status: 'normal' | 'full' | 'maintenance';
}

export interface TrainingRecord {
  id: string;
  type: 'home' | 'short' | 'long';
  typeText: string;
  date: string;
  location: string;
  distance: number;
  totalPigeons: number;
  returnedCount: number;
  status: 'pending' | 'ongoing' | 'completed';
  statusText: string;
}

export interface Race {
  id: string;
  name: string;
  type: 'qualifier' | 'preliminary' | 'final';
  typeText: string;
  date: string;
  releaseTime: string;
  location: string;
  distance: number;
  totalPigeons: number;
  returnedCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  statusText: string;
  prizePool: number;
  weather: string;
}

export interface RaceResult {
  rank: number;
  pigeonId: string;
  ringNumber: string;
  ownerName: string;
  returnTime: string;
  speed: number;
  distance: number;
  duration: string;
  prize?: number;
}

export interface SettlementItem {
  id: string;
  type: 'entryFee' | 'prize' | 'bonus';
  typeText: string;
  amount: number;
  date: string;
  pigeonName: string;
  ownerName: string;
  status: 'completed' | 'pending';
}

export interface OwnerInfo {
  name: string;
  phone: string;
  memberId: string;
  totalPigeons: number;
  totalRaces: number;
  totalPrize: number;
  avatar: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'notice' | 'race' | 'system';
}
