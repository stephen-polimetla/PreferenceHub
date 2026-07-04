import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import AccentButton from '../components/AccentButton';
import Card from '../components/Card';

export default function LandingPage() {
  const { t, setLang, lang } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = t('landing.title');
  }, [t]);

  const start = (locale: 'en' | 'te') => {
    setLang(locale);
    navigate('/survey');
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-10">
      <Card>
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-violet-300/80">{t('landing.subtitle')}</p>
            <h2 className="text-4xl font-semibold text-white sm:text-5xl">{t('landing.welcome')}</h2>
            <p className="max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">{t('landing.description')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AccentButton onClick={() => start('en')}>🇬🇧 {t('landing.english')}</AccentButton>
            <AccentButton onClick={() => start('te')}>🇮🇳 {t('landing.telugu')}</AccentButton>
          </div>
          <div className="rounded-3xl border border-violet-500/15 bg-slate-950/80 p-4 text-sm text-slate-300">
            {t('landing.note')}
          </div>
        </div>
      </Card>
    </div>
  );
}
