import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import StatCard from '@/components/StatCard';
import SectionHeader from '@/components/SectionHeader';
import RaceCard from '@/components/RaceCard';
import { useAppStore } from '@/store';
import { mockAnnouncements } from '@/data/mockRaces';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { pigeons, loftAreas, races, hydrate } = useAppStore();

  const totalPigeons = useMemo(() => pigeons.length, [pigeons]);
  const totalLoftCapacity = useMemo(
    () => loftAreas.reduce((sum, loft) => sum + loft.capacity, 0),
    [loftAreas]
  );
  const totalLoftUsed = useMemo(
    () => loftAreas.reduce((sum, loft) => sum + loft.used, 0),
    [loftAreas]
  );
  const activeRaces = useMemo(
    () => races.filter((r) => r.status !== 'completed').length,
    [races]
  );
  const totalPrizePool = useMemo(
    () => races.reduce((sum, r) => sum + r.prizePool, 0) + pigeons.filter(p => p.paid).length * 2000,
    [races, pigeons]
  );

  const quickActions = [
    { icon: '🏠', text: '鸽舍管理', color: '#1E88E5', bg: '#E3F2FD', path: '/pages/loft/index', isTab: true },
    { icon: '📝', text: '收鸽登记', color: '#43A047', bg: '#E8F5E9', path: '/pages/pigeon-register/index', isTab: false },
    { icon: '🏁', text: '比赛中心', color: '#FF9800', bg: '#FFF3E0', path: '/pages/race/index', isTab: true },
    { icon: '💰', text: '奖金结算', color: '#E53935', bg: '#FFEBEE', path: '/pages/settlement/index', isTab: true }
  ];

  const handleQuickAction = (path: string, isTab: boolean) => {
    if (isTab) {
      Taro.switchTab({ url: path });
    } else {
      Taro.navigateTo({ url: path });
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    hydrate();
    setTimeout(() => {
      setLoading(false);
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 600);
  };

  return (
    <ScrollView
      scrollY
      className={styles.page}
      style={{ padding: `0 ${32}rpx` }}
      refresherEnabled
      refresherTriggered={loading}
      onRefresherRefresh={handleRefresh}
    >
      <View className={styles.hero}>
        <Text className={styles.heroTitle}>赛鸽公棚管理系统</Text>
        <Text className={styles.heroSubtitle}>专业的赛鸽训养比赛一体化管理平台</Text>
      </View>

      <View className={styles.quickGrid}>
        {quickActions.map((action, idx) => (
          <View
            key={idx}
            className={styles.quickItem}
            onClick={() => handleQuickAction(action.path, action.isTab)}
          >
            <View
              className={styles.quickIcon}
              style={{ backgroundColor: action.bg }}
            >
              <Text style={{ color: action.color }}>{action.icon}</Text>
            </View>
            <Text className={styles.quickText}>{action.text}</Text>
          </View>
        ))}
      </View>

      <View className={styles.statSection}>
        <SectionHeader title="数据概览" />
        <View className={styles.statRow}>
          <StatCard label="在棚赛鸽" value={totalPigeons} unit="羽" color="#1E88E5" bgColor="#E3F2FD" />
          <StatCard label="棚位使用" value={`${totalLoftUsed}/${totalLoftCapacity}`} color="#43A047" bgColor="#E8F5E9" />
        </View>
        <View className={styles.statRow} style={{ marginTop: 24 }}>
          <StatCard label="进行中比赛" value={activeRaces} unit="场" color="#FF9800" bgColor="#FFF3E0" />
          <StatCard label="总奖金池" value={`¥${(totalPrizePool / 10000).toFixed(1)}万`} color="#E53935" bgColor="#FFEBEE" />
        </View>
      </View>

      <View>
        <SectionHeader title="近期比赛" extra="查看全部" onExtraClick={() => Taro.switchTab({ url: '/pages/race/index' })} />
        {races.slice(0, 3).map((race) => (
          <RaceCard key={race.id} race={race} />
        ))}
      </View>

      <View>
        <SectionHeader title="最新公告" />
        <View className={styles.announcementCard}>
          {mockAnnouncements.map((item) => (
            <View key={item.id} className={styles.announcementItem}>
              <Text className={styles.announcementTitle}>{item.title}</Text>
              <View className={styles.announcementMeta}>
                <Text className={styles.announcementType}>
                  {item.type === 'race' ? '比赛' : item.type === 'notice' ? '通知' : '系统'}
                </Text>
                <Text className={styles.announcementDate}>{item.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;
