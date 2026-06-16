import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SectionHeader from '@/components/SectionHeader';
import RaceCard from '@/components/RaceCard';
import StatusTag from '@/components/StatusTag';
import { mockRaces, mockTrainingRecords, mockRaceResults } from '@/data/mockRaces';
import styles from './index.module.scss';

const RacePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'race' | 'training' | 'result'>('race');

  const handleRowClick = (pigeonId: string) => {
    console.log('[Race] Click pigeon:', pigeonId);
    Taro.navigateTo({ url: `/pages/pigeon-detail/index?id=${pigeonId}` });
  };

  const typeIcons: Record<string, { icon: string; className: string }> = {
    home: { icon: '🏠', className: 'home' },
    short: { icon: '📍', className: 'short' },
    long: { icon: '🗺️', className: 'long' }
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.tabs}>
        <View
          className={`${styles.tabItem} ${activeTab === 'race' ? styles.active : ''}`}
          onClick={() => setActiveTab('race')}
        >
          比赛管理
        </View>
        <View
          className={`${styles.tabItem} ${activeTab === 'training' ? styles.active : ''}`}
          onClick={() => setActiveTab('training')}
        >
          训放记录
        </View>
        <View
          className={`${styles.tabItem} ${activeTab === 'result' ? styles.active : ''}`}
          onClick={() => setActiveTab('result')}
        >
          成绩排名
        </View>
      </View>

      {activeTab === 'race' && (
        <>
          <SectionHeader title="比赛列表" />
          {mockRaces.map(race => (
            <RaceCard key={race.id} race={race} />
          ))}
        </>
      )}

      {activeTab === 'training' && (
        <>
          <SectionHeader title="训放记录" />
          {mockTrainingRecords.map(record => {
            const typeInfo = typeIcons[record.type];
            return (
              <View key={record.id} className={styles.trainingCard}>
                <View className={styles.trainingHeader}>
                  <View className={styles.trainingType}>
                    <View className={`${styles.typeIcon} ${styles[typeInfo.className]}`}>
                      <Text>{typeInfo.icon}</Text>
                    </View>
                    <Text className={styles.trainingName}>{record.typeText}</Text>
                  </View>
                  <StatusTag status={record.status} text={record.statusText} />
                </View>
                <View className={styles.trainingInfo}>
                  <View className={styles.infoCol}>
                    <Text className={styles.infoValue}>{record.location}</Text>
                    <Text className={styles.infoLabel}>放飞地点</Text>
                  </View>
                  <View className={styles.infoCol}>
                    <Text className={styles.infoValue}>
                      {record.distance > 0 ? `${record.distance}km` : '家飞'}
                    </Text>
                    <Text className={styles.infoLabel}>训练距离</Text>
                  </View>
                  <View className={styles.infoCol}>
                    <Text className={styles.infoValue}>{record.date}</Text>
                    <Text className={styles.infoLabel}>训练日期</Text>
                  </View>
                </View>
                <View className={styles.trainingMeta}>
                  <Text>参赛：{record.totalPigeons} 羽</Text>
                  <Text>归巢：{record.returnedCount}/{record.totalPigeons}</Text>
                </View>
              </View>
            );
          })}
        </>
      )}

      {activeTab === 'result' && (
        <>
          <SectionHeader title="2024秋季大奖赛-决赛 成绩排名" />
          <View className={styles.resultTable}>
            <View className={styles.tableHeader}>
              <View className={styles.colRank}>名次</View>
              <View className={styles.colPigeon}>赛鸽信息</View>
              <View className={styles.colSpeed}>分速</View>
            </View>
            {mockRaceResults.map(result => {
              const rankClass = result.rank <= 3 ? `top${result.rank}` : 'normal';
              return (
                <View
                  key={result.rank}
                  className={styles.tableRow}
                  onClick={() => handleRowClick(result.pigeonId)}
                >
                  <View className={styles.colRank}>
                    <View className={`${styles.rankBadge} ${styles[rankClass]}`}>
                      <Text>{result.rank}</Text>
                    </View>
                  </View>
                  <View className={styles.colPigeon}>
                    <View className={styles.pigeonInfo}>
                      <Text className={styles.pigeonRing}>{result.ringNumber}</Text>
                      <Text className={styles.pigeonOwner}>鸽主：{result.ownerName}</Text>
                    </View>
                  </View>
                  <View className={styles.colSpeed}>
                    <Text className={styles.speedValue}>{result.speed.toFixed(0)}</Text>
                    <Text className={styles.speedUnit}> m/分</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default RacePage;
