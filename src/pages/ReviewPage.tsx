import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useI18n } from '../i18n';
import { db } from '../firebase';
import { FormValues, SubmissionAnswers } from '../types';
import { getBrowserName, getDeviceType } from '../hooks/useDeviceInfo';
import AccentButton from '../components/AccentButton';
import Card from '../components/Card';

const defaultValues: FormValues = {
  firstName: '',
  ageGroup: '',
  gender: '',
  genderOther: '',
  favoriteCuisine: '',
  favoriteDessert: '',
  favoriteDrink: '',
  favoriteSeason: '',
  favoriteSport: '',
  favoriteMovieGenre: '',
  favoriteMusicGenre: '',
  favoriteActor: '',
  favoriteActress: '',
  favoriteHolidayDestination: '',
  favoriteHobby: '',
  dreamCarColor: '',
  preferredClothingColor: '',
  favoriteFestival: '',
  favoriteIceCream: '',
  favoriteSuperhero: '',
  favoriteQuote: '',
  favoriteBookGenre: '',
  favoriteTimeOfDay: '',
  coffeeOrTea: '',
  sweetOrSpicy: '',
  beachOrMountains: '',
  androidOrIphone: '',
  netflixOrYoutube: '',
  summerOrWinter: '',
  rainOrSnow: '',
  favoriteColor: '',
  favoriteColorOther: '',
  favoriteFlower: '',
  favoriteFlowerOther: '',
  favoriteFruit: '',
  favoriteFruitOther: '',
  favoriteAnimal: '',
  favoriteAnimalOther: '',
  sunriseOrSunset: '',
  petsPreference: '',
};

function getAnswer(value: string, other: string, key: string, t: (key: string, replacements?: Record<string, string | number>) => string) {
  if (!value) return t('review.noAnswer');
  if (value === 'other') {
    return other || t('review.noAnswer');
  }
  return t(`options.${key}.${value}`);
}

