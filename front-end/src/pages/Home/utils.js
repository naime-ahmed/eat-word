import imgForLongMemo from "../../assets/longTimeMemoCardIcon.webp";
import imgForRevised from "../../assets/revisionWeekCardIcon.webp";
import imgForShortMemo from "../../assets/shortTimeMemoCardIcon.webp";
import imgForTestOnSelf from "../../assets/testOnSelfCardIcon.webp";
import imgForListWord from "../../assets/wordListDownCardIcon.webp";
import imgForFindWord from "../../assets/wordSearchCardIcon.webp";

// cards data for journey of a word
export const cards = () => [
  {
    img: imgForFindWord,
    alt: "Discovering a new word",
    text: "Stumbled upon a new word?",
  },
  {
    img: imgForListWord,
    alt: "Adding a word to your list",
    text: "Save it to your active challenge.",
  },
  {
    img: imgForShortMemo,
    alt: "Committing a word to short-term memory",
    text: "Start learning—it's now in short-term memory.",
  },
  {
    img: imgForRevised,
    alt: "Reviewing words during the week",
    text: "Revisit once daily or every other day this week.",
  },
  {
    img: imgForTestOnSelf,
    alt: "Self-testing your word knowledge",
    text: "Test yourself weekly. Flag any forgotten words and prepare for your next round.",
  },
  {
    img: imgForLongMemo,
    alt: "Words stored in long-term memory",
    text: "Remembered? That word's now yours—locked in long-term memory.",
  },
];

// svg data for journey of a word
export const dashBorderConfigs = () => [
  {
    id: "",
    viewBox: "0 0 0 0",
    d: "M1.72656 1.86328C1.72656 100.386 81.5642 180.193 180.125 180.193",
  },
  {
    id: "gradient-stroke1",
    viewBox: "0 0 182 182",
    d: "M1.72656 1.86328C1.72656 100.386 81.5642 180.193 180.125 180.193",
    pathColor1: "#BAEFFF",
    pathColor2: "#58D9A2",
  },
  {
    id: "gradient-stroke2",
    viewBox: "0 0 182 181",
    d: "M180.273 1.42188C180.273 99.9447 100.436 179.752 1.875 179.752",
    pathColor1: "#2286C1",
    pathColor2: "#58D9A2",
  },
  {
    id: "gradient-stroke3",
    viewBox: "0 0 182 182",
    d: "M1.72656 1.86328C1.72656 100.386 81.5642 180.193 180.125 180.193",
    pathColor1: "#2286C1",
    pathColor2: "#FA2B61",
  },
  {
    id: "gradient-stroke4",
    viewBox: "0 0 182 181",
    d: "M180.273 1.42188C180.273 99.9447 100.436 179.752 1.875 179.752",
    pathColor1: "#3BB54A",
    pathColor2: "#FA2B61",
  },
  {
    id: "gradient-stroke5",
    viewBox: "0 0 182 182",
    d: "M1.72656 1.86328C1.72656 100.386 81.5642 180.193 180.125 180.193",
    pathColor1: "#3BB54A",
    pathColor2: "#FDB4BA",
  },
];

// A static mapping for language demonstration.
export const countryLanguageMapping = {
  CN: {
    motherTongue: "Mandarin Chinese",
    motherFlag: "cn",
    secondLanguage: "English",
    secondFlag: "us",
  },
  IN: {
    motherTongue: "Hindi",
    motherFlag: "in",
    secondLanguage: "English",
    secondFlag: "us",
  },
  US: {
    motherTongue: "English",
    motherFlag: "us",
    secondLanguage: "Spanish",
    secondFlag: "es",
  },
  ID: {
    motherTongue: "Indonesian",
    motherFlag: "id",
    secondLanguage: "English",
    secondFlag: "us",
  },
  BR: {
    motherTongue: "Portuguese",
    motherFlag: "br",
    secondLanguage: "English",
    secondFlag: "us",
  },
  RU: {
    motherTongue: "Russian",
    motherFlag: "ru",
    secondLanguage: "English",
    secondFlag: "us",
  },
  NG: {
    motherTongue: "English",
    motherFlag: "ng",
    secondLanguage: "French",
    secondFlag: "fr",
  },
  JP: {
    motherTongue: "Japanese",
    motherFlag: "jp",
    secondLanguage: "English",
    secondFlag: "us",
  },
  MX: {
    motherTongue: "Spanish",
    motherFlag: "mx",
    secondLanguage: "English",
    secondFlag: "us",
  },
  PK: {
    motherTongue: "Urdu",
    motherFlag: "pk",
    secondLanguage: "English",
    secondFlag: "us",
  },
  PH: {
    motherTongue: "Filipino",
    motherFlag: "ph",
    secondLanguage: "English",
    secondFlag: "us",
  },
  EG: {
    motherTongue: "Arabic",
    motherFlag: "eg",
    secondLanguage: "English",
    secondFlag: "us",
  },
  VN: {
    motherTongue: "Vietnamese",
    motherFlag: "vn",
    secondLanguage: "English",
    secondFlag: "us",
  },
  DE: {
    motherTongue: "German",
    motherFlag: "de",
    secondLanguage: "English",
    secondFlag: "us",
  },
  TR: {
    motherTongue: "Turkish",
    motherFlag: "tr",
    secondLanguage: "English",
    secondFlag: "us",
  },
  IR: {
    motherTongue: "Persian",
    motherFlag: "ir",
    secondLanguage: "English",
    secondFlag: "us",
  },
  BD: {
    motherTongue: "Bengali",
    motherFlag: "bd",
    secondLanguage: "English",
    secondFlag: "us",
  },
  GB: {
    motherTongue: "English",
    motherFlag: "gb",
    secondLanguage: "French",
    secondFlag: "fr",
  },
  TH: {
    motherTongue: "Thai",
    motherFlag: "th",
    secondLanguage: "English",
    secondFlag: "us",
  },
  FR: {
    motherTongue: "French",
    motherFlag: "fr",
    secondLanguage: "English",
    secondFlag: "us",
  },
  IT: {
    motherTongue: "Italian",
    motherFlag: "it",
    secondLanguage: "English",
    secondFlag: "us",
  },
  KR: {
    motherTongue: "Korean",
    motherFlag: "kr",
    secondLanguage: "English",
    secondFlag: "us",
  },
  ES: {
    motherTongue: "Spanish",
    motherFlag: "es",
    secondLanguage: "English",
    secondFlag: "us",
  },
  AR: {
    motherTongue: "Spanish",
    motherFlag: "ar",
    secondLanguage: "English",
    secondFlag: "us",
  },
  PL: {
    motherTongue: "Polish",
    motherFlag: "pl",
    secondLanguage: "English",
    secondFlag: "us",
  },
  CO: {
    motherTongue: "Spanish",
    motherFlag: "co",
    secondLanguage: "English",
    secondFlag: "us",
  },
  SA: {
    motherTongue: "Arabic",
    motherFlag: "sa",
    secondLanguage: "English",
    secondFlag: "us",
  },
  MY: {
    motherTongue: "Malay",
    motherFlag: "my",
    secondLanguage: "English",
    secondFlag: "us",
  },
  UA: {
    motherTongue: "Ukrainian",
    motherFlag: "ua",
    secondLanguage: "Russian",
    secondFlag: "ru",
  },
  ZA: {
    motherTongue: "Zulu",
    motherFlag: "za",
    secondLanguage: "English",
    secondFlag: "us",
  },
  MA: {
    motherTongue: "Arabic",
    motherFlag: "ma",
    secondLanguage: "French",
    secondFlag: "fr",
  },
  KE: {
    motherTongue: "Swahili",
    motherFlag: "ke",
    secondLanguage: "English",
    secondFlag: "us",
  },
  PE: {
    motherTongue: "Spanish",
    motherFlag: "pe",
    secondLanguage: "Quechua",
    secondFlag: "bo",
  },
  IQ: {
    motherTongue: "Arabic",
    motherFlag: "iq",
    secondLanguage: "Kurdish",
    secondFlag: "tr",
  },
  VE: {
    motherTongue: "Spanish",
    motherFlag: "ve",
    secondLanguage: "English",
    secondFlag: "us",
  },
  TW: {
    motherTongue: "Mandarin Chinese",
    motherFlag: "tw",
    secondLanguage: "English",
    secondFlag: "us",
  },
  AU: {
    motherTongue: "English",
    motherFlag: "au",
    secondLanguage: "Mandarin Chinese",
    secondFlag: "cn",
  },
  RO: {
    motherTongue: "Romanian",
    motherFlag: "ro",
    secondLanguage: "English",
    secondFlag: "us",
  },
  CL: {
    motherTongue: "Spanish",
    motherFlag: "cl",
    secondLanguage: "English",
    secondFlag: "us",
  },
  NL: {
    motherTongue: "Dutch",
    motherFlag: "nl",
    secondLanguage: "English",
    secondFlag: "us",
  },
  BE: {
    motherTongue: "Dutch",
    motherFlag: "be",
    secondLanguage: "French",
    secondFlag: "fr",
  },
  SE: {
    motherTongue: "Swedish",
    motherFlag: "se",
    secondLanguage: "English",
    secondFlag: "us",
  },
  CH: {
    motherTongue: "German",
    motherFlag: "ch",
    secondLanguage: "French",
    secondFlag: "fr",
  },
  AT: {
    motherTongue: "German",
    motherFlag: "at",
    secondLanguage: "English",
    secondFlag: "us",
  },
  CZ: {
    motherTongue: "Czech",
    motherFlag: "cz",
    secondLanguage: "English",
    secondFlag: "us",
  },
  GR: {
    motherTongue: "Greek",
    motherFlag: "gr",
    secondLanguage: "English",
    secondFlag: "us",
  },
  PT: {
    motherTongue: "Portuguese",
    motherFlag: "pt",
    secondLanguage: "English",
    secondFlag: "us",
  },
  HU: {
    motherTongue: "Hungarian",
    motherFlag: "hu",
    secondLanguage: "English",
    secondFlag: "us",
  },
  DK: {
    motherTongue: "Danish",
    motherFlag: "dk",
    secondLanguage: "English",
    secondFlag: "us",
  },
  FI: {
    motherTongue: "Finnish",
    motherFlag: "fi",
    secondLanguage: "English",
    secondFlag: "us",
  },
  NO: {
    motherTongue: "Norwegian",
    motherFlag: "no",
    secondLanguage: "English",
    secondFlag: "us",
  },
  SK: {
    motherTongue: "Slovak",
    motherFlag: "sk",
    secondLanguage: "English",
    secondFlag: "us",
  },
  KZ: {
    motherTongue: "Kazakh",
    motherFlag: "kz",
    secondLanguage: "Russian",
    secondFlag: "ru",
  },
  IL: {
    motherTongue: "Hebrew",
    motherFlag: "il",
    secondLanguage: "English",
    secondFlag: "us",
  },
  SG: {
    motherTongue: "English",
    motherFlag: "sg",
    secondLanguage: "Mandarin Chinese",
    secondFlag: "cn",
  },
  HK: {
    motherTongue: "Cantonese",
    motherFlag: "hk",
    secondLanguage: "English",
    secondFlag: "us",
  },
  NZ: {
    motherTongue: "English",
    motherFlag: "nz",
    secondLanguage: "Maori",
    secondFlag: "nz",
  },
  CA: {
    motherTongue: "English",
    motherFlag: "ca",
    secondLanguage: "French",
    secondFlag: "fr",
  },
  IE: {
    motherTongue: "English",
    motherFlag: "ie",
    secondLanguage: "Irish",
    secondFlag: "ie",
  },
  RS: {
    motherTongue: "Serbian",
    motherFlag: "rs",
    secondLanguage: "English",
    secondFlag: "us",
  },
  HR: {
    motherTongue: "Croatian",
    motherFlag: "hr",
    secondLanguage: "English",
    secondFlag: "us",
  },
  BG: {
    motherTongue: "Bulgarian",
    motherFlag: "bg",
    secondLanguage: "English",
    secondFlag: "us",
  },
  LT: {
    motherTongue: "Lithuanian",
    motherFlag: "lt",
    secondLanguage: "English",
    secondFlag: "us",
  },
  SI: {
    motherTongue: "Slovenian",
    motherFlag: "si",
    secondLanguage: "English",
    secondFlag: "us",
  },
  LV: {
    motherTongue: "Latvian",
    motherFlag: "lv",
    secondLanguage: "English",
    secondFlag: "us",
  },
  EE: {
    motherTongue: "Estonian",
    motherFlag: "ee",
    secondLanguage: "English",
    secondFlag: "us",
  },
  AL: {
    motherTongue: "Albanian",
    motherFlag: "al",
    secondLanguage: "English",
    secondFlag: "us",
  },
  MK: {
    motherTongue: "Macedonian",
    motherFlag: "mk",
    secondLanguage: "English",
    secondFlag: "us",
  },
  BA: {
    motherTongue: "Bosnian",
    motherFlag: "ba",
    secondLanguage: "English",
    secondFlag: "us",
  },
  ME: {
    motherTongue: "Montenegrin",
    motherFlag: "me",
    secondLanguage: "English",
    secondFlag: "us",
  },
  LU: {
    motherTongue: "Luxembourgish",
    motherFlag: "lu",
    secondLanguage: "French",
    secondFlag: "fr",
  },
  IS: {
    motherTongue: "Icelandic",
    motherFlag: "is",
    secondLanguage: "English",
    secondFlag: "us",
  },
  MT: {
    motherTongue: "Maltese",
    motherFlag: "mt",
    secondLanguage: "English",
    secondFlag: "us",
  },
  CY: {
    motherTongue: "Greek",
    motherFlag: "cy",
    secondLanguage: "English",
    secondFlag: "us",
  },
  MD: {
    motherTongue: "Romanian",
    motherFlag: "md",
    secondLanguage: "Russian",
    secondFlag: "ru",
  },
  GE: {
    motherTongue: "Georgian",
    motherFlag: "ge",
    secondLanguage: "Russian",
    secondFlag: "ru",
  },
  AM: {
    motherTongue: "Armenian",
    motherFlag: "am",
    secondLanguage: "Russian",
    secondFlag: "ru",
  },
  AZ: {
    motherTongue: "Azerbaijani",
    motherFlag: "az",
    secondLanguage: "Russian",
    secondFlag: "ru",
  },
  UZ: {
    motherTongue: "Uzbek",
    motherFlag: "uz",
    secondLanguage: "Russian",
    secondFlag: "ru",
  },
  TJ: {
    motherTongue: "Tajik",
    motherFlag: "tj",
    secondLanguage: "Russian",
    secondFlag: "ru",
  },
  KG: {
    motherTongue: "Kyrgyz",
    motherFlag: "kg",
    secondLanguage: "Russian",
    secondFlag: "ru",
  },
  TM: {
    motherTongue: "Turkmen",
    motherFlag: "tm",
    secondLanguage: "Russian",
    secondFlag: "ru",
  },
  AF: {
    motherTongue: "Pashto",
    motherFlag: "af",
    secondLanguage: "Dari",
    secondFlag: "af",
  },
  NP: {
    motherTongue: "Nepali",
    motherFlag: "np",
    secondLanguage: "English",
    secondFlag: "us",
  },
  LK: {
    motherTongue: "Sinhala",
    motherFlag: "lk",
    secondLanguage: "English",
    secondFlag: "us",
  },
  MM: {
    motherTongue: "Burmese",
    motherFlag: "mm",
    secondLanguage: "English",
    secondFlag: "us",
  },
  KH: {
    motherTongue: "Khmer",
    motherFlag: "kh",
    secondLanguage: "English",
    secondFlag: "us",
  },
  LA: {
    motherTongue: "Lao",
    motherFlag: "la",
    secondLanguage: "English",
    secondFlag: "us",
  },
  MN: {
    motherTongue: "Mongolian",
    motherFlag: "mn",
    secondLanguage: "Russian",
    secondFlag: "ru",
  },
};

export const getLanguageForVisitor = async (defaultCountry = 'BD') => {
  // Check cache validity
  const expiry = localStorage.getItem('countryCodeExpiry');
  if (expiry && Date.now() > Number(expiry)) {
    localStorage.removeItem('userCountryCode');
    localStorage.removeItem('countryCodeExpiry');
  }

  // Check cached country
  const cachedCountry = localStorage.getItem('userCountryCode');
  if (cachedCountry) {
    return cachedCountry;
  }

  try {
    const response = await fetch('https://ipapi.co/country/');
    const countryCode = (await response.text()).trim().toUpperCase();
    
    if (/^[A-Z]{2}$/.test(countryCode)) {
      localStorage.setItem('userCountryCode', countryCode);
      localStorage.setItem('countryCodeExpiry', Date.now() + 7 * 24 * 60 * 60 * 1000);
      return countryCode;
    }
  } catch (error) {
    console.error('Error detecting country:', error);
  }

  // Fallback to browser detection
  const locale = navigator.language || 'en-US';
  const browserCountry = (locale.split('-')[1] || defaultCountry).toUpperCase();
  return browserCountry;
};
