export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/loft/index',
    'pages/race/index',
    'pages/settlement/index',
    'pages/owner/index',
    'pages/pigeon-register/index',
    'pages/race-detail/index',
    'pages/pigeon-detail/index',
    'pages/live-stream/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1E88E5',
    navigationBarTitleText: '赛鸽公棚',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F7FA'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#1E88E5',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/loft/index',
        text: '鸽舍'
      },
      {
        pagePath: 'pages/race/index',
        text: '比赛'
      },
      {
        pagePath: 'pages/settlement/index',
        text: '结算'
      },
      {
        pagePath: 'pages/owner/index',
        text: '鸽主'
      }
    ]
  }
})
