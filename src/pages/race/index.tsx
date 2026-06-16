import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SectionHeader from '@/components/SectionHeader';
import RaceCard from '@/components/RaceCard';
import StatusTag from '@/components/StatusTag';
import { useAppStore } from '@/store';
import { calcSpeed, calcDurationMinutes, formatDuration } from '@/utils';
import type { Race, RaceResult, Pigeon } from '@/types';
import styles from './index.module.scss';

type TabKey = 'race' | 'release' | 'timing' | 'training' | 'result';

const pad = (n: number) => String(n).padStart(2, '0');
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const nowTimeStr = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const RacePage: React.FC = () => {
  const {
    races,
    trainingRecords,
    raceResults,
    pigeons,
    startRace,
    addRaceResult
  } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabKey>('race');

  const [releaseRaceId, setReleaseRaceId] = useState('');
  const [timingRaceId, setTimingRaceId] = useState('');
  const [timingRing, setTimingRing] = useState('');
  const [timingReturnDate, setTimingReturnDate] = useState(todayStr());
  const [timingReturnTime, setTimingReturnTime] = useState(nowTimeStr());
  const [resultRaceId, setResultRaceId] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRowClick = (pigeonId: string) => {
    Taro.navigateTo({ url: `/pages/pigeon-detail/index?id=${pigeonId}` });
  };

  const handleStartRace = () => {
    if (!releaseRaceId) {
      Taro.showToast({ title: '请选择比赛', icon: 'none' });
      return;
    }
    const race = races.find((r) => r.id === releaseRaceId);
    if (!race) return;
    if (race.status === 'completed') {
      Taro.showToast({ title: '该比赛已完成', icon: 'none' });
      return;
    }
    if (race.status === 'ongoing') {
      Taro.showToast({ title: '该比赛正在进行', icon: 'none' });
      return;
    }
    startRace(releaseRaceId);
    Taro.showToast({ title: '放飞成功！计时开始', icon: 'success' });
  };

  const handleTimingSubmit = () => {
    if (!timingRaceId) {
      Taro.showToast({ title: '请选择比赛', icon: 'none' });
      return;
    }
    const race = races.find((r) => r.id === timingRaceId);
    if (!race) return;
    if (race.status !== 'ongoing') {
      Taro.showToast({ title: '比赛未开始', icon: 'none' });
      return;
    }
    if (!timingRing.trim()) {
      Taro.showToast({ title: '请输入足环号', icon: 'none' });
      return;
    }
    const pigeon = pigeons.find(
      (p) =>
        p.ringNumber === timingRing.trim() ||
        p.electronicRing === timingRing.trim()
    );
    if (!pigeon) {
      Taro.showToast({ title: '未找到该足环的赛鸽', icon: 'none' });
      return;
    }
    if (!race.releaseTime || !race.date) {
      Taro.showToast({ title: '比赛未记录放飞时间', icon: 'none' });
      return;
    }
    if (!timingReturnDate || !timingReturnTime) {
      Taro.showToast({ title: '请填写归巢日期和时间', icon: 'none' });
      return;
    }

    const durationMin = calcDurationMinutes(
      race.date,
      race.releaseTime,
      timingReturnDate,
      timingReturnTime
    );
    const speed = calcSpeed(race.distance, durationMin);
    const durationStr = formatDuration(durationMin);
    const returnStr = `${timingReturnDate} ${timingReturnTime}`;

    const result: RaceResult = {
      rank: 0,
      raceId: timingRaceId,
      pigeonId: pigeon.id,
      ringNumber: pigeon.ringNumber,
      ownerName: pigeon.ownerName,
      returnTime: returnStr,
      speed,
      distance: race.distance,
      duration: durationStr
    };

    addRaceResult(timingRaceId, result);
    Taro.showToast({
      title: `归巢成功！分速 ${speed.toFixed(0)} m/分`,
      icon: 'success'
    });
    setTimingRing('');
  };

  const typeIcons: Record<string, { icon: string; className: string }> = {
    home: { icon: '🏠', className: 'home' },
    short: { icon: '📍', className: 'short' },
    long: { icon: '🗺️', className: 'long' }
  };

  const ongoingRaces = useMemo(
    () => races.filter((r) => r.status === 'ongoing'),
    [races]
  );
  const upcomingRaces = useMemo(
    () => races.filter((r) => r.status === 'upcoming'),
    [races]
  );
  const selectableRaces = [...ongoingRaces, ...upcomingRaces];
  const racesWithResults = useMemo(
    () => races.filter((r) => raceResults.some((rr) => rr.raceId === r.id)),
    [races, raceResults]
  );
  const filteredResults = useMemo(() => {
    if (!resultRaceId) return raceResults;
    return raceResults.filter((r) => r.raceId === resultRaceId);
  }, [raceResults, resultRaceId]);

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.tabs}>
        <View
          className={`${styles.tabItem} ${activeTab === 'race' ? styles.active : ''}`}
          onClick={() => setActiveTab('race')}
        >
          比赛管理
        </View>
        <View
          className={`${styles.tabItem} ${activeTab === 'release' ? styles.active : ''}`}
          onClick={() => setActiveTab('release')}
        >
          放飞登记
        </View>
        <View
          className={`${styles.tabItem} ${activeTab === 'timing' ? styles.active : ''}`}
          onClick={() => setActiveTab('timing')}
        >
          归巢计时
        </View>
        <View
          className={`${styles.tabItem} ${activeTab === 'training' ? styles.active : ''}`}
          onClick={() => setActiveTab('training')}
        >
          训放记录
        </View>
        <View
          className={`${styles.tabItem} ${activeTab === 'result' ? styles.active : ''}`}
          onClick={() => setActiveTab('result')}
        >
          成绩排名
        </View>
      </View>

      {activeTab === 'race' && (
        <>
          <SectionHeader title="比赛列表" />
          {races.map((race) => (
            <RaceCard key={race.id} race={race} />
          ))}
        </>
      )}

      {activeTab === 'release' && (
        <>
          <SectionHeader title="放飞登记" />
          <View className={styles.formCard}>
            <Text className={styles.formTitle}>选择比赛并开始放飞</Text>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>
                <Text className={styles.required}>*</Text>
                选择比赛
              </Text>
              <View
                className={styles.selector}
                onClick={() => {
                  if (selectableRaces.length === 0) {
                    Taro.showToast({ title: '暂无可开始的比赛', icon: 'none' });
                    return;
                  }
                  Taro.showActionSheet({
                    itemList: selectableRaces.map(
                      (r) =>
                        `${r.name}（${r.statusText} · ${r.distance}km · ${r.location}）`
                    ),
                    success: (res) => {
                      setReleaseRaceId(selectableRaces[res.tapIndex].id);
                    }
                  });
                }}
              >
                <Text
                  className={
                    releaseRaceId
                      ? styles.selectorText
                      : styles.selectorPlaceholder
                  }
                >
                  {releaseRaceId
                    ? races.find((r) => r.id === releaseRaceId)?.name
                    : '请选择要放飞的比赛'}
                </Text>
                <Text style={{ color: '#86909C' }}>›</Text>
              </View>
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>当前时间</Text>
              <View className={styles.timeBox}>
                <Text className={styles.timeValue}>
                  {now.toLocaleTimeString('zh-CN', { hour12: false })}
                </Text>
                <Text className={styles.timeLabel}>
                  {now.toLocaleDateString('zh-CN')}
                </Text>
              </View>
            </View>
            {releaseRaceId &&
              (() => {
                const r = races.find((x) => x.id === releaseRaceId);
                if (!r) return null;
                return (
                  <View className={styles.raceInfoBox}>
                    <View className={styles.raceInfoRow}>
                      <Text className={styles.raceInfoLabel}>比赛名称</Text>
                      <Text className={styles.raceInfoValue}>{r.name}</Text>
                    </View>
                    <View className={styles.raceInfoRow}>
                      <Text className={styles.raceInfoLabel}>放飞地点</Text>
                      <Text className={styles.raceInfoValue}>{r.location}</Text>
                    </View>
                    <View className={styles.raceInfoRow}>
                      <Text className={styles.raceInfoLabel}>空距</Text>
                      <Text className={styles.raceInfoValue}>{r.distance} km</Text>
                    </View>
                    <View className={styles.raceInfoRow}>
                      <Text className={styles.raceInfoLabel}>参赛羽数</Text>
                      <Text className={styles.raceInfoValue}>
                        {r.totalPigeons} 羽
                      </Text>
                    </View>
                  </View>
                );
              })()}
            <Button className={styles.submitBtn} onClick={handleStartRace}>
              确认放飞
            </Button>
          </View>
        </>
      )}

      {activeTab === 'timing' && (
        <>
          <SectionHeader title="归巢计时" />
          <View className={styles.formCard}>
            <Text className={styles.formTitle}>记录赛鸽归巢时间</Text>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>
                <Text className={styles.required}>*</Text>
                选择比赛
              </Text>
              <View
                className={styles.selector}
                onClick={() => {
                  if (ongoingRaces.length === 0) {
                    Taro.showToast({ title: '暂无进行中的比赛', icon: 'none' });
                    return;
                  }
                  Taro.showActionSheet({
                    itemList: ongoingRaces.map(
                      (r) => `${r.name} · ${r.distance}km · 放飞 ${r.releaseTime}`
                    ),
                    success: (res) => {
                      setTimingRaceId(ongoingRaces[res.tapIndex].id);
                    }
                  });
                }}
              >
                <Text
                  className={
                    timingRaceId
                      ? styles.selectorText
                      : styles.selectorPlaceholder
                  }
                >
                  {timingRaceId
                    ? races.find((r) => r.id === timingRaceId)?.name
                    : '请选择进行中的比赛'}
                </Text>
                <Text style={{ color: '#86909C' }}>›</Text>
              </View>
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>
                <Text className={styles.required}>*</Text>
                足环号/电子环号
              </Text>
              <Input
                className={styles.formInput}
                placeholder="请输入足环号或扫描电子环"
                value={timingRing}
                onInput={(e) => setTimingRing(e.detail.value)}
              />
            </View>
            <View className={styles.formRow}>
              <View className={`${styles.formItem} ${styles.formRowItem}`}>
                <Text className={styles.formLabel}>
                  <Text className={styles.required}>*</Text>
                  归巢日期
                </Text>
                <Input
                  className={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  value={timingReturnDate}
                  onInput={(e) => setTimingReturnDate(e.detail.value)}
                />
              </View>
              <View className={`${styles.formItem} ${styles.formRowItem}`}>
                <Text className={styles.formLabel}>
                  <Text className={styles.required}>*</Text>
                  归巢时间
                </Text>
                <Input
                  className={styles.formInput}
                  placeholder="HH:MM"
                  value={timingReturnTime}
                  onInput={(e) => setTimingReturnTime(e.detail.value)}
                />
              </View>
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>当前系统时间</Text>
              <View className={styles.timeBox}>
                <Text className={styles.timeValue}>
                  {now.toLocaleTimeString('zh-CN', { hour12: false })}
                </Text>
                <Text className={styles.timeLabel}>
                  {now.toLocaleDateString('zh-CN')}
                </Text>
              </View>
            </View>
            <Button className={styles.submitBtn} onClick={handleTimingSubmit}>
              记录归巢
            </Button>
          </View>
        </>
      )}

      {activeTab === 'training' && (
        <>
          <SectionHeader title="训放记录" />
          {trainingRecords.map((record) => {
            const typeInfo = typeIcons[record.type];
            return (
              <View key={record.id} className={styles.trainingCard}>
                <View className={styles.trainingHeader}>
                  <View className={styles.trainingType}>
                    <View
                      className={`${styles.typeIcon} ${styles[typeInfo.className]}`}
                    >
                      <Text>{typeInfo.icon}</Text>
                    </View>
                    <Text className={styles.trainingName}>{record.typeText}</Text>
                  </View>
                  <StatusTag status={record.status} text={record.statusText} />
                </View>
                <View className={styles.trainingInfo}>
                  <View className={styles.infoCol}>
                    <Text className={styles.infoValue}>{record.location}</Text>
                    <Text className={styles.infoLabel}>放飞地点</Text>
                  </View>
                  <View className={styles.infoCol}>
                    <Text className={styles.infoValue}>
                      {record.distance > 0 ? `${record.distance}km` : '家飞'}
                    </Text>
                    <Text className={styles.infoLabel}>训练距离</Text>
                  </View>
                  <View className={styles.infoCol}>
                    <Text className={styles.infoValue}>{record.date}</Text>
                    <Text className={styles.infoLabel}>训练日期</Text>
                  </View>
                </View>
                <View className={styles.trainingMeta}>
                  <Text>参赛：{record.totalPigeons} 羽</Text>
                  <Text>
                    归巢：{record.returnedCount}/{record.totalPigeons}
                  </Text>
                </View>
              </View>
            );
          })}
        </>
      )}

      {activeTab === 'result' && (
        <>
          <SectionHeader title="实时成绩排名" />
          <View className={styles.formCard} style={{ marginBottom: 24 }}>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>选择比赛</Text>
              <View
                className={styles.selector}
                onClick={() => {
                  const items = ['全部比赛', ...racesWithResults.map((r) => r.name)];
                  Taro.showActionSheet({
                    itemList: items,
                    success: (res) => {
                      if (res.tapIndex === 0) {
                        setResultRaceId('');
                      } else {
                        setResultRaceId(racesWithResults[res.tapIndex - 1].id);
                      }
                    }
                  });
                }}
              >
                <Text
                  className={
                    resultRaceId
                      ? styles.selectorText
                      : styles.selectorPlaceholder
                  }
                >
                  {resultRaceId
                    ? races.find((r) => r.id === resultRaceId)?.name
                    : '全部比赛'}
                </Text>
                <Text style={{ color: '#86909C' }}>›</Text>
              </View>
            </View>
          </View>
          <View className={styles.resultTable}>
            <View className={styles.tableHeader}>
              <View className={styles.colRank}>名次</View>
              <View className={styles.colPigeon}>赛鸽信息</View>
              <View className={styles.colSpeed}>分速</View>
            </View>
            {filteredResults.map((result) => {
              const rankClass = result.rank <= 3 ? `top${result.rank}` : 'normal';
              return (
                <View
                  key={`${result.raceId}-${result.ringNumber}`}
                  className={styles.tableRow}
                  onClick={() => handleRowClick(result.pigeonId)}
                >
                  <View className={styles.colRank}>
                    <View className={`${styles.rankBadge} ${styles[rankClass]}`}>
                      <Text>{result.rank}</Text>
                    </View>
                  </View>
                  <View className={styles.colPigeon}>
                    <View className={styles.pigeonInfo}>
                      <Text className={styles.pigeonRing}>{result.ringNumber}</Text>
                      <Text className={styles.pigeonOwner}>
                        鸽主：{result.ownerName}
                      </Text>
                      <Text className={styles.pigeonDuration}>
                        {result.duration} · 归巢 {result.returnTime}
                      </Text>
                    </View>
                  </View>
                  <View className={styles.colSpeed}>
                    <Text className={styles.speedValue}>
                      {result.speed.toFixed(0)}
                    </Text>
                    <Text className={styles.speedUnit}> m/分</Text>
                  </View>
                </View>
              );
            })}
            {filteredResults.length === 0 && (
              <View className={styles.emptyBox}>
                <Text className={styles.emptyText}>暂无成绩数据，比赛进行后自动生成</Text>
              </View>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default RacePage;
