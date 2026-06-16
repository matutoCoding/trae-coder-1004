import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SectionHeader from '@/components/SectionHeader';
import StatusTag from '@/components/StatusTag';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const LiveStreamPage: React.FC = () => {
  const { races, raceResults } = useAppStore();
  const [now, setNow] = useState(new Date());
  const [activeRaceId, setActiveRaceId] = useState('');

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const ongoing = races.find((r) => r.status === 'ongoing');
    if (ongoing) setActiveRaceId(ongoing.id);
    else if (races.length > 0) setActiveRaceId(races[0].id);
  }, [races]);

  const activeRace = useMemo(
    () => races.find((r) => r.id === activeRaceId),
    [races, activeRaceId]
  );

  const liveResults = useMemo(
    () =>
      raceResults
        .filter((r) => !activeRaceId || r.raceId === activeRaceId)
        .sort((a, b) => b.speed - a.speed),
    [raceResults, activeRaceId]
  );

  const latestResults = liveResults.slice(0, 8);

  const handleBack = () => {
    Taro.navigateBack({ delta: 1 }).catch(() =>
      Taro.switchTab({ url: '/pages/owner/index' })
    );
  };

  const flightMinutes = useMemo(() => {
    if (!activeRace?.releaseTime) return 0;
    const [rh, rm] = activeRace.releaseTime.split(':').map((s) => parseInt(s, 10));
    const releaseMin = rh * 60 + rm;
    const curMin = now.getHours() * 60 + now.getMinutes();
    return Math.max(0, curMin - releaseMin);
  }, [activeRace, now]);

  const hours = Math.floor(flightMinutes / 60);
  const mins = flightMinutes % 60;

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.backBtn} onClick={handleBack}>
          <Text className={styles.backIcon}>‹</Text>
        </View>
        <Text className={styles.headerTitle}>赛鸽直播</Text>
        <View className={styles.liveBadge}>
          <View className={styles.liveDot}></View>
          <Text className={styles.liveText}>直播中</Text>
        </View>
      </View>

      <View className={styles.videoArea}>
        <View className={styles.videoPlaceholder}>
          <Text className={styles.videoIcon}>🎥</Text>
          <Text className={styles.videoTitle}>天空实时画面</Text>
          <Text className={styles.videoSub}>模拟视频区域 · 正在接收直播信号</Text>
          <View className={styles.videoGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <View key={i} className={styles.gridCell}>
                <Text className={styles.gridEmoji}>
                  {i <= liveResults.length ? '🕊' : '☁️'}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View className={styles.videoOverlay}>
          <Text className={styles.overlayTime}>
            {now.toLocaleTimeString('zh-CN', { hour12: false })}
          </Text>
          <Text className={styles.overlayMeta}>
            飞行时长：{hours}小时{mins}分
          </Text>
        </View>
      </View>

      {activeRace && (
        <View className={styles.raceCard}>
          <View className={styles.raceTop}>
            <Text className={styles.raceName}>{activeRace.name}</Text>
            <StatusTag status={activeRace.status} text={activeRace.statusText} />
          </View>
          <View className={styles.raceGrid}>
            <View className={styles.raceInfoItem}>
              <Text className={styles.raceInfoLabel}>放飞地点</Text>
              <Text className={styles.raceInfoValue}>{activeRace.location}</Text>
            </View>
            <View className={styles.raceInfoItem}>
              <Text className={styles.raceInfoLabel}>空距</Text>
              <Text className={styles.raceInfoValue}>{activeRace.distance} km</Text>
            </View>
            <View className={styles.raceInfoItem}>
              <Text className={styles.raceInfoLabel}>放飞时间</Text>
              <Text className={styles.raceInfoValue}>
                {activeRace.releaseTime || '待放飞'}
              </Text>
            </View>
            <View className={styles.raceInfoItem}>
              <Text className={styles.raceInfoLabel}>天气</Text>
              <Text className={styles.raceInfoValue}>{activeRace.weather}</Text>
            </View>
          </View>
          <View className={styles.statRow}>
            <View className={styles.statBox}>
              <Text className={styles.statNum}>{activeRace.totalPigeons}</Text>
              <Text className={styles.statLabel}>参赛羽数</Text>
            </View>
            <View className={styles.statDivider}></View>
            <View className={styles.statBox}>
              <Text className={styles.statNumGreen}>{activeRace.returnedCount}</Text>
              <Text className={styles.statLabel}>已归巢</Text>
            </View>
            <View className={styles.statDivider}></View>
            <View className={styles.statBox}>
              <Text className={styles.statNumOrange}>
                {activeRace.totalPigeons - activeRace.returnedCount}
              </Text>
              <Text className={styles.statLabel}>飞行中</Text>
            </View>
          </View>
        </View>
      )}

      <SectionHeader title="实时归巢动态" />
      <View className={styles.timeline}>
        {latestResults.length === 0 ? (
          <View className={styles.emptyBox}>
            <Text className={styles.emptyIcon}>⏳</Text>
            <Text className={styles.emptyText}>等待赛鸽归巢...</Text>
          </View>
        ) : (
          latestResults.map((r, idx) => (
            <View key={`${r.ringNumber}-${idx}`} className={styles.timelineItem}>
              <View className={styles.timelineLeft}>
                <View
                  className={styles.rankDot}
                  style={{
                    background:
                      r.rank === 1
                        ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                        : r.rank === 2
                        ? 'linear-gradient(135deg, #C0C0C0, #A0A0A0)'
                        : r.rank === 3
                        ? 'linear-gradient(135deg, #CD7F32, #8B4513)'
                        : '#1E88E5'
                  }}
                >
                  <Text className={styles.rankText}>{r.rank}</Text>
                </View>
              </View>
              <View className={styles.timelineBody}>
                <View className={styles.timelineRow}>
                  <Text className={styles.ringNum}>{r.ringNumber}</Text>
                  <Text className={styles.speedBadge}>
                    {r.speed.toFixed(0)} m/分
                  </Text>
                </View>
                <View className={styles.timelineMeta}>
                  <Text className={styles.ownerTxt}>鸽主：{r.ownerName}</Text>
                  <Text className={styles.timeTxt}>归巢 {r.returnTime}</Text>
                </View>
                <View className={styles.timelineDuration}>
                  <Text className={styles.durTxt}>飞行 {r.duration}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default LiveStreamPage;
