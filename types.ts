
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  startPage: number;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | any;
  surah?: {
    number: number;
    name: string;
    englishName: string;
  };
}

export interface PageData {
  number: number;
  ayahs: Ayah[];
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  Sepia = 'sepia'
}

export enum BorderStyle {
  Ornate = 'ornate',
  Solid = 'solid',
  Dashed = 'dashed',
  Dotted = 'dotted',
  Minimal = 'minimal'
}

export interface AppSettings {
  theme: Theme;
  fontSize: number;
  opacity: number;
  fontFamily: string;
  borderStyle: BorderStyle;
}
