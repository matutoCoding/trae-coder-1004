import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const RaceDetailPage: React.FC = () => {
  const { races, raceResults, pigeons } = useAppStore();

  const raceId = useMemo(() => {
    const inst = Taro.getCurrentInstance();
    return inst?.router?.params?.id || '';
  }, []);

  const race = useMemo(
    () => races.find((r) => r.id === raceId),
    [races, raceId]
  );

  const thisRaceResults = useMemo(
    () =>
      raceResults
        .filter((r) => r.raceId === raceId)
        .sort((a, b) => a.rank - b.rank),
    [raceResults, raceId]
  );

  const returnedRings = useMemo(
    () => new Set(thisRaceResults.map((r) => r.ringNumber)),
    [thisRaceResults]
  );

  const unreturnedPigeons = useMemo(
    () => pigeons.filter((p) => !returnedRings.has(p.ringNumber)),
    [pigeons, returnedRings]
  );

  const returnPercent = useMemo(() => {
    if (!race || race.totalPigeons === 0) return 0;
    return Math.round((race.returnedCount / race.totalPigeons) * 100);
  }, [race]);

  const handleBack = () => {
    Taro.navigateBack({ delta: 1 }).catch(() =>
      Taro.switchTab({ url: '/pages/race/index' })
    );
  };

  if (!race) {
    return (
      <View className={styles.page}>
        <View className={styles.header}>
          <View className={styles.backBtn} onClick={handleBack}>
            <Text className={styles.backIcon}>‹</Text>
          </View>
          <Text className={styles.headerTitle}>比赛详情</Text>
          <View style={{ width: 64 }}></View>
        </View>
        <View className={styles.emptyBox}>
          <Text className={styles.emptyText}>未找到比赛信息</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.backBtn} onClick={handleBack}>
          <Text className={styles.backIcon}>‹</Text>
        </View>
        <Text className={styles.headerTitle}>比赛详情</Text>
        <View style={{ width: 64 }}></View>
      </View>

      <View className={styles.infoCard}>
        <View style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 40 }}>🏁</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 32, fontWeight: 600, color: '#1D2129' }}>{race.name}</Text>
          </View>
          <StatusTag status={race.status} text={race.statusText} />
        </View>
        <View className={styles.infoGrid}>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>比赛类型</Text>
            <Text className={styles.infoValue}>{race.typeText}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>放飞地点</Text>
            <Text className={styles.infoValue}>{race.location}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>空距</Text>
            <Text className={styles.infoValue}>{race.distance} km</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>比赛日期</Text>
            <Text className={styles.infoValue}>{race.date}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>放飞时间</Text>
            <Text className={styles.infoValue}>{race.releaseTime || '待放飞'}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>天气</Text>
            <Text className={styles.infoValue}>{race.weather}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>参赛羽数</Text>
            <Text className={styles.infoValue}>{race.totalPigeons} 羽</Text>
          </View>
        </View>
      </View>

      <View className={styles.progressCard}>
        <Text className={styles.sectionTitle}>归巢进度</Text>
        <View className={styles.progressBar}>
          <View
            className={styles.progressFill}
            style={{ width: `${returnPercent}%` }}
          ></View>
        </View>
        <Text className={styles.progressText}>
          已归巢 {race.returnedCount}/{race.totalPigeons}（{returnPercent}%）
        </Text>
        <View className={styles.statRow}>
          <View className={styles.statBox}>
            <Text className={styles.statNum}>{race.totalPigeons}</Text>
            <Text className={styles.statLabel}>参赛</Text>
          </View>
          <View className={styles.statDivider}></View>
          <View className={styles.statBox}>
            <Text className={styles.statNumGreen}>{race.returnedCount}</Text>
            <Text className={styles.statLabel}>已归巢</Text>
          </View>
          <View className={styles.statDivider}></View>
          <View className={styles.statBox}>
            <Text className={styles.statNumOrange}>
              {race.totalPigeons - race.returnedCount}
            </Text>
            <Text className={styles.statLabel}>未归巢</Text>
          </View>
        </View>
      </View>

      {unreturnedPigeons.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text className={styles.sectionTitle}>
            未归巢名单（{unreturnedPigeons.length}羽）
          </Text>
          <View className={styles.unreturnedList}>
            {unreturnedPigeons.map((p) => (
              <View key={p.id} className={styles.unreturnedRow}>
                <View style={{ flex: 1 }}>
                  <Text className={styles.unreturnedRing}>{p.ringNumber}</Text>
                  <Text className={styles.unreturnedOwner}>
                    {p.ownerName} · {p.loftArea}
                  </Text>
                </View>
                <StatusTag status="lost" text="未归巢" />
              </View>
            ))}
          </View>
        </View>
      )}

      <Text className={styles.sectionTitle}>
        成绩排名（{thisRaceResults.length}羽）
      </Text>
      {thisRaceResults.length > 0 ? (
        <View className={styles.resultTable}>
          <View className={styles.tableHeader}>
            <View className={styles.colRank}>名次</View>
            <View className={styles.colPigeon}>赛鸽信息</View>
            <View className={styles.colSpeed}>分速</View>
          </View>
          {thisRaceResults.map((result) => {
            const rankClass = result.rank <= 3 ? `top${result.rank}` : 'normal';
            return (
              <View
                key={`${result.raceId}-${result.ringNumber}`}
                className={styles.tableRow}
              >
                <View className={styles.colRank}>
                  <View className={`${styles.rankBadge} ${styles[rankClass]}`}>
                    <Text>{result.rank}</Text>
                  </View>
                </View>
                <View className={styles.colPigeon}>
                  <View className={styles.pigeonInfo}>
                    <Text className={styles.pigeonRing}>{result.ringNumber}</Text>
                    <Text className={styles.pigeonOwner}>
                      鸽主：{result.ownerName}
                    </Text>
                    <Text className={styles.pigeonDuration}>
                      {result.duration} · 归巢 {result.returnTime}
                    </Text>
                  </View>
                </View>
                <View className={styles.colSpeed}>
                  <Text className={styles.speedValue}>
                    {result.speed.toFixed(0)}
                  </Text>
                  <Text className={styles.speedUnit}> m/分</Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View className={styles.emptyBox}>
          <Text className={styles.emptyText}>暂无归巢成绩</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default RaceDetailPage;
