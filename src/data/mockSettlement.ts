import type { SettlementItem, OwnerInfo } from '@/types';

export const mockSettlements: SettlementItem[] = [
  {
    id: 'S001',
    type: 'prize',
    typeText: '决赛奖金',
    amount: 100000,
    date: '2024-11-08',
    pigeonName: '闪电侠',
    ownerName: '赵六',
    status: 'completed'
  },
  {
    id: 'S002',
    type: 'prize',
    typeText: '决赛奖金',
    amount: 50000,
    date: '2024-11-08',
    pigeonName: '鹏程万里',
    ownerName: '吴九',
    status: 'completed'
  },
  {
    id: 'S003',
    type: 'prize',
    typeText: '预赛奖金',
    amount: 20000,
    date: '2024-10-28',
    pigeonName: '王者归来',
    ownerName: '李四',
    status: 'completed'
  },
  {
    id: 'S004',
    type: 'entryFee',
    typeText: '参赛费',
    amount: -2000,
    date: '2024-05-10',
    pigeonName: '蓝天一号',
    ownerName: '张三',
    status: 'completed'
  },
  {
    id: 'S005',
    type: 'entryFee',
    typeText: '参赛费',
    amount: -2000,
    date: '2024-06-01',
    pigeonName: '北斗七星',
    ownerName: '张三',
    status: 'pending'
  },
  {
    id: 'S006',
    type: 'prize',
    typeText: '资格赛奖金',
    amount: 5000,
    date: '2024-10-18',
    pigeonName: '疾风号',
    ownerName: '李四',
    status: 'completed'
  },
  {
    id: 'S007',
    type: 'bonus',
    typeText: '鸽王奖金',
    amount: 30000,
    date: '2024-11-10',
    pigeonName: '王者归来',
    ownerName: '李四',
    status: 'pending'
  }
];

export const mockOwnerInfo: OwnerInfo = {
  name: '张三',
  phone: '138****1234',
  memberId: 'M20240001',
  totalPigeons: 2,
  totalRaces: 4,
  totalPrize: 11000,
  avatar: 'https://picsum.photos/id/64/200/200'
};
