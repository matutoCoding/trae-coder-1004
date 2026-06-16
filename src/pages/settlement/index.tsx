import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import SectionHeader from '@/components/SectionHeader';
import StatusTag from '@/components/StatusTag';
import { mockSettlements } from '@/data/mockSettlement';
import { formatMoney } from '@/utils';
import styles from './index.module.scss';

const prizeDistribution = [
  { rank: 1, label: '冠军', amount: 100000 },
  { rank: 2, label: '亚军', amount: 50000 },
  { rank: 3, label: '季军', amount: 30000 },
  { rank: 4, label: '第4名', amount: 15000 },
  { rank: 5, label: '第5名', amount: 10000 },
  { rank: 6, label: '第6-10名', amount: 5000 },
  { rank: 11, label: '第11-50名', amount: 2000 },
  { rank: 51, label: '第51-100名', amount: 1000 }
];

const SettlementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prize' | 'record'>('prize');

  const totalIncome = mockSettlements
    .filter(s => s.amount > 0)
    .reduce((sum, s) => sum + s.amount, 0);

  const totalExpense = Math.abs(
    mockSettlements
      .filter(s => s.amount < 0)
      .reduce((sum, s) => sum + s.amount, 0)
  );

  const netAmount = totalIncome - totalExpense;

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.summaryCard}>
        <Text className={styles.summaryLabel}>累计净收益</Text>
        <View>
          <Text className={styles.summaryAmount}>{formatMoney(netAmount)}</Text>
        </View>
        <View className={styles.summarySub}>
          <View className={styles.subItem}>
            <Text className={styles.subValue}>¥{totalIncome.toLocaleString()}</Text>
            <Text className={styles.subLabel}>累计奖金</Text>
          </View>
          <View className={styles.subItem}>
            <Text className={styles.subValue}>¥{totalExpense.toLocaleString()}</Text>
            <Text className={styles.subLabel}>累计缴费</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabs}>
        <View
          className={`${styles.tabItem} ${activeTab === 'prize' ? styles.active : ''}`}
          onClick={() => setActiveTab('prize')}
        >
          奖金分配
        </View>
        <View
          className={`${styles.tabItem} ${activeTab === 'record' ? styles.active : ''}`}
          onClick={() => setActiveTab('record')}
        >
          收支明细
        </View>
      </View>

      {activeTab === 'prize' && (
        <>
          <SectionHeader title="2024秋季大奖赛-决赛 奖金分配" />
          <View className={styles.prizeCard}>
            <View className={styles.prizeHeader}>
              <Text className={styles.prizeTitle}>奖金池</Text>
              <Text style={{ fontSize: 32, fontWeight: 700, color: '#FF9800' }}>¥500,000</Text>
            </View>
            <View className={styles.prizeList}>
              {prizeDistribution.map(item => (
                <View key={item.rank} className={styles.prizeRow}>
                  <View className={styles.prizeRank}>
                    <View className={styles.rankNum}>
                      <Text>{item.rank}</Text>
                    </View>
                    <Text className={styles.rankLabel}>{item.label}</Text>
                  </View>
                  <Text className={styles.prizeAmount}>¥{item.amount.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}

      {activeTab === 'record' && (
        <>
          <SectionHeader title={`收支记录 (${mockSettlements.length}条)`} />
          {mockSettlements.map(item => {
            const isIncome = item.amount > 0;
            return (
              <View key={item.id} className={styles.recordItem}>
                <View className={styles.recordHeader}>
                  <View className={styles.recordType}>
                    <View className={`${styles.typeIcon} ${isIncome ? styles.income : styles.expense}`}>
                      <Text>{isIncome ? '💰' : '💳'}</Text>
                    </View>
                    <Text className={styles.typeName}>{item.typeText}</Text>
                  </View>
                  <Text className={`${styles.recordAmount} ${isIncome ? styles.income : styles.expense}`}>
                    {formatMoney(item.amount)}
                  </Text>
                </View>
                <View style={{ fontSize: 24, color: '#4E5969' }}>
                  <Text>赛鸽：{item.pigeonName}</Text>
                </View>
                <View className={styles.recordMeta}>
                  <View style={{ display: 'flex', alignItems: 'center' }}>
                    <View className={`${styles.statusDot} ${item.status === 'completed' ? styles.completed : styles.pending}`}></View>
                    <StatusTag
                      status={item.status}
                      text={item.status === 'completed' ? '已完成' : '待处理'}
                    />
                  </View>
                  <Text>{item.date}</Text>
                </View>
              </View>
            );
          })}
        </>
      )}
    </ScrollView>
  );
};

export default SettlementPage;
