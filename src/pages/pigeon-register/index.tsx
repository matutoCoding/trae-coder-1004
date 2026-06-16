import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store';
import type { Pigeon } from '@/types';
import styles from './index.module.scss';

const PigeonRegisterPage: React.FC = () => {
  const { loftAreas, addPigeon } = useAppStore();
  const [formData, setFormData] = useState({
    ringNumber: '',
    electronicRing: '',
    name: '',
    ownerName: '',
    ownerPhone: '',
    breed: '',
    gender: '雄' as '雄' | '雌',
    birthDate: '',
    color: '',
    loftArea: ''
  });

  const availableLofts = loftAreas.filter(
    (l) => l.status === 'normal' && l.used < l.capacity
  );

  const handleInput = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectLoft = () => {
    if (availableLofts.length === 0) {
      Taro.showToast({
        title: '暂无可选棚位',
        icon: 'none'
      });
      return;
    }
    Taro.showActionSheet({
      itemList: availableLofts.map(
        (l) => `${l.name}（剩余 ${l.capacity - l.used}/${l.capacity}）`
      ),
      success: (res) => {
        const selectedLoft = availableLofts[res.tapIndex];
        setFormData((prev) => ({ ...prev, loftArea: selectedLoft.name }));
      }
    });
  };

  const handleUploadImage = () => {
    Taro.showToast({ title: '图片上传功能开发中', icon: 'none' });
  };

  const handleSubmit = () => {
    if (!formData.ringNumber) {
      Taro.showToast({ title: '请输入足环号', icon: 'none' });
      return;
    }
    if (!formData.electronicRing) {
      Taro.showToast({ title: '请输入电子环号', icon: 'none' });
      return;
    }
    if (!formData.ownerName) {
      Taro.showToast({ title: '请输入鸽主姓名', icon: 'none' });
      return;
    }
    if (!formData.ownerPhone) {
      Taro.showToast({ title: '请输入鸽主电话', icon: 'none' });
      return;
    }
    if (!formData.loftArea) {
      Taro.showToast({ title: '请选择入棚位置', icon: 'none' });
      return;
    }

    Taro.showLoading({ title: '提交中...' });
    setTimeout(() => {
      const newPigeon: Pigeon = {
        id: `p_${Date.now()}`,
        ringNumber: formData.ringNumber,
        electronicRing: formData.electronicRing,
        name: formData.name || `未命名-${formData.ringNumber.slice(-4)}`,
        ownerName: formData.ownerName,
        ownerPhone: formData.ownerPhone,
        breed: formData.breed || '未知',
        gender: formData.gender,
        birthDate: formData.birthDate || '2024-01-01',
        color: formData.color || '灰',
        status: 'health',
        statusText: '健康',
        loftArea: formData.loftArea,
        entryDate: new Date().toISOString().slice(0, 10),
        paid: false,
        raceCount: 0,
        avatar: ''
      };

      addPigeon(newPigeon);
      Taro.hideLoading();
      Taro.showToast({ title: '登记成功', icon: 'success' });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/loft/index' });
      }, 1200);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      ringNumber: '',
      electronicRing: '',
      name: '',
      ownerName: '',
      ownerPhone: '',
      breed: '',
      gender: '雄',
      birthDate: '',
      color: '',
      loftArea: ''
    });
    Taro.showToast({ title: '已重置', icon: 'success' });
  };

  return (
    <View className={styles.page} style={{ paddingBottom: 160 }}>
      <View className={styles.formCard}>
        <Text className={styles.formTitle}>足环信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>
            足环号
          </Text>
          <Input
            className={styles.formInput}
            placeholder="请输入足环号，如 CHN2024-001"
            value={formData.ringNumber}
            onInput={(e) => handleInput('ringNumber', e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>
            电子环号
          </Text>
          <Input
            className={styles.formInput}
            placeholder="请输入电子环号"
            value={formData.electronicRing}
            onInput={(e) => handleInput('electronicRing', e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>赛鸽名称</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入赛鸽名称"
            value={formData.name}
            onInput={(e) => handleInput('name', e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.formTitle}>鸽主信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>
            鸽主姓名
          </Text>
          <Input
            className={styles.formInput}
            placeholder="请输入鸽主姓名"
            value={formData.ownerName}
            onInput={(e) => handleInput('ownerName', e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>
            联系电话
          </Text>
          <Input
            className={styles.formInput}
            placeholder="请输入联系电话"
            type="number"
            value={formData.ownerPhone}
            onInput={(e) => handleInput('ownerPhone', e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.formTitle}>赛鸽信息</Text>

        <View className={styles.formRow}>
          <View className={`${styles.formItem} ${styles.formRowItem}`}>
            <Text className={styles.formLabel}>品种</Text>
            <Input
              className={styles.formInput}
              placeholder="请输入品种"
              value={formData.breed}
              onInput={(e) => handleInput('breed', e.detail.value)}
            />
          </View>
          <View className={`${styles.formItem} ${styles.formRowItem}`}>
            <Text className={styles.formLabel}>性别</Text>
            <View className={styles.radioGroup}>
              <View
                className={styles.radioItem}
                onClick={() => handleInput('gender', '雄')}
              >
                <View
                  className={`${styles.radioCircle} ${formData.gender === '雄' ? styles.active : ''}`}
                >
                  {formData.gender === '雄' && <View className={styles.radioDot}></View>}
                </View>
                <Text className={styles.radioText}>雄</Text>
              </View>
              <View
                className={styles.radioItem}
                onClick={() => handleInput('gender', '雌')}
              >
                <View
                  className={`${styles.radioCircle} ${formData.gender === '雌' ? styles.active : ''}`}
                >
                  {formData.gender === '雌' && <View className={styles.radioDot}></View>}
                </View>
                <Text className={styles.radioText}>雌</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.formRow}>
          <View className={`${styles.formItem} ${styles.formRowItem}`}>
            <Text className={styles.formLabel}>出生日期</Text>
            <Input
              className={styles.formInput}
              placeholder="YYYY-MM-DD"
              value={formData.birthDate}
              onInput={(e) => handleInput('birthDate', e.detail.value)}
            />
          </View>
          <View className={`${styles.formItem} ${styles.formRowItem}`}>
            <Text className={styles.formLabel}>羽色</Text>
            <Input
              className={styles.formInput}
              placeholder="雨点/灰/白等"
              value={formData.color}
              onInput={(e) => handleInput('color', e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>
            入棚位置
          </Text>
          <View className={styles.loftSelector} onClick={handleSelectLoft}>
            <Text
              className={`${styles.loftText} ${!formData.loftArea ? styles.placeholder : ''}`}
            >
              {formData.loftArea || '请选择入棚位置'}
            </Text>
            <Text style={{ color: '#86909C' }}>›</Text>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>上传照片</Text>
          <View className={styles.uploadArea} onClick={handleUploadImage}>
            <Text className={styles.uploadIcon}>+</Text>
            <Text className={styles.uploadText}>点击上传</Text>
          </View>
        </View>
      </View>

      <View className={styles.submitBar}>
        <Button
          className={`${styles.submitBtn} ${styles.secondary}`}
          onClick={handleReset}
        >
          重置
        </Button>
        <Button className={styles.submitBtn} onClick={handleSubmit}>
          提交登记
        </Button>
      </View>
    </View>
  );
};

export default PigeonRegisterPage;
