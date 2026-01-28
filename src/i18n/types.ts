import viTranslation from './vi'

// Tạo type từ file translation chính (vi)
export type TranslationKeysT = typeof viTranslation

// Type cho các namespace (nếu có)
export type TranslationNamespaceT = 'translation'

// Declare module để override i18next types
declare module 'i18next' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface CustomTypeOptions {
    defaultNS: TranslationNamespaceT
    resources: {
      translation: TranslationKeysT
    }
  }
}
