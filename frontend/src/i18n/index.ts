import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 只使用英文翻譯
const resources = {
  en: {
    app: {
      fileUpload: {
        title: "Step 1: Upload File",
        dropZoneText: "Drag and drop files here, or click to select files",
        supportedFormats: "Supported Formats",
        maxFileSize: "Maximum file size",
        uploadButton: "Select File",
        unsupportedFileType: "Unsupported file format. Supported formats",
        fileTooLargeError: "File too large. Maximum supported",
        nextStep: "Next Step",
        csvFormat: "CSV Files (.csv)",
        csvDescription: "Support UTF-8, Big5, GB2312 and other encodings",
        excelFormat: "Excel Files (.xlsx, .xls)",
        excelDescription: "Microsoft Excel format",
        txtFormat: "Text Files (.txt)",
        txtDescription: "Plain text files, support multiple split formats"
      },
      steps: {
        upload: "Upload File",
        selectColumn: "Select Column",
        processResults: "Process Results"
      },
      page: {
        title: "File Split Tool",
        dailyUsageRemaining: "Daily usage remaining",
        upgradePromotion: "Consider upgrading to premium for more processing quota and larger file support.",
        dailyLimitExhausted: "Your daily processing quota has been exhausted.",
        upgradeToPremium: "Upgrade to premium for more processing quota.",
        quotaResetTomorrow: "Quota will reset tomorrow."
      },
      errors: {
        emptyFile: "Please select a file to upload"
      }
    }
  }
};

// 同步初始化 i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // 設定為英文
    fallbackLng: 'en',
    debug: false,
    
    // 簡化的語言檢測選項
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    defaultNS: 'app',
    ns: ['app'],

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

    supportedLngs: ['en'],
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