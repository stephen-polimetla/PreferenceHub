import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useI18n } from '../i18n';
import { FormValues } from '../types';
import AccentButton from '../components/AccentButton';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { useLocalStorage } from '../hooks/useLocalStorage';

const defaultValues: FormValues = {
  firstName: '',
  ageGroup: '',
  gender: '',
  genderOther: '',
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

const ageGroups = ['under18', '18-25', '26-35', '36-45', '46+'] as const;
const genderOptions = ['male', 'female', 'preferNotToSay', 'other'] as const;
const colorOptions = ['red', 'blue', 'green', 'black', 'white', 'purple', 'pink', 'yellow', 'other'] as const;
const flowerOptions = ['rose', 'lily', 'sunflower', 'jasmine', 'orchid', 'tulip', 'other'] as const;
const fruitOptions = ['apple', 'banana', 'mango', 'orange', 'grape', 'strawberry', 'other'] as const;
const animalOptions = ['dog', 'cat', 'bird', 'dolphin', 'elephant', 'lion', 'other'] as const;
const sunriseOptions = ['sunrise', 'sunset'] as const;
const petsOptions = ['dogs', 'cats'] as const;

export default function SurveyPage() {
  const { t, lang } = useI18n();
  const [searchParams] = useSearchParams();
  const [savedForm, setSavedForm] = useLocalStorage<FormValues>('preferencehub-form', defaultValues);
  const [currentStep, setCurrentStep] = useState(() => {
    const stepParam = Number(searchParams.get('step') ?? 0);
    return Number.isFinite(stepParam) && stepParam >= 0 && stepParam < 9 ? stepParam : 0;
  });
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: savedForm,
    mode: 'onTouched',
  });

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      reset(savedForm);
      hasInitialized.current = true;
    }
  }, [reset, savedForm]);

  const watchAll = watch();
  useEffect(() => {
    setSavedForm(watchAll);
  }, [watchAll, setSavedForm]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const onSubmit = () => {
    navigate('/review');
  };

  const steps = useMemo(
    () => [
      {
        id: 'firstName',
        title: t('basic.firstName'),
        description: t('basic.firstNameHelp'),
        type: 'text',
      },
      {
        id: 'ageGroup',
        title: t('basic.ageGroup'),
        type: 'radio',
        options: ageGroups,
        helper: t('basic.ageGroupHelper'),
      },
      {
        id: 'gender',
        title: t('basic.gender'),
        type: 'radio',
        options: genderOptions,
        helper: t('basic.genderHelper'),
        otherKey: 'genderOther',
      },
      {
        id: 'favoriteColor',
        title: t('preferences.favoriteColor'),
        type: 'radio',
        options: colorOptions,
        helper: t('preferences.favoriteColorHelper'),
        otherKey: 'favoriteColorOther',
      },
      {
        id: 'favoriteFlower',
        title: t('preferences.favoriteFlower'),
        type: 'select',
        options: flowerOptions,
        helper: t('preferences.favoriteFlowerHelper'),
        otherKey: 'favoriteFlowerOther',
      },
      {
        id: 'favoriteFruit',
        title: t('preferences.favoriteFruit'),
        type: 'select',
        options: fruitOptions,
        helper: t('preferences.favoriteFruitHelper'),
        otherKey: 'favoriteFruitOther',
      },
      {
        id: 'favoriteAnimal',
        title: t('preferences.favoriteAnimal'),
        type: 'radio',
        options: animalOptions,
        helper: t('preferences.favoriteAnimalHelper'),
        otherKey: 'favoriteAnimalOther',
      },
      {
        id: 'sunriseOrSunset',
        title: t('preferences.sunriseOrSunset'),
        type: 'radio',
        options: sunriseOptions,
        helper: t('preferences.sunriseOrSunsetHelper'),
      },
      {
        id: 'petsPreference',
        title: t('preferences.dogsOrCats'),
        type: 'radio',
        options: petsOptions,
        helper: t('preferences.dogsOrCatsHelper'),
      },
    ],
    [t],
  );

  const step = steps[currentStep];
  const completed = Math.round(((currentStep + 1) / steps.length) * 100);
  const remainingTime = Math.max(1, Math.ceil(((steps.length - currentStep - 1) * 12) / 60));

  const showOtherField = ['other'].includes((watchAll[step.id as keyof FormValues] as string) ?? '');

  const handleNext = async () => {
    const targetFields = [step.id as keyof FormValues];
    if (step.otherKey && showOtherField) {
      targetFields.push(step.otherKey as keyof FormValues);
    }
    const valid = await trigger(targetFields);
    if (!valid) return;
    if (currentStep + 1 === steps.length) {
      handleSubmit(onSubmit)();
      return;
    }
    setCurrentStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((current) => current - 1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-10">
      <Card title={t('survey.title')} description={t('survey.subtitle')}>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 text-sm text-slate-300 sm:text-base">
              <p>{t('survey.questionCounter', { current: currentStep + 1, total: steps.length })}</p>
              <p>{t('survey.estimatedTime', { minutes: remainingTime })}</p>
            </div>
            <ProgressBar value={completed} />
          </div>

          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="space-y-3 rounded-3xl border border-violet-500/10 bg-slate-950/80 p-6 shadow-soft">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">{step.title}</h2>
                {step.helper ? <p className="text-sm text-slate-400">{step.helper}</p> : null}
              </div>

              {step.type === 'text' ? (
                <label className="space-y-2 text-sm text-slate-200">
                  <span>{t('survey.inputLabel')}</span>
                  <input
                    {...register(step.id as keyof FormValues, {
                      maxLength: { value: 100, message: t('validation.maxLength') },
                      validate: (value) => {
                        if (!value.trim()) return true;
                        return /\d/.test(value) ? t('validation.noNumbers') : true;
                      },
                      setValueAs: (value) => value.trim(),
                    })}
                    placeholder={t('survey.enterText')}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-100 transition focus:border-violet-400 focus:outline-none"
                  />
                  {errors[step.id as keyof FormValues] ? <p className="text-sm text-rose-400">{errors[step.id as keyof FormValues]?.message}</p> : null}
                </label>
              ) : null}

              {step.type === 'radio' ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {step.options?.map((value) => (
                    <label
                      key={value}
                      className="flex cursor-pointer items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 transition hover:border-violet-400"
                    >
                      <input
                        type="radio"
                        value={value}
                        {...register(step.id as keyof FormValues, {
                          required: t('validation.required'),
                        })}
                        className="h-4 w-4 accent-violet-500"
                      />
                      <span>{t(`options.${step.id}.${value}`)}</span>
                    </label>
                  ))}
                </div>
              ) : null}

              {step.type === 'select' ? (
                <label className="space-y-2 text-sm text-slate-200">
                  <span>{t('survey.chooseOption')}</span>
                  <select
                    {...register(step.id as keyof FormValues, {
                      required: t('validation.required'),
                    })}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-100 transition focus:border-violet-400 focus:outline-none"
                  >
                    <option value="">{t('survey.chooseFromBelow')}</option>
                    {step.options?.map((value) => (
                      <option key={value} value={value}>
                        {t(`options.${step.id}.${value}`)}
                      </option>
                    ))}
                  </select>
                  {errors[step.id as keyof FormValues] ? <p className="text-sm text-rose-400">{errors[step.id as keyof FormValues]?.message}</p> : null}
                </label>
              ) : null}

              {step.otherKey && showOtherField ? (
                <label className="space-y-2 text-sm text-slate-200">
                  <span>{t('survey.otherFieldLabel')}</span>
                  <input
                    {...register(step.otherKey as keyof FormValues, {
                      required: t('validation.otherRequired'),
                      maxLength: { value: 100, message: t('validation.maxLength') },
                      validate: (value) => (!value.trim() ? t('validation.otherRequired') : /\d/.test(value) ? t('validation.noNumbers') : true),
                      setValueAs: (value) => value.trim(),
                    })}
                    placeholder={t('survey.otherPlaceholder')}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-100 transition focus:border-violet-400 focus:outline-none"
                  />
                  {errors[step.otherKey as keyof FormValues] ? <p className="text-sm text-rose-400">{errors[step.otherKey as keyof FormValues]?.message}</p> : null}
                </label>
              ) : null}

              {step.type === 'radio' && errors[step.id as keyof FormValues] ? <p className="text-sm text-rose-400">{errors[step.id as keyof FormValues]?.message}</p> : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-3xl border border-violet-500/20 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-violet-100 transition hover:bg-slate-800"
              >
                {t('survey.back')}
              </button>
              <AccentButton type="button" onClick={handleNext}>
                {currentStep + 1 === steps.length ? t('survey.review') : t('survey.next')}
              </AccentButton>
            </div>
          </motion.div>
        </div>
      </Card>
    </div>
  );
}
