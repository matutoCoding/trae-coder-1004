import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { Pigeon } from '@/types';
import StatusTag from '@/components/StatusTag';
import styles from './index.module.scss';

interface PigeonCardProps {
  pigeon: Pigeon;
  onClick?: () => void;
}

const PigeonCard: React.FC<PigeonCardProps> = ({ pigeon, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/pigeon-detail/index?id=${pigeon.id}`
      });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.left}>
        <View className={styles.avatarPlaceholder}>
          <Text className={styles.avatarIcon}>🕊</Text>
        </View>
      </View>
      <View className={styles.right}>
        <View className={styles.row}>
          <Text className={styles.name}>{pigeon.name}</Text>
          <StatusTag status={pigeon.status} text={pigeon.statusText} />
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.info}>足环：{pigeon.ringNumber}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.info}>电子环：{pigeon.electronicRing}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.info}>鸽主：{pigeon.ownerName}</Text>
          <Text className={styles.info}>棚位：{pigeon.loftArea}</Text>
        </View>
        <View className={styles.statsRow}>
          <View className={styles.stat}>
            <Text className={styles.statNum}>{pigeon.raceCount || 0}</Text>
            <Text className={styles.statLabel}>比赛</Text>
          </View>
          <View className={styles.stat}>
            <StatusTag
              status={pigeon.paid ? 'success' : 'warning'}
              text={pigeon.paid ? '已缴费' : '未缴费'}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PigeonCard;
