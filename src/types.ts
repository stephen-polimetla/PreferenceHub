export type LocaleKey = 'en' | 'te';

export interface FormValues {
  firstName: string;
  ageGroup: string;
  gender: string;
  genderOther: string;
  favoriteCuisine: string;
  favoriteDessert: string;
  favoriteDrink: string;
  favoriteSeason: string;
  favoriteSport: string;
  favoriteMovieGenre: string;
  favoriteMusicGenre: string;
  favoriteActor: string;
  favoriteActress: string;
  favoriteHolidayDestination: string;
  favoriteHobby: string;
  dreamCarColor: string;
  preferredClothingColor: string;
  favoriteFestival: string;
  favoriteIceCream: string;
  favoriteSuperhero: string;
  favoriteQuote: string;
  favoriteBookGenre: string;
  favoriteTimeOfDay: string;
  coffeeOrTea: string;
  sweetOrSpicy: string;
  beachOrMountains: string;
  androidOrIphone: string;
  netflixOrYoutube: string;
  summerOrWinter: string;
  rainOrSnow: string;
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
  favoriteCuisine: string;
  favoriteDessert: string;
  favoriteDrink: string;
  favoriteSeason: string;
  favoriteSport: string;
  favoriteMovieGenre: string;
  favoriteMusicGenre: string;
  favoriteActor: string;
  favoriteActress: string;
  favoriteHolidayDestination: string;
  favoriteHobby: string;
  dreamCarColor: string;
  preferredClothingColor: string;
  favoriteFestival: string;
  favoriteIceCream: string;
  favoriteSuperhero: string;
  favoriteQuote: string;
  favoriteBookGenre: string;
  favoriteTimeOfDay: string;
  coffeeOrTea: string;
  sweetOrSpicy: string;
  beachOrMountains: string;
  androidOrIphone: string;
  netflixOrYoutube: string;
  summerOrWinter: string;
  rainOrSnow: string;
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
