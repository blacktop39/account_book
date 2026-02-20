import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.accountbook.app',
  appName: '가계부',
  webDir: 'out',
  server: {
    // 개발 시: 로컬 서버 (에뮬레이터에서 테스트할 때)
    // url: 'http://10.0.2.2:3000',
    // 배포 시: 프로덕션 URL
    url: 'https://accountbook-vert.vercel.app',
    cleartext: true,
  },
  android: {
    allowMixedContent: true, // HTTPS/HTTP 혼합 콘텐츠 허용
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f0f0f',
      showSpinner: false,
    },
  },
};

export default config;
