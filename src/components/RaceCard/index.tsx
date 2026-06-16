import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { Race } from '@/types';
import StatusTag from '@/components/StatusTag';
import { calcReturnRate, formatMoney } from '@/utils';
import styles from './index.module.scss';

interface RaceCardProps {
  race: Race;
  onClick?: () => void;
}

const RaceCard: React.FC<RaceCardProps> = ({ race, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/race-detail/index?id=${race.id}`
      });
    }
  };

  const returnRate = calcReturnRate(race.returnedCount, race.totalPigeons);

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <View className={styles.typeBadge}>
          <Text className={styles.typeText}>{race.typeText}</Text>
        </View>
        <StatusTag status={race.status} text={race.statusText} />
      </View>
      <Text className={styles.name}>{race.name}</Text>
      <View className={styles.infoGrid}>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>比赛日期</Text>
          <Text className={styles.infoValue}>{race.date}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>放飞时间</Text>
          <Text className={styles.infoValue}>{race.releaseTime}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>放飞地点</Text>
          <Text className={styles.infoValue}>{race.location}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>空距</Text>
          <Text className={styles.infoValue}>{race.distance} 公里</Text>
        </View>
      </View>
      <View className={styles.statsBar}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{race.totalPigeons}</Text>
          <Text className={styles.statLabel}>参赛羽数</Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{race.returnedCount}</Text>
          <Text className={styles.statLabel}>归巢羽数</Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{returnRate}</Text>
          <Text className={styles.statLabel}>归巢率</Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.statItem}>
          <Text className={styles.statValuePrize}>{formatMoney(race.prizePool)}</Text>
          <Text className={styles.statLabel}>奖金池</Text>
        </View>
      </View>
    </View>
  );
};

export default RaceCard;
