import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import AccentButton from '../components/AccentButton';
import Card from '../components/Card';

export default function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-10">
      <Card title={t('notFound.title')} description={t('notFound.subtitle')}>
        <div className="space-y-6 text-center">
          <p className="text-lg text-slate-300">{t('notFound.message')}</p>
          <Link to="/">
            <AccentButton>{t('notFound.backHome')}</AccentButton>
          </Link>
        </div>
      </Card>
    </div>
  );
}
