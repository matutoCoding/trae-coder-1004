import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import SectionHeader from '@/components/SectionHeader';
import StatusTag from '@/components/StatusTag';
import { useAppStore } from '@/store';
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
  const { settlements, pigeons, raceResults, races } = useAppStore();
  const [activeTab, setActiveTab] = useState<'prize' | 'record'>('prize');

  const totalEntryFee = useMemo(
    () =>
      settlements
        .filter((s) => s.type === 'entryFee' && s.status === 'completed')
        .reduce((sum, s) => sum + Math.abs(s.amount), 0),
    [settlements]
  );

  const totalPrizePaid = useMemo(
    () =>
      settlements
        .filter((s) => s.type !== 'entryFee' && s.status === 'completed')
        .reduce((sum, s) => sum + Math.abs(s.amount), 0),
    [settlements]
  );

  const finalRace = useMemo(() => {
    return races.find((r) => r.type === 'final') || races[0];
  }, [races]);

  const resultWithPrize = useMemo(() => {
    return raceResults
      .slice(0, 10)
      .map((r) => {
        let prize = 0;
        if (r.rank === 1) prize = 100000;
        else if (r.rank === 2) prize = 50000;
        else if (r.rank === 3) prize = 30000;
        else if (r.rank === 4) prize = 15000;
        else if (r.rank === 5) prize = 10000;
        else if (r.rank >= 6 && r.rank <= 10) prize = 5000;
        else if (r.rank >= 11 && r.rank <= 50) prize = 2000;
        else if (r.rank >= 51) prize = 1000;
        return { ...r, prize };
      });
  }, [raceResults]);

  const totalPrizePool = useMemo(
    () =>
      pigeons.filter((p) => p.paid).length * 2000 +
      (finalRace?.prizePool || 0),
    [pigeons, finalRace]
  );

  const netAmount = totalEntryFee - totalPrizePaid;
  const paidCount = pigeons.filter((p) => p.paid).length;
  const unpaidCount = pigeons.length - paidCount;

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.summaryCard}>
        <Text className={styles.summaryLabel}>累计净收益</Text>
        <View>
          <Text className={styles.summaryAmount}>{formatMoney(netAmount)}</Text>
        </View>
        <View className={styles.summarySub}>
          <View className={styles.subItem}>
            <Text className={styles.subValue}>{formatMoney(totalEntryFee)}</Text>
            <Text className={styles.subLabel}>参赛费收入</Text>
          </View>
          <View className={styles.subItem}>
            <Text className={styles.subValue}>{formatMoney(totalPrizePaid)}</Text>
            <Text className={styles.subLabel}>奖金支出</Text>
          </View>
          <View className={styles.subItem}>
            <Text className={styles.subValue}>{paidCount}羽</Text>
            <Text className={styles.subLabel}>已缴费</Text>
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
          <SectionHeader
            title={finalRace ? `${finalRace.name} 奖金分配` : '奖金分配'}
          />
          <View className={styles.prizeCard}>
            <View className={styles.prizeHeader}>
              <View className={styles.prizeHeaderInner}>
                <Text className={styles.prizeTitle}>奖金池</Text>
                <Text style={{ fontSize: 40, fontWeight: 700, color: '#FF9800' }}>
                  {formatMoney(totalPrizePool)}
                </Text>
              </View>
              <View className={styles.prizeStats}>
                <View className={styles.prizeStat}>
                  <Text className={styles.prizeStatNum}>{paidCount}</Text>
                  <Text className={styles.prizeStatLabel}>已缴费赛鸽</Text>
                </View>
                <View className={styles.prizeStat}>
                  <Text className={styles.prizeStatNum}>{unpaidCount}</Text>
                  <Text className={styles.prizeStatLabel}>未缴费</Text>
                </View>
              </View>
            </View>
            <View className={styles.prizeList}>
              {prizeDistribution.map((item) => (
                <View key={item.rank} className={styles.prizeRow}>
                  <View className={styles.prizeRank}>
                    <View
                      className={`${styles.rankNum} ${
                        item.rank <= 3 ? styles[`top${item.rank}`] : ''
                      }`}
                    >
                      <Text>{item.rank}</Text>
                    </View>
                    <Text className={styles.rankLabel}>{item.label}</Text>
                  </View>
                  <Text className={styles.prizeAmount}>
                    {formatMoney(item.amount)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {resultWithPrize.length > 0 && (
            <>
              <SectionHeader title="已出成绩分配" />
              <View className={styles.resultCard}>
                {resultWithPrize.map((r) => (
                  <View key={`${r.raceId}-${r.ringNumber}`} className={styles.resultRow}>
                    <View className={styles.resultRank}>
                      <Text className={styles.resultRankNum}>第{r.rank}名</Text>
                    </View>
                    <View className={styles.resultInfo}>
                      <Text className={styles.resultRing}>{r.ringNumber}</Text>
                      <Text className={styles.resultOwner}>{r.ownerName}</Text>
                    </View>
                    <View className={styles.resultSpeed}>
                      <Text className={styles.resultSpeedVal}>
                        {r.speed.toFixed(0)} m/分
                      </Text>
                    </View>
                    <View className={styles.resultPrize}>
                      <Text className={styles.resultPrizeVal}>
                        {formatMoney(r.prize)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </>
      )}

      {activeTab === 'record' && (
        <>
          <SectionHeader title={`收支记录 (${settlements.length}条)`} />
          {settlements.length === 0 && (
            <View className={styles.emptyBox}>
              <Text className={styles.emptyText}>暂无收支记录</Text>
            </View>
          )}
          {settlements.map((item) => {
            const isIncome = item.type === 'entryFee';
            const absAmount = Math.abs(item.amount);
            return (
              <View key={item.id} className={styles.recordItem}>
                <View className={styles.recordHeader}>
                  <View className={styles.recordType}>
                    <View
                      className={`${styles.typeIcon} ${isIncome ? styles.income : styles.expense}`}
                    >
                      <Text>{isIncome ? '💰' : '💳'}</Text>
                    </View>
                    <View className={styles.typeInfo}>
                      <Text className={styles.typeName}>{item.typeText}</Text>
                      <Text className={styles.typePigeon}>
                        赛鸽：{item.pigeonName} · 鸽主：{item.ownerName}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className={`${styles.recordAmount} ${isIncome ? styles.income : styles.expense}`}
                  >
                    {isIncome ? '+' : '-'}{formatMoney(absAmount)}
                  </Text>
                </View>
                <View className={styles.recordMeta}>
                  <StatusTag
                    status={item.status}
                    text={item.status === 'completed' ? '已完成' : '待处理'}
                  />
                  <Text className={styles.recordDate}>{item.date}</Text>
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
