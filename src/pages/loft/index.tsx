import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SectionHeader from '@/components/SectionHeader';
import PigeonCard from '@/components/PigeonCard';
import StatusTag from '@/components/StatusTag';
import StatCard from '@/components/StatCard';
import { mockPigeons, mockLoftAreas } from '@/data/mockPigeons';
import styles from './index.module.scss';

const LoftPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'loft' | 'pigeon'>('loft');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleAddPigeon = () => {
    console.log('[Loft] Navigate to register page');
    Taro.navigateTo({ url: '/pages/pigeon-register/index' });
  };

  const handleAddLoft = () => {
    console.log('[Loft] Add new loft');
    Taro.showToast({ title: '新增鸽舍功能开发中', icon: 'none' });
  };

  const filteredPigeons = filterStatus === 'all'
    ? mockPigeons
    : mockPigeons.filter(p => p.status === filterStatus);

  const totalCapacity = mockLoftAreas.reduce((s, l) => s + l.capacity, 0);
  const totalUsed = mockLoftAreas.reduce((s, l) => s + l.used, 0);

  const statusFilters = [
    { key: 'all', label: '全部' },
    { key: 'healthy', label: '健康' },
    { key: 'training', label: '训练中' },
    { key: 'racing', label: '比赛中' },
    { key: 'returned', label: '已归巢' },
    { key: 'lost', label: '未归巢' }
  ];

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.tabs}>
        <View
          className={`${styles.tabItem} ${activeTab === 'loft' ? styles.active : ''}`}
          onClick={() => setActiveTab('loft')}
        >
          棚位管理
        </View>
        <View
          className={`${styles.tabItem} ${activeTab === 'pigeon' ? styles.active : ''}`}
          onClick={() => setActiveTab('pigeon')}
        >
          赛鸽列表
        </View>
      </View>

      {activeTab === 'loft' ? (
        <>
          <View className={styles.actionBar}>
            <Button className={styles.actionBtn} onClick={handleAddPigeon}>
              + 收鸽登记
            </Button>
            <Button className={`${styles.actionBtn} ${styles.secondary}`} onClick={handleAddLoft}>
              + 新增棚位
            </Button>
          </View>

          <View style={{ marginBottom: 24 }}>
            <View style={{ display: 'flex', gap: 24 }}>
              <StatCard label="总棚位" value={totalCapacity} unit="个" color="#1E88E5" bgColor="#E3F2FD" />
              <StatCard label="已使用" value={totalUsed} unit="个" color="#43A047" bgColor="#E8F5E9" />
            </View>
          </View>

          <SectionHeader title="棚位列表" />
          {mockLoftAreas.map(loft => {
            const usagePercent = Math.round((loft.used / loft.capacity) * 100);
            return (
              <View key={loft.id} className={styles.loftCard}>
                <View className={styles.loftHeader}>
                  <Text className={styles.loftName}>{loft.name}</Text>
                  <StatusTag
                    status={loft.status}
                    text={loft.status === 'normal' ? '正常' : loft.status === 'full' ? '已满' : '维护中'}
                  />
                </View>
                <View className={styles.loftMeta}>
                  <View className={styles.metaItem}>
                    <Text>区域：{loft.area}</Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text>管理员：{loft.manager}</Text>
                  </View>
                </View>
                <View className={styles.progressBar}>
                  <View className={styles.progressFill} style={{ width: `${usagePercent}%` }}></View>
                </View>
                <View className={styles.progressText}>
                  已使用 {loft.used} / {loft.capacity}（{usagePercent}%）
                </View>
              </View>
            );
          })}
        </>
      ) : (
        <>
          <View className={styles.actionBar}>
            <Button className={styles.actionBtn} onClick={handleAddPigeon}>
              + 收鸽登记
            </Button>
          </View>

          <View className={styles.filterBar}>
            {statusFilters.map(f => (
              <View
                key={f.key}
                className={`${styles.filterTag} ${filterStatus === f.key ? styles.active : ''}`}
                onClick={() => setFilterStatus(f.key)}
              >
                {f.label}
              </View>
            ))}
          </View>

          <SectionHeader title={`赛鸽列表 (${filteredPigeons.length}羽)`} />
          {filteredPigeons.map(pigeon => (
            <PigeonCard key={pigeon.id} pigeon={pigeon} />
          ))}
        </>
      )}
    </ScrollView>
  );
};

export default LoftPage;
