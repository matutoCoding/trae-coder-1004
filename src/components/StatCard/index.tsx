import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit = '',
  color = '#1E88E5',
  bgColor = '#E3F2FD'
}) => {
  return (
    <View className={styles.card} style={{ backgroundColor: bgColor }}>
      <View className={styles.valueWrap}>
        <Text className={styles.value} style={{ color }}>{value}</Text>
        {unit && <Text className={styles.unit} style={{ color }}>{unit}</Text>}
      </View>
      <Text className={styles.label}>{label}</Text>
    </View>
  );
};

export default StatCard;
