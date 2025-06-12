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

// trusted user data
export const trustedUserAvatar = [
  {
    imageUrl: "https://cdn.pixabay.com/photo/2020/10/19/09/44/woman-5667299_1280.jpg",
    profileUrl: "#",
    altText: "Dillion Verma",
  },
  {
    imageUrl: "https://cdn.pixabay.com/photo/2021/03/14/10/13/girl-6093779_1280.jpg",
    profileUrl: "#",
    altText: "Tomonari Feehan",
  },
  {
    imageUrl: "https://cdn.pixabay.com/photo/2020/02/05/14/05/man-4821291_1280.jpg",
    profileUrl: "#",
    altText: "BankkRoll",
  },
  {
    imageUrl: "https://cdn.pixabay.com/photo/2017/03/27/13/28/man-2178721_640.jpg",
    profileUrl: "#",
    altText: "Safet The Code",
  },
];

