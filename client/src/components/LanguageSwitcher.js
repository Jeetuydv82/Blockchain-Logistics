import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { colors } = useTheme();

  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'hi', label: 'HI', name: 'Hindi' },
    { code: 'ar', label: 'AR', name: 'Arabic' }
  ];

  const handleChange = (langCode) => {
    i18n.changeLanguage(langCode);
    if (langCode === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    localStorage.setItem('i18nextLng', langCode);
  };

  const styles = {
    container: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    button: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      background: i18n.language === 'en' ? colors.primary : colors.badge,
      color: i18n.language === 'en' ? 'white' : colors.text,
      transition: 'all 0.2s ease'
    }
  };

  return (
    <div style={styles.container}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          style={{
            ...styles.button,
            background: i18n.language === lang.code ? colors.primary : colors.cardHover,
            color: i18n.language === lang.code ? 'white' : colors.textSecondary,
            border: `1px solid ${colors.inputBorder}`
          }}
          onClick={() => handleChange(lang.code)}
          title={lang.name}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;