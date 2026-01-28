import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslation from './en'
import viTranslation from './vi'

// Import types để enable type-safety
import './types'

const language = 'en'

i18n.use(initReactI18next).init({
  debug: process.env.NODE_ENV === 'development',
  fallbackLng: language,
  lng: language,
  defaultNS: 'translation',
  resources: {
    en: {
      translation: enTranslation
    },
    vi: {
      translation: viTranslation
    }
  },
  interpolation: {
    escapeValue: false // not needed for react as it does escape per default to prevent xss!
  },
  // Type-safe configuration
  returnEmptyString: false,
  returnNull: false
})

export default i18n
