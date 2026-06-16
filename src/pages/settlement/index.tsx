import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SectionHeader from '@/components/SectionHeader';
import StatusTag from '@/components/StatusTag';
import { useAppStore } from '@/store';
import { formatMoney } from '@/utils';
import styles from './index.module.scss';

const FEE_PER_PIGEON = 2000;

const getPrizeForRank = (rank: number): number => {
  if (rank === 1) return 100000;
  if (rank === 2) return 50000;
  if (rank === 3) return 30000;
  if (rank === 4) return 15000;
  if (rank === 5) return 10000;
  if (rank >= 6 && rank <= 10) return 5000;
  if (rank >= 11 && rank <= 50) return 2000;
  if (rank >= 51) return 1000;
  return 0;
};

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
  const [selectedRaceId, setSelectedRaceId] = useState('');

  const paidCount = useMemo(() => pigeons.filter((p) => p.paid).length, [pigeons]);

  const totalEntryFee = useMemo(
    () => paidCount * FEE_PER_PIGEON,
    [paidCount]
  );

  const totalEntryFeeFromRecords = useMemo(
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

  const netAmount = totalEntryFee - totalPrizePaid;

  const selectedRace = useMemo(
    () => races.find((r) => r.id === selectedRaceId),
    [races, selectedRaceId]
  );

  const racePrizeResults = useMemo(() => {
    if (!selectedRaceId) return [];
    return raceResults
      .filter((r) => r.raceId === selectedRaceId)
      .sort((a, b) => a.rank - b.rank)
      .map((r) => ({ ...r, prize: getPrizeForRank(r.rank) }));
  }, [raceResults, selectedRaceId]);

  const raceTotalPrize = useMemo(
    () => racePrizeResults.reduce((sum, r) => sum + r.prize, 0),
    [racePrizeResults]
  );

  const racePrizePaid = useMemo(
    () =>
      settlements
        .filter((s) => s.type !== 'entryFee' && s.status === 'completed')
        .reduce((sum, s) => sum + Math.abs(s.amount), 0),
    [settlements]
  );

  const racePrizePending = useMemo(
    () => Math.max(0, raceTotalPrize - racePrizePaid),
    [raceTotalPrize, racePrizePaid]
  );

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
            <Text className={styles.subLabel}>参赛费收入({paidCount}羽)</Text>
          </View>
          <View className={styles.subItem}>
            <Text className={styles.subValue}>{formatMoney(totalPrizePaid)}</Text>
            <Text className={styles.subLabel}>奖金支出</Text>
          </View>
          <View className={styles.subItem}>
            <Text className={styles.subValue}>{formatMoney(totalEntryFeeFromRecords)}</Text>
            <Text className={styles.subLabel}>已到账</Text>
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
          <View className={styles.selectorCard}>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>选择比赛</Text>
              <View
                className={styles.selector}
                onClick={() => {
                  const items = races.map((r) => r.name);
                  if (items.length === 0) {
                    Taro.showToast({ title: '暂无比赛', icon: 'none' });
                    return;
                  }
                  Taro.showActionSheet({
                    itemList: items,
                    success: (res) => {
                      setSelectedRaceId(races[res.tapIndex].id);
                    }
                  });
                }}
              >
                <Text
                  className={
                    selectedRaceId
                      ? styles.selectorText
                      : styles.selectorPlaceholder
                  }
                >
                  {selectedRace
                    ? selectedRace.name
                    : '请选择比赛查看奖金分配'}
                </Text>
                <Text style={{ color: '#86909C' }}>›</Text>
              </View>
            </View>
          </View>

          {selectedRace && (
            <View className={styles.prizeCard}>
              <View className={styles.prizeHeader}>
                <View className={styles.prizeHeaderInner}>
                  <Text className={styles.prizeTitle}>奖金池</Text>
                  <Text style={{ fontSize: 40, fontWeight: 700, color: '#FF9800' }}>
                    {formatMoney(selectedRace.prizePool + paidCount * FEE_PER_PIGEON)}
                  </Text>
                </View>
                <View className={styles.prizeStats}>
                  <View className={styles.prizeStat}>
                    <Text className={styles.prizeStatNum}>{paidCount}</Text>
                    <Text className={styles.prizeStatLabel}>已缴费赛鸽</Text>
                  </View>
                  <View className={styles.prizeStat}>
                    <Text className={styles.prizeStatNum}>{pigeons.length - paidCount}</Text>
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
          )}

          {racePrizeResults.length > 0 && (
            <>
              <SectionHeader title="已出成绩奖金" />
              <View className={styles.resultCard}>
                <View className={styles.resultRow} style={{ borderBottomWidth: 2, borderBottomColor: '#E5E6EB' }}>
                  <View className={styles.resultRank}>
                    <Text className={styles.resultRankNum}>名次</Text>
                  </View>
                  <View className={styles.resultInfo}>
                    <Text className={styles.resultRing}>赛鸽</Text>
                  </View>
                  <View className={styles.resultSpeed}>
                    <Text className={styles.resultSpeedVal}>分速</Text>
                  </View>
                  <View className={styles.resultPrize}>
                    <Text className={styles.resultPrizeVal}>奖金</Text>
                  </View>
                </View>
                {racePrizeResults.map((r) => (
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
              <View className={styles.settleSummary}>
                <View className={styles.settleRow}>
                  <Text className={styles.settleLabel}>应发奖金合计</Text>
                  <Text className={styles.settleValueWarn}>{formatMoney(raceTotalPrize)}</Text>
                </View>
                <View className={styles.settleRow}>
                  <Text className={styles.settleLabel}>已发放</Text>
                  <Text className={styles.settleValueGreen}>{formatMoney(racePrizePaid)}</Text>
                </View>
                <View className={styles.settleRow}>
                  <Text className={styles.settleLabel}>待发放</Text>
                  <Text className={styles.settleValueOrange}>{formatMoney(racePrizePending)}</Text>
                </View>
              </View>
            </>
          )}

          {!selectedRaceId && (
            <View className={styles.emptyBox}>
              <Text className={styles.emptyText}>请选择比赛查看奖金分配</Text>
            </View>
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
