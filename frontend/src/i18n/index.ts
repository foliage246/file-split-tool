import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 中文翻譯資源
import zhCommon from '../locales/zh/common.json';
import zhLanding from '../locales/zh/landing.json';
import zhAuth from '../locales/zh/auth.json';
import zhApp from '../locales/zh/app.json';
import zhPricing from '../locales/zh/pricing.json';

// 英文翻譯資源
import enCommon from '../locales/en/common.json';
import enLanding from '../locales/en/landing.json';
import enAuth from '../locales/en/auth.json';
import enApp from '../locales/en/app.json';
import enPricing from '../locales/en/pricing.json';

const resources = {
  zh: {
    common: zhCommon,
    landing: zhLanding,
    auth: zhAuth,
    app: zhApp,
    pricing: zhPricing,
  },
  en: {
    common: enCommon,
    landing: enLanding,
    auth: enAuth,
    app: enApp,
    pricing: enPricing,
  },
};

// 同步初始化 i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // 明確設定預設語言
    fallbackLng: 'zh',
    debug: true, // 啟用調試模式
    
    // 簡化的語言檢測選項
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    defaultNS: 'common',
    ns: ['common', 'landing', 'auth', 'app', 'pricing'],

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    },

    supportedLngs: ['zh', 'en'],
    load: 'languageOnly',
    cleanCode: true,
  })
  .then(() => {
    console.log('i18n initialized successfully');
    console.log('Current language:', i18n.language);
    console.log('Available resources:', i18n.getResourceBundle(i18n.language, 'app'));
  })
  .catch((error) => {
    console.error('i18n initialization failed:', error);
  });

export default i18n;

// 導出語言列表供組件使用
export const supportedLanguages = [
  { code: 'zh', name: '繁體中文', flag: '🇹🇼' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];