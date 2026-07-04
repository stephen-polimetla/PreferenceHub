import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import AccentButton from '../components/AccentButton';
import Card from '../components/Card';

const quotes = [
  'Every day is a new chance to build something better.',
  'Small tests build big confidence.',
  'Your feedback helps me improve the next release.',
  'Thank you for helping this project grow with practical data.',
];

export default function SuccessPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const quote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-10">
      <Card title={t('success.title')} description={t('success.subtitle')}>
        <div className="space-y-6">
          <div className="rounded-3xl border border-violet-500/10 bg-slate-950/80 p-8 text-center shadow-soft">
            <p className="text-3xl font-semibold text-white">{t('success.thankYou')}</p>
            <p className="mt-4 text-base leading-7 text-slate-300">{t('success.message')}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-center text-slate-300">
            <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">{t('success.quoteLabel')}</p>
            <p className="mt-3 text-lg text-white">“{quote}”</p>
          </div>
          <div className="flex justify-center">
            <AccentButton type="button" onClick={() => navigate('/')}>{t('success.continue')}</AccentButton>
          </div>
        </div>
      </Card>
    </div>
  );
}
