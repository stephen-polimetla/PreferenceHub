import { FormEvent, useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { useI18n } from '../i18n';
import { db } from '../firebase';
import { downloadCsv } from '../lib/csv';
import AccentButton from '../components/AccentButton';
import Card from '../components/Card';
import { SubmissionData } from '../types';

interface AdminSubmission extends SubmissionData {
  id: string;
  createdAtText: string;
}

const pageSize = 8;

export default function AdminPage() {
  const { t } = useI18n();
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [page, setPage] = useState(0);

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? 'preferencehub-admin';

  const handleAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === adminPassword) {
      setAuthenticated(true);
      setError('');
    } else {
      setError(t('admin.invalidPassword'));
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const rows = snapshot.docs.map((docItem) => {
        const data = docItem.data() as SubmissionData;
        const createdAt = data.createdAt as any;
        const createdAtText = createdAt?.toDate ? createdAt.toDate().toLocaleString() : createdAt ?? t('admin.pendingTimestamp');
        return {
          id: docItem.id,
          ...data,
          createdAtText,
        };
      });
      setSubmissions(rows);
    } catch (err) {
      setError(t('admin.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchSubmissions();
    }
  }, [authenticated]);

  const filtered = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return submissions.filter((submission) => {
      const name = submission.answers.firstName.toLowerCase();
      const matchesSearch = !lowerSearch || name.includes(lowerSearch) || submission.language.toLowerCase().includes(lowerSearch);
      const matchesLang = languageFilter === 'all' || submission.language === languageFilter;
      return matchesSearch && matchesLang;
    });
  }, [search, submissions, languageFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice(page * pageSize, page * pageSize + pageSize);

  const metrics = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {
      colors: {},
      languages: {},
      genders: {},
    };
    submissions.forEach((submission) => {
      const color = submission.answers.favoriteColor;
      const gender = submission.answers.gender;
      counts.colors[color] = (counts.colors[color] ?? 0) + 1;
      counts.languages[submission.language] = (counts.languages[submission.language] ?? 0) + 1;
      counts.genders[gender] = (counts.genders[gender] ?? 0) + 1;
    });
    return counts;
  }, [submissions]);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'submissions', id));
    setSubmissions((current) => current.filter((item) => item.id !== id));
  };

  const answerKeys = [
    'firstName',
    'ageGroup',
    'gender',
    'favoriteCuisine',
    'favoriteDessert',
    'favoriteDrink',
    'favoriteSeason',
    'favoriteSport',
    'favoriteMovieGenre',
    'favoriteMusicGenre',
    'favoriteBookGenre',
    'favoriteTimeOfDay',
    'coffeeOrTea',
    'sweetOrSpicy',
    'beachOrMountains',
    'androidOrIphone',
    'netflixOrYoutube',
    'summerOrWinter',
    'rainOrSnow',
    'favoriteColor',
    'favoriteFlower',
    'favoriteFruit',
    'favoriteAnimal',
    'sunriseOrSunset',
    'petsPreference',
  ] as const;

  const handleExport = () => {
    const headerRow = [
      'ID',
      'Submitted',
      'Language',
      'Browser',
      'Device',
      'First Name',
      'Age Group',
      'Gender',
      'Favorite Cuisine',
      'Favorite Dessert',
      'Favorite Drink',
      'Favorite Season',
      'Favorite Sport',
      'Movie Genre',
      'Music Genre',
      'Book Genre',
      'Time Of Day',
      'Coffee or Tea',
      'Sweet or Spicy',
      'Beach or Mountains',
      'Android or iPhone',
      'Netflix or YouTube',
      'Summer or Winter',
      'Rain or Snow',
      'Favorite Color',
      'Flower',
      'Fruit',
      'Animal',
      'Sunrise/Sunset',
      'Pets Preference',
    ];

    const rows = [
      headerRow,
      ...filtered.map((submission) => [
        submission.id,
        submission.createdAtText,
        submission.language,
        submission.browser,
        submission.deviceType,
        ...answerKeys.map((key) => submission.answers[key]),
      ]),
    ];
    downloadCsv('preferencehub-submissions.csv', rows);
  };

  if (!authenticated) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-10">
        <Card title={t('admin.title')} description={t('admin.loginDescription')}>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('admin.passwordPlaceholder')}
              className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-100 focus:border-violet-400 focus:outline-none"
            />
            {error ? <p className="text-sm text-rose-400">{error}</p> : null}
            <AccentButton type="submit">{t('admin.unlock')}</AccentButton>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-10">
      <Card title={t('admin.title')} description={t('admin.dashboardDescription')}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-violet-500/10 bg-slate-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">{t('admin.totalSubmissions')}</p>
            <p className="mt-4 text-4xl font-semibold text-white">{submissions.length}</p>
          </div>
          <div className="rounded-3xl border border-violet-500/10 bg-slate-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">{t('admin.languages')}</p>
            <div className="mt-4 space-y-3">
              {Object.entries(metrics.languages).map(([langKey, count]) => (
                <div key={langKey} className="space-y-1">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>{langKey.toUpperCase()}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-900">
                    <div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.round((count / Math.max(1, submissions.length)) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-violet-500/10 bg-slate-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">{t('admin.favoriteColors')}</p>
            <div className="mt-4 space-y-3">
              {Object.entries(metrics.colors)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([color, count]) => (
                  <div key={color} className="space-y-1">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{color}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-900">
                      <div className="h-full rounded-full bg-fuchsia-500" style={{ width: `${Math.round((count / Math.max(1, submissions.length)) * 100)}%` }} />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-slate-400">{t('admin.searchLabel')}</p>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('admin.searchPlaceholder')}
              className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-100 focus:border-violet-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2 sm:w-72">
            <p className="text-sm text-slate-400">{t('admin.languageFilter')}</p>
            <select
              value={languageFilter}
              onChange={(event) => setLanguageFilter(event.target.value)}
              className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-100 focus:border-violet-400 focus:outline-none"
            >
              <option value="all">{t('admin.filterAll')}</option>
              <option value="en">English</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>
          <div className="flex items-end justify-end">
            <AccentButton type="button" onClick={handleExport}>{t('admin.exportCsv')}</AccentButton>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          {loading ? <p className="text-slate-300">{t('admin.loading')}</p> : null}
          {pageItems.length === 0 && !loading ? <p className="text-slate-400">{t('admin.emptyState')}</p> : null}
          {pageItems.map((submission) => (
            <div key={submission.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-soft">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">{submission.createdAtText}</p>
                  <p className="text-lg font-semibold text-white">{submission.answers.firstName || t('admin.noName')}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full bg-slate-900/80 px-3 py-1 text-sm text-slate-300">{submission.language.toUpperCase()}</span>
                  <span className="rounded-full bg-slate-900/80 px-3 py-1 text-sm text-slate-300">{submission.browser}</span>
                  <span className="rounded-full bg-slate-900/80 px-3 py-1 text-sm text-slate-300">{submission.deviceType}</span>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {answerKeys.map((key) => (
                  <div key={key} className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t(`review.labels.${key}`)}</p>
                    <p className="mt-2 text-sm text-slate-100">{submission.answers[key]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDelete(submission.id)}
                  className="rounded-3xl border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
                >
                  {t('admin.delete')}
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{t('admin.pageInfo', { current: page + 1, total: pageCount })}</p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((current) => Math.max(current - 1, 0))}
                className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('admin.previous')}
              </button>
              <button
                type="button"
                disabled={page >= pageCount - 1}
                onClick={() => setPage((current) => Math.min(current + 1, pageCount - 1))}
                className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('admin.next')}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
