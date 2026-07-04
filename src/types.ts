export type LocaleKey = 'en' | 'te';

export interface FormValues {
  firstName: string;
  ageGroup: string;
  gender: string;
  genderOther: string;
  favoriteColor: string;
  favoriteColorOther: string;
  favoriteFlower: string;
  favoriteFlowerOther: string;
  favoriteFruit: string;
  favoriteFruitOther: string;
  favoriteAnimal: string;
  favoriteAnimalOther: string;
  sunriseOrSunset: string;
  petsPreference: string;
}

export interface SubmissionAnswers {
  firstName: string;
  ageGroup: string;
  gender: string;
  favoriteColor: string;
  favoriteFlower: string;
  favoriteFruit: string;
  favoriteAnimal: string;
  sunriseOrSunset: string;
  petsPreference: string;
}

export interface SubmissionData {
  language: LocaleKey;
  browser: string;
  deviceType: string;
  answers: SubmissionAnswers;
  createdAt?: string;
}