export default function ReviewPage() {
  const { t, lang } = useI18n();
  const [formData, setFormData] = useState<FormValues>(defaultValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = window.localStorage.getItem('preferencehub-form');
    if (saved) {
      setFormData(JSON.parse(saved));
    } else {
      navigate('/survey');
    }
  }, [navigate]);

  const answers = useMemo<SubmissionAnswers>(() => ({
    firstName: formData.firstName.trim() || t('review.noAnswer'),
    ageGroup: getAnswer(formData.ageGroup, '', 'ageGroup', t),
    gender: getAnswer(formData.gender, formData.genderOther, 'gender', t),
    favoriteCuisine: formData.favoriteCuisine || t('review.noAnswer'),
    favoriteDessert: formData.favoriteDessert || t('review.noAnswer'),
    favoriteDrink: formData.favoriteDrink || t('review.noAnswer'),
    favoriteSeason: formData.favoriteSeason || t('review.noAnswer'),
    favoriteSport: formData.favoriteSport || t('review.noAnswer'),
    favoriteMovieGenre: formData.favoriteMovieGenre || t('review.noAnswer'),
    favoriteMusicGenre: formData.favoriteMusicGenre || t('review.noAnswer'),
    favoriteActor: formData.favoriteActor || t('review.noAnswer'),
    favoriteActress: formData.favoriteActress || t('review.noAnswer'),
    favoriteHolidayDestination: formData.favoriteHolidayDestination || t('review.noAnswer'),
    favoriteHobby: formData.favoriteHobby || t('review.noAnswer'),
    dreamCarColor: formData.dreamCarColor || t('review.noAnswer'),
    preferredClothingColor: formData.preferredClothingColor || t('review.noAnswer'),
    favoriteFestival: formData.favoriteFestival || t('review.noAnswer'),
    favoriteIceCream: formData.favoriteIceCream || t('review.noAnswer'),
    favoriteSuperhero: formData.favoriteSuperhero || t('review.noAnswer'),
    favoriteQuote: formData.favoriteQuote || t('review.noAnswer'),
    favoriteBookGenre: formData.favoriteBookGenre || t('review.noAnswer'),
    favoriteTimeOfDay: formData.favoriteTimeOfDay || t('review.noAnswer'),
    coffeeOrTea: formData.coffeeOrTea || t('review.noAnswer'),
    sweetOrSpicy: formData.sweetOrSpicy || t('review.noAnswer'),
    beachOrMountains: formData.beachOrMountains || t('review.noAnswer'),
    androidOrIphone: formData.androidOrIphone || t('review.noAnswer'),
    netflixOrYoutube: formData.netflixOrYoutube || t('review.noAnswer'),
    summerOrWinter: formData.summerOrWinter || t('review.noAnswer'),
    rainOrSnow: formData.rainOrSnow || t('review.noAnswer'),
    favoriteColor: getAnswer(formData.favoriteColor, formData.favoriteColorOther, 'favoriteColor', t),
    favoriteFlower: getAnswer(formData.favoriteFlower, formData.favoriteFlowerOther, 'favoriteFlower', t),
    favoriteFruit: getAnswer(formData.favoriteFruit, formData.favoriteFruitOther, 'favoriteFruit', t),
    favoriteAnimal: getAnswer(formData.favoriteAnimal, formData.favoriteAnimalOther, 'favoriteAnimal', t),
    sunriseOrSunset: getAnswer(formData.sunriseOrSunset, '', 'sunriseOrSunset', t),
    petsPreference: getAnswer(formData.petsPreference, '', 'petsPreference', t),
  }), [formData, t]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Starting submission...');
      console.log('Firebase Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
      console.log('Has API Key:', !!import.meta.env.VITE_FIREBASE_API_KEY);
      
      // Check if Firebase is properly configured
      const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
      const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
      
      if (!projectId || projectId === 'your-project-id' || !apiKey || apiKey === 'your-api-key') {
        setError('Firebase not configured. Add your credentials to .env file.');
        setLoading(false);
        return;
      }
      
      const submitPromise = addDoc(collection(db, 'submissions'), {
        language: lang,
        browser: getBrowserName(),
        deviceType: getDeviceType(),
        createdAt: serverTimestamp(),
        answers,
      });
      
      await Promise.race([
        submitPromise,
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Submission timed out. Firebase may not be accessible.')), 8000);
        }),
      ]);
      
      console.log('Submission successful!');
      window.localStorage.removeItem('preferencehub-form');
      navigate('/success');
    } catch (err) {
      console.error('Submission error:', err);
      let errorMsg = t('review.submitError');
      
      if (err instanceof Error) {
        console.error('Error details:', err.message);
        if (err.message.includes('timeout') || err.message.includes('not accessible')) {
          errorMsg = 'Cannot connect to Firebase. Verify: 1) .env credentials are filled, 2) Firestore is enabled, 3) Security rules allow writes.';
        } else if (err.message.includes('permission') || err.message.includes('PERMISSION_DENIED')) {
          errorMsg = 'Access denied. Update Firestore security rules to allow writes to "submissions".';
        } else if (err.message.includes('auth/invalid-project')) {
          errorMsg = 'Invalid Firebase project ID in .env file.';
        } else {
          errorMsg = err.message;
        }
      }
      
      setError(errorMsg);
      setLoading(false);
    }
  };

  const reviewFields = [
    'firstName',
    'ageGroup',
    'gender',
    'favoriteColor',
    'favoriteFlower',
    'favoriteFruit',
    'favoriteAnimal',
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
    'sunriseOrSunset',
    'petsPreference',
  ] as const;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-10">
      <Card title={t('review.title')} description={t('review.subtitle')}>
        <div className="space-y-6">
          <div className="grid gap-4 rounded-3xl border border-violet-500/10 bg-slate-950/80 p-6 shadow-soft sm:grid-cols-2">
            {reviewFields.map((key) => (
              <div key={key} className="space-y-2 rounded-3xl bg-slate-900/80 p-4">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-400">{t(`review.labels.${key}`)}</p>
                <p className="text-base text-slate-100">{answers[key]}</p>
                <button
                  type="button"
                  onClick={() => navigate(`/survey?step=${getReviewStep(key)}`)}
                  className="text-sm font-semibold text-violet-300 transition hover:text-violet-200"
                >
                  {t('review.edit')}
                </button>
              </div>
            ))}
          </div>

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/survey')}
              className="rounded-3xl border border-violet-500/20 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-violet-100 transition hover:bg-slate-800"
            >
              {t('review.backToForm')}
            </button>
            <AccentButton type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? t('review.submitting') : t('review.confirm')}
            </AccentButton>
          </div>
        </div>
      </Card>
    </div>
  );
}

function getReviewStep(key: string) {
  const map: Record<string, number> = {
    firstName: 0,
    ageGroup: 1,
    gender: 2,
    favoriteColor: 3,
    favoriteFlower: 4,
    favoriteFruit: 5,
    favoriteAnimal: 6,
    favoriteCuisine: 7,
    favoriteDessert: 8,
    favoriteDrink: 9,
    favoriteSeason: 10,
    favoriteSport: 11,
    favoriteMovieGenre: 12,
    favoriteMusicGenre: 13,
    favoriteBookGenre: 14,
    favoriteTimeOfDay: 15,
    coffeeOrTea: 16,
    sweetOrSpicy: 17,
    beachOrMountains: 18,
    androidOrIphone: 19,
    netflixOrYoutube: 20,
    summerOrWinter: 21,
    rainOrSnow: 22,
    sunriseOrSunset: 23,
    petsPreference: 24,
  };
  return map[key] ?? 0;
}
