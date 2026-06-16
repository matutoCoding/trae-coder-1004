import React, { useState } from 'react';
import { View, Text, ScrollView, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SectionHeader from '@/components/SectionHeader';
import PigeonCard from '@/components/PigeonCard';
import StatusTag from '@/components/StatusTag';
import StatCard from '@/components/StatCard';
import { useAppStore } from '@/store';
import type { LoftArea } from '@/types';
import styles from './index.module.scss';

const LoftPage: React.FC = () => {
  const { pigeons, loftAreas, addLoftArea, updateLoftArea } = useAppStore();
  const [activeTab, setActiveTab] = useState<'loft' | 'pigeon'>('loft');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddLoft, setShowAddLoft] = useState(false);
  const [newLoft, setNewLoft] = useState({
    name: '',
    capacity: '',
    area: 'A区',
    manager: ''
  });

  const handleAddPigeon = () => {
    Taro.navigateTo({ url: '/pages/pigeon-register/index' });
  };

  const handleToggleLoftStatus = (loft: LoftArea) => {
    if (loft.status === 'full') {
      Taro.showToast({ title: '已满棚位不可切换', icon: 'none' });
      return;
    }
    const next = loft.status === 'normal' ? 'maintenance' : 'normal';
    updateLoftArea(loft.id, {
      status: next,
      statusText: next === 'normal' ? '正常' : '维护中'
    });
    Taro.showToast({
      title: `已切换为${next === 'normal' ? '正常' : '维护中'}`,
      icon: 'success'
    });
  };

  const handleSubmitNewLoft = () => {
    if (!newLoft.name.trim()) {
      Taro.showToast({ title: '请输入棚位名称', icon: 'none' });
      return;
    }
    const cap = parseInt(newLoft.capacity, 10);
    if (!cap || cap <= 0) {
      Taro.showToast({ title: '请输入有效容量', icon: 'none' });
      return;
    }
    if (!newLoft.manager.trim()) {
      Taro.showToast({ title: '请输入管理员', icon: 'none' });
      return;
    }
    const loft: LoftArea = {
      id: `loft_${Date.now()}`,
      name: newLoft.name.trim(),
      capacity: cap,
      used: 0,
      area: newLoft.area,
      manager: newLoft.manager.trim(),
      status: 'normal',
      statusText: '正常'
    };
    addLoftArea(loft);
    setShowAddLoft(false);
    setNewLoft({ name: '', capacity: '', area: 'A区', manager: '' });
    Taro.showToast({ title: '棚位新增成功', icon: 'success' });
  };

  const filteredPigeons =
    filterStatus === 'all'
      ? pigeons
      : pigeons.filter((p) => p.status === filterStatus);

  const totalCapacity = loftAreas.reduce((s, l) => s + l.capacity, 0);
  const totalUsed = loftAreas.reduce((s, l) => s + l.used, 0);

  const statusFilters = [
    { key: 'all', label: '全部' },
    { key: 'healthy', label: '健康' },
    { key: 'health', label: '健康' },
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
            <Button
              className={`${styles.actionBtn} ${styles.secondary}`}
              onClick={() => setShowAddLoft(!showAddLoft)}
            >
              {showAddLoft ? '取消' : '+ 新增棚位'}
            </Button>
          </View>

          {showAddLoft && (
            <View className={styles.addLoftCard}>
              <Text className={styles.formTitle}>新增棚位</Text>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>
                  <Text className={styles.required}>*</Text>
                  棚位名称
                </Text>
                <Input
                  className={styles.formInput}
                  placeholder="如：A-01区"
                  value={newLoft.name}
                  onInput={(e) => setNewLoft({ ...newLoft, name: e.detail.value })}
                />
              </View>

              <View className={styles.formRow}>
                <View className={`${styles.formItem} ${styles.formRowItem}`}>
                  <Text className={styles.formLabel}>
                    <Text className={styles.required}>*</Text>
                    容量(羽)
                  </Text>
                  <Input
                    className={styles.formInput}
                    type="number"
                    placeholder="如：30"
                    value={newLoft.capacity}
                    onInput={(e) =>
                      setNewLoft({ ...newLoft, capacity: e.detail.value })
                    }
                  />
                </View>
                <View className={`${styles.formItem} ${styles.formRowItem}`}>
                  <Text className={styles.formLabel}>区域</Text>
                  <View
                    className={styles.loftSelector}
                    onClick={() => {
                      Taro.showActionSheet({
                        itemList: ['A区', 'B区', 'C区', 'D区'],
                        success: (res) => {
                          const areas = ['A区', 'B区', 'C区', 'D区'];
                          setNewLoft({ ...newLoft, area: areas[res.tapIndex] });
                        }
                      });
                    }}
                  >
                    <Text className={styles.loftText}>{newLoft.area}</Text>
                    <Text style={{ color: '#86909C' }}>›</Text>
                  </View>
                </View>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>
                  <Text className={styles.required}>*</Text>
                  管理员
                </Text>
                <Input
                  className={styles.formInput}
                  placeholder="如：张师傅"
                  value={newLoft.manager}
                  onInput={(e) =>
                    setNewLoft({ ...newLoft, manager: e.detail.value })
                  }
                />
              </View>

              <Button className={styles.submitBtn} onClick={handleSubmitNewLoft}>
                保存棚位
              </Button>
            </View>
          )}

          <View style={{ marginBottom: 24 }}>
            <View style={{ display: 'flex', gap: 24 }}>
              <StatCard
                label="总棚位"
                value={totalCapacity}
                unit="个"
                color="#1E88E5"
                bgColor="#E3F2FD"
              />
              <StatCard
                label="已使用"
                value={totalUsed}
                unit="个"
                color="#43A047"
                bgColor="#E8F5E9"
              />
            </View>
          </View>

          <SectionHeader title={`棚位列表 (${loftAreas.length}个)`} />
          {loftAreas.map((loft) => {
            const usagePercent =
              loft.capacity > 0
                ? Math.round((loft.used / loft.capacity) * 100)
                : 0;
            return (
              <View key={loft.id} className={styles.loftCard}>
                <View className={styles.loftHeader}>
                  <Text className={styles.loftName}>{loft.name}</Text>
                  <StatusTag
                    status={loft.status}
                    text={
                      loft.status === 'normal'
                        ? '正常'
                        : loft.status === 'full'
                        ? '已满'
                        : '维护中'
                    }
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
                  <View
                    className={styles.progressFill}
                    style={{ width: `${usagePercent}%` }}
                  ></View>
                </View>
                <View className={styles.progressText}>
                  已使用 {loft.used} / {loft.capacity}（{usagePercent}%）
                </View>
                {loft.status !== 'full' && (
                  <View className={styles.loftActions}>
                    <Text
                      className={styles.actionText}
                      onClick={() => handleToggleLoftStatus(loft)}
                    >
                      {loft.status === 'normal' ? '设为维护' : '恢复正常'}
                    </Text>
                  </View>
                )}
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
            {statusFilters.map((f) => (
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
          {filteredPigeons.map((pigeon) => (
            <PigeonCard key={pigeon.id} pigeon={pigeon} />
          ))}
          {filteredPigeons.length === 0 && (
            <View className={styles.emptyBox}>
              <Text className={styles.emptyText}>暂无赛鸽，点击上方收鸽登记</Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default LoftPage;
