import React from 'react';
import { View, Text, ScrollView, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SectionHeader from '@/components/SectionHeader';
import PigeonCard from '@/components/PigeonCard';
import { mockPigeons } from '@/data/mockPigeons';
import { mockOwnerInfo } from '@/data/mockSettlement';
import { mockRaces } from '@/data/mockRaces';
import { formatMoney } from '@/utils';
import styles from './index.module.scss';

const OwnerPage: React.FC = () => {
  const myPigeons = mockPigeons.filter(p => p.ownerName === mockOwnerInfo.name);
  const upcomingRace = mockRaces.find(r => r.status === 'upcoming');
  const unpaidPigeons = myPigeons.filter(p => p.feeStatus === 'unpaid');

  const services = [
    { icon: '📹', text: '在线观看', color: '#1E88E5', bg: '#E3F2FD' },
    { icon: '💳', text: '缴费记录', color: '#43A047', bg: '#E8F5E9' },
    { icon: '🏆', text: '获奖记录', color: '#FF9800', bg: '#FFF3E0' },
    { icon: '📞', text: '联系客服', color: '#E53935', bg: '#FFEBEE' }
  ];

  const handleLiveClick = () => {
    console.log('[Owner] Click live stream');
    Taro.showToast({ title: '直播功能开发中', icon: 'none' });
  };

  const handlePay = (pigeonName: string) => {
    console.log('[Owner] Pay fee for:', pigeonName);
    Taro.showModal({
      title: '确认缴费',
      content: `确认缴纳 ${pigeonName} 的参赛费 ¥2,000？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '缴费成功', icon: 'success' });
        }
      }
    });
  };

  const handleServiceClick = (text: string) => {
    console.log('[Owner] Click service:', text);
    Taro.showToast({ title: `${text}功能开发中`, icon: 'none' });
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.profileHeader}>
        <View className={styles.profileTop}>
          <Image className={styles.avatar} src={mockOwnerInfo.avatar} mode="aspectFill" />
          <View className={styles.profileInfo}>
            <Text className={styles.profileName}>{mockOwnerInfo.name}</Text>
            <Text className={styles.profilePhone}>{mockOwnerInfo.phone}</Text>
            <Text className={styles.profileId}>会员编号：{mockOwnerInfo.memberId}</Text>
          </View>
        </View>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{mockOwnerInfo.totalPigeons}</Text>
            <Text className={styles.statLabel}>在棚赛鸽</Text>
          </View>
          <View className={styles.statDivider}></View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{mockOwnerInfo.totalRaces}</Text>
            <Text className={styles.statLabel}>参赛次数</Text>
          </View>
          <View className={styles.statDivider}></View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatMoney(mockOwnerInfo.totalPrize)}</Text>
            <Text className={styles.statLabel}>累计奖金</Text>
          </View>
        </View>
      </View>

      <View className={styles.serviceGrid}>
        {services.map((s, idx) => (
          <View
            key={idx}
            className={styles.serviceItem}
            onClick={() => handleServiceClick(s.text)}
          >
            <View className={styles.serviceIcon} style={{ backgroundColor: s.bg }}>
              <Text style={{ color: s.color }}>{s.icon}</Text>
            </View>
            <Text className={styles.serviceText}>{s.text}</Text>
          </View>
        ))}
      </View>

      {upcomingRace && (
        <View className={styles.section}>
          <SectionHeader title="在线观看" />
          <View className={styles.liveCard} onClick={handleLiveClick}>
            <View className={styles.liveHeader}>
              <View className={styles.liveTitle}>
                <View className={styles.liveBadge}>
                  <View className={styles.liveDot}></View>
                  <Text className={styles.liveBadgeText}>直播中</Text>
                </View>
                <Text className={styles.liveName}>{upcomingRace.name}</Text>
              </View>
              <Text style={{ fontSize: 24, color: '#86909C' }}>›</Text>
            </View>
            <View className={styles.liveInfo}>
              <View className={styles.liveInfoItem}>
                <Text className={styles.liveInfoValue}>{upcomingRace.location}</Text>
                <Text className={styles.liveInfoLabel}>放飞地点</Text>
              </View>
              <View className={styles.liveInfoItem}>
                <Text className={styles.liveInfoValue}>{upcomingRace.distance}km</Text>
                <Text className={styles.liveInfoLabel}>空距</Text>
              </View>
              <View className={styles.liveInfoItem}>
                <Text className={styles.liveInfoValue}>{upcomingRace.totalPigeons}羽</Text>
                <Text className={styles.liveInfoLabel}>参赛羽数</Text>
              </View>
            </View>
            <View className={styles.livePreview}>
              <View className={styles.livePlayIcon}>
                <Text>▶</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View className={styles.section}>
        <SectionHeader title="参赛费结算" />
        {myPigeons.map(pigeon => (
          <View key={pigeon.id} className={styles.feeCard}>
            <View className={styles.feeRow}>
              <View className={styles.feeInfo}>
                <Text className={styles.feeName}>{pigeon.name}</Text>
                <Text className={styles.feeDesc}>足环号：{pigeon.ringNumber}</Text>
              </View>
              <View className={styles.feeAction}>
                <Text className={styles.feeAmount}>¥2,000</Text>
                <Button
                  className={`${styles.payBtn} ${pigeon.feeStatus === 'paid' ? styles.paid : ''}`}
                  onClick={() => pigeon.feeStatus === 'unpaid' && handlePay(pigeon.name)}
                >
                  {pigeon.feeStatus === 'paid' ? '已缴费' : '立即缴费'}
                </Button>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <SectionHeader title="我的赛鸽" extra={`全部(${myPigeons.length})`} />
        {myPigeons.map(pigeon => (
          <PigeonCard key={pigeon.id} pigeon={pigeon} />
        ))}
      </View>
    </ScrollView>
  );
};

export default OwnerPage;
