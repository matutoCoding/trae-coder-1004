import React, { useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SectionHeader from '@/components/SectionHeader';
import PigeonCard from '@/components/PigeonCard';
import StatusTag from '@/components/StatusTag';
import { useAppStore } from '@/store';
import { mockOwnerInfo } from '@/data/mockSettlement';
import { formatMoney } from '@/utils';
import type { Pigeon } from '@/types';
import styles from './index.module.scss';

const FEE_PER_PIGEON = 2000;

const OwnerPage: React.FC = () => {
  const { pigeons, races, updatePigeon, addSettlement, settlements } = useAppStore();

  const myPigeons = useMemo(
    () => pigeons.filter((p) => p.ownerName === mockOwnerInfo.name),
    [pigeons]
  );

  const unpaidPigeons = useMemo(
    () => myPigeons.filter((p) => !p.paid),
    [myPigeons]
  );

  const upcomingRace = useMemo(
    () => races.find((r) => r.status === 'upcoming' || r.status === 'ongoing'),
    [races]
  );

  const liveRace = useMemo(
    () => races.find((r) => r.status === 'ongoing') || races[0],
    [races]
  );

  const totalPrize = useMemo(() => {
    return settlements
      .filter((s) => s.type !== 'entryFee' && s.ownerName === mockOwnerInfo.name)
      .reduce((sum, s) => sum + s.amount, 0);
  }, [settlements]);

  const services = [
    { icon: '📹', text: '在线观看', color: '#1E88E5', bg: '#E3F2FD', key: 'live' },
    { icon: '💳', text: '缴费记录', color: '#43A047', bg: '#E8F5E9', key: 'fee' },
    { icon: '🏆', text: '获奖记录', color: '#FF9800', bg: '#FFF3E0', key: 'prize' },
    { icon: '📞', text: '联系客服', color: '#E53935', bg: '#FFEBEE', key: 'contact' }
  ];

  const handleLiveClick = () => {
    Taro.navigateTo({ url: '/pages/live-stream/index' });
  };

  const handlePay = (pigeon: Pigeon) => {
    if (pigeon.paid) return;
    Taro.showModal({
      title: '确认缴费',
      content: `确认缴纳 ${pigeon.name}（${pigeon.ringNumber}）的参赛费 ¥${FEE_PER_PIGEON.toLocaleString()}？`,
      success: (res) => {
        if (!res.confirm) return;
        Taro.showLoading({ title: '支付中...' });
        setTimeout(() => {
          updatePigeon(pigeon.id, { paid: true });
          addSettlement({
            id: `fee_${Date.now()}`,
            type: 'entryFee',
            typeText: '参赛费',
            amount: FEE_PER_PIGEON,
            date: new Date().toISOString().slice(0, 10),
            pigeonName: pigeon.name,
            ownerName: pigeon.ownerName,
            status: 'completed'
          });
          Taro.hideLoading();
          Taro.showToast({ title: '缴费成功', icon: 'success' });
        }, 800);
      }
    });
  };

  const handlePayAll = () => {
    if (unpaidPigeons.length === 0) {
      Taro.showToast({ title: '暂无待缴费赛鸽', icon: 'none' });
      return;
    }
    const total = unpaidPigeons.length * FEE_PER_PIGEON;
    Taro.showModal({
      title: '批量缴费',
      content: `确认缴纳 ${unpaidPigeons.length} 羽赛鸽参赛费共计 ¥${total.toLocaleString()}？`,
      success: (res) => {
        if (!res.confirm) return;
        Taro.showLoading({ title: '支付中...' });
        setTimeout(() => {
          unpaidPigeons.forEach((p) => {
            updatePigeon(p.id, { paid: true });
            addSettlement({
              id: `fee_${Date.now()}_${p.id}`,
              type: 'entryFee',
              typeText: '参赛费',
              amount: FEE_PER_PIGEON,
              date: new Date().toISOString().slice(0, 10),
              pigeonName: p.name,
              ownerName: p.ownerName,
              status: 'completed'
            });
          });
          Taro.hideLoading();
          Taro.showToast({ title: `已成功缴费 ${unpaidPigeons.length} 羽`, icon: 'success' });
        }, 800);
      }
    });
  };

  const handleServiceClick = (key: string, text: string) => {
    if (key === 'live') {
      handleLiveClick();
      return;
    }
    if (key === 'fee') {
      Taro.switchTab({ url: '/pages/settlement/index' });
      return;
    }
    Taro.showToast({ title: `${text}功能开发中`, icon: 'none' });
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.profileHeader}>
        <View className={styles.profileTop}>
          <View className={styles.avatar}>
            <Text className={styles.avatarIcon}>👤</Text>
          </View>
          <View className={styles.profileInfo}>
            <Text className={styles.profileName}>{mockOwnerInfo.name}</Text>
            <Text className={styles.profilePhone}>{mockOwnerInfo.phone}</Text>
            <Text className={styles.profileId}>会员编号：{mockOwnerInfo.memberId}</Text>
          </View>
        </View>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{myPigeons.length}</Text>
            <Text className={styles.statLabel}>在棚赛鸽</Text>
          </View>
          <View className={styles.statDivider}></View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>
              {settlements.filter((s) => s.ownerName === mockOwnerInfo.name).length}
            </Text>
            <Text className={styles.statLabel}>交易笔数</Text>
          </View>
          <View className={styles.statDivider}></View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatMoney(totalPrize)}</Text>
            <Text className={styles.statLabel}>累计奖金</Text>
          </View>
        </View>
      </View>

      <View className={styles.serviceGrid}>
        {services.map((s, idx) => (
          <View
            key={idx}
            className={styles.serviceItem}
            onClick={() => handleServiceClick(s.key, s.text)}
          >
            <View className={styles.serviceIcon} style={{ backgroundColor: s.bg }}>
              <Text style={{ color: s.color }}>{s.icon}</Text>
            </View>
            <Text className={styles.serviceText}>{s.text}</Text>
          </View>
        ))}
      </View>

      {liveRace && (
        <View className={styles.section}>
          <SectionHeader title="在线观看" />
          <View className={styles.liveCard} onClick={handleLiveClick}>
            <View className={styles.liveHeader}>
              <View className={styles.liveTitle}>
                <View className={styles.liveBadge}>
                  <View className={styles.liveDot}></View>
                  <Text className={styles.liveBadgeText}>
                    {liveRace.status === 'ongoing' ? '直播中' : '即将开始'}
                  </Text>
                </View>
                <Text className={styles.liveName}>{liveRace.name}</Text>
              </View>
              <Text style={{ fontSize: 24, color: '#86909C' }}>›</Text>
            </View>
            <View className={styles.liveInfo}>
              <View className={styles.liveInfoItem}>
                <Text className={styles.liveInfoValue}>{liveRace.location}</Text>
                <Text className={styles.liveInfoLabel}>放飞地点</Text>
              </View>
              <View className={styles.liveInfoItem}>
                <Text className={styles.liveInfoValue}>{liveRace.distance}km</Text>
                <Text className={styles.liveInfoLabel}>空距</Text>
              </View>
              <View className={styles.liveInfoItem}>
                <Text className={styles.liveInfoValue}>{liveRace.totalPigeons}羽</Text>
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
        <View className={styles.feeHeader}>
          <SectionHeader title="参赛费结算" />
          {unpaidPigeons.length > 0 && (
            <Button className={styles.payAllBtn} onClick={handlePayAll}>
              一键缴费({unpaidPigeons.length}羽)
            </Button>
          )}
        </View>
        <View className={styles.feeSummary}>
          <View className={styles.feeSummaryItem}>
            <Text className={styles.feeSummaryLabel}>应缴合计</Text>
            <Text className={styles.feeSummaryValue}>
              {formatMoney(unpaidPigeons.length * FEE_PER_PIGEON)}
            </Text>
          </View>
          <View className={styles.feeSummaryItem}>
            <Text className={styles.feeSummaryLabel}>已缴</Text>
            <StatusTag
              status="success"
              text={`${myPigeons.length - unpaidPigeons.length}/${myPigeons.length} 羽`}
            />
          </View>
        </View>
        {myPigeons.map((pigeon) => (
          <View key={pigeon.id} className={styles.feeCard}>
            <View className={styles.feeRow}>
              <View className={styles.feeInfo}>
                <Text className={styles.feeName}>{pigeon.name}</Text>
                <Text className={styles.feeDesc}>足环号：{pigeon.ringNumber}</Text>
              </View>
              <View className={styles.feeAction}>
                <Text className={styles.feeAmount}>¥{FEE_PER_PIGEON.toLocaleString()}</Text>
                <Button
                  className={`${styles.payBtn} ${pigeon.paid ? styles.paid : ''}`}
                  onClick={() => handlePay(pigeon)}
                >
                  {pigeon.paid ? '已缴费' : '立即缴费'}
                </Button>
              </View>
            </View>
          </View>
        ))}
        {myPigeons.length === 0 && (
          <View className={styles.emptyBox}>
            <Text className={styles.emptyText}>您暂未登记赛鸽</Text>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <SectionHeader title="我的赛鸽" extra={`全部(${myPigeons.length})`} />
        {myPigeons.map((pigeon) => (
          <PigeonCard key={pigeon.id} pigeon={pigeon} />
        ))}
        {myPigeons.length === 0 && (
          <View className={styles.emptyBox}>
            <Text className={styles.emptyText}>暂无赛鸽记录</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default OwnerPage;
