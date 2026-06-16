export const formatMoney = (amount: number): string => {
  if (amount >= 0) {
    return '¥' + amount.toLocaleString('zh-CN', { minimumFractionDigits: 0 });
  }
  return '-¥' + Math.abs(amount).toLocaleString('zh-CN', { minimumFractionDigits: 0 });
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

export const calcReturnRate = (returned: number, total: number): string => {
  if (total === 0) return '0%';
  return ((returned / total) * 100).toFixed(1) + '%';
};

export const calcSpeed = (distance: number, durationMinutes: number): number => {
  if (durationMinutes === 0) return 0;
  return Number(((distance * 1000) / durationMinutes).toFixed(2));
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    healthy: '#43A047',
    training: '#1E88E5',
    racing: '#FF7D00',
    returned: '#00B42A',
    lost: '#E53935',
    completed: '#43A047',
    ongoing: '#1E88E5',
    upcoming: '#FF9800',
    pending: '#86909C',
    normal: '#43A047',
    full: '#FF7D00',
    maintenance: '#86909C',
    paid: '#43A047',
    unpaid: '#E53935'
  };
  return colorMap[status] || '#86909C';
};

export const getStatusBgColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    healthy: '#E8F5E9',
    training: '#E3F2FD',
    racing: '#FFF3E0',
    returned: '#E8F5E9',
    lost: '#FFEBEE',
    completed: '#E8F5E9',
    ongoing: '#E3F2FD',
    upcoming: '#FFF3E0',
    pending: '#F5F6F7',
    normal: '#E8F5E9',
    full: '#FFF3E0',
    maintenance: '#F5F6F7',
    paid: '#E8F5E9',
    unpaid: '#FFEBEE'
  };
  return colorMap[status] || '#F5F6F7';
};
