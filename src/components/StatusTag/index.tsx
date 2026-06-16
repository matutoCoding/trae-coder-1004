import React from 'react';
import { View, Text } from '@tarojs/components';
import { getStatusColor, getStatusBgColor } from '@/utils';
import styles from './index.module.scss';

interface StatusTagProps {
  status: string;
  text: string;
}

const StatusTag: React.FC<StatusTagProps> = ({ status, text }) => {
  return (
    <View
      className={styles.tag}
      style={{
        backgroundColor: getStatusBgColor(status),
        color: getStatusColor(status)
      }}
    >
      <Text>{text}</Text>
    </View>
  );
};

export default StatusTag;
