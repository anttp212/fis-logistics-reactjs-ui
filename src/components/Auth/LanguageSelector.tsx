import React, { useState } from 'react'
import i18n from '@i18n'

/**
 * Language selector component for authentication pages
 * Allows switching between Vietnamese and English
 */
const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const currentLang = i18n.language || 'vi'

  const languages = [
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', label: 'English', flag: '🇺🇸' }
  ]

  const currentLanguage = languages.find((lang) => lang.code === currentLang) || languages[0]

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className='relative'>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-gray-50 transition-colors'
      >
        <span className='text-lg'>{currentLanguage.flag}</span>
        <svg
          className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className='fixed inset-0 z-10' onClick={() => setIsOpen(false)} />
          <div className='absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 min-w-[160px]'>
            {languages.map((lang) => (
              <button
                key={lang.code}
                type='button'
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  currentLang === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <span className='text-xl'>{lang.flag}</span>
                <span className='text-sm font-medium'>{lang.label}</span>
                {currentLang === lang.code && (
                  <svg className='w-4 h-4 ml-auto text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSelector
