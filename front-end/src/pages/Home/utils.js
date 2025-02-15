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
    alt: "Image of word search",
    text: "Clashed with unknown word?",
  },
  {
    img: imgForListWord,
    alt: "image of word list",
    text: "List it down and learn",
  },
  {
    img: imgForShortMemo,
    alt: "image of short time memory",
    text: "Now it's living in your short time memory",
  },
  {
    img: imgForRevised,
    alt: "image of revise the word for a week",
    text: "Revise either once per day or once every two days for a week.",
  },
  {
    img: imgForTestOnSelf,
    alt: "image of test on self",
    text: "Each week, test yourself on all the words you've learned. Mark any forgotten words in red, then start next week mission.",
  },
  {
    img: imgForLongMemo,
    alt: "image of long time memory",
    text: "Successfully remembering words in your self-test indicates they're now part of your long-term memory.",
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
