import { useCallback, useEffect, useRef, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const timeoutIdRef = useRef(null);
  const MAX_RETRIES = 1;
  const RETRY_DELAY = 4000;

  const fetchData = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }

    if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
      setLoading(false);
      const errorMessage =
        "Cannot call chrome.runtime.sendMessage. This must be run in a Chrome extension.";
      console.error(errorMessage);
      // To allow local development, we are sending mock data
      //       setData({
      //   "result": "ভালোবাসা",
      //   "from": {
      //     "suggestions": [
      //       {
      //         "text": "love",
      //         "translation": " "
      //       },
      //       {
      //         "text": "love you",
      //         "translation": " "
      //       },
      //       {
      //         "text": "love you too",
      //         "translation": " "
      //       }
      //     ],
      //     "pronunciation": "ləv"
      //   },
      //   "pronunciation": "Bhālōbāsā",
      //   "examples": [
      //     "I do realize that people get married because they love each other",
      //     "I love this job",
      //     "we were slowly falling in love",
      //     "she was the love of his life",
      //     "I'd love a cup of tea",
      //     "they were both in love with her",
      //     "love songs",
      //     "I just love dancing",
      //     "love fifteen",
      //     "his love for football",
      //     "babies fill parents with feelings of love",
      //     "he was down two sets to love",
      //     "they love to play golf",
      //     "don't fret, there's a love",
      //     "give her my love",
      //     "their love for their country",
      //     "take care, lots of love, Judy",
      //     "it was love at first sight",
      //     "we share a love of music"
      //   ],
      //   "definitions": {
      //     "noun": [
      //       {
      //         "definition": "an intense feeling of deep affection.",
      //         "example": "babies fill parents with feelings of love",
      //         "synonyms": {
      //           "common": [
      //             "deep affection fondness tenderness warmth intimacy attachment endearment devotion adoration doting idolization worship passion ardor desire lust yearning infatuation adulation besottedness compassion care caring regard solicitude concern warmth friendliness friendship kindness charity goodwill sympathy kindliness altruism philanthropy unselfishness benevolence brotherliness sisterliness fellow feeling humanity relationship love affair affair romance liaison affair of the heart intrigue amour"
      //           ]
      //         }
      //       },
      //       {
      //         "definition": "a great interest and pleasure in something.",
      //         "example": "his love for football",
      //         "synonyms": {
      //           "common": [
      //             "liking weakness partiality bent leaning proclivity inclination disposition enjoyment appreciation soft spot taste delight relish passion zeal appetite zest enthusiasm keenness predilection penchant fondness"
      //           ]
      //         }
      //       },
      //       {
      //         "definition": "a person or thing that one loves.",
      //         "example": "she was the love of his life",
      //         "synonyms": {
      //           "common": [
      //             "beloved loved one love of one's life dear dearest dear one darling sweetheart sweet sweet one angel honey lover boyfriend girlfriend significant other betrothed paramour inamorata inamorato querida"
      //           ]
      //         }
      //       },
      //       {
      //         "definition": "(in tennis, squash, and some other sports) a score of zero; nil.",
      //         "example": "love fifteen"
      //       }
      //     ],
      //     "verb": [
      //       {
      //         "definition": "feel deep affection for (someone).",
      //         "example": "he loved his sister dearly",
      //         "synonyms": {
      //           "common": [
      //             "be in love with be infatuated with be smitten with be besotted with be passionate about care very much for feel deep affection for hold very dear adore think the world of be devoted to dote on cherish worship idolize treasure prize"
      //           ],
      //           "informal": [
      //             "be mad/crazy/nuts/wild about have a pash on carry a torch for be potty about"
      //           ]
      //         }
      //       },
      //       {
      //         "definition": "like or enjoy very much.",
      //         "example": "I just love dancing",
      //         "synonyms": {
      //           "common": [
      //             "like very much delight in enjoy greatly have a passion for take great pleasure in derive great pleasure from have a great liking for be addicted to relish savor have a weakness for be partial to have a soft spot for have a taste for be taken with have a predilection for have a proclivity for have a penchant for"
      //           ],
      //           "informal": [
      //             "get a kick from/out of have a thing about/for be mad for/about be crazy/nuts/wild about be hooked on get off on get a buzz from/out of be potty about go a bundle on"
      //           ]
      //         }
      //       }
      //     ]
      //   },
      //   "translations": {
      //     "noun": [
      //       {
      //         "translation": "ভালবাসা",
      //         "reversedTranslations": [
      //           "love",
      //           "loving",
      //           "affection",
      //           "attachment",
      //           "endearment",
      //           "fancy"
      //         ],
      //         "frequency": "common"
      //       },
      //       {
      //         "translation": "দয়া",
      //         "reversedTranslations": [
      //           "grace",
      //           "kindness",
      //           "goodness",
      //           "compassion",
      //           "favor",
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "স্নেহ",
      //         "reversedTranslations": [
      //           "affection",
      //           "fondness",
      //           "love",
      //           "feeling",
      //           "loving",
      //           "endearment"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "আদর",
      //         "reversedTranslations": [
      //           "caress",
      //           "love",
      //           "affection",
      //           "honor",
      //           "appreciation",
      //           "endearment"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "অনুরাগ",
      //         "reversedTranslations": [
      //           "affection",
      //           "attachment",
      //           "love",
      //           "fondness",
      //           "inclination"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "মমতা",
      //         "reversedTranslations": [
      //           "affection",
      //           "love",
      //           "attachment"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "আকর্ষণ",
      //         "reversedTranslations": [
      //           "attraction",
      //           "draw",
      //           "traction",
      //           "fascination",
      //           "drawing",
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "কাম",
      //         "reversedTranslations": [
      //           "lust",
      //           "deed",
      //           "work",
      //           "love",
      //           "action",
      //           "affection"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "ভাব",
      //         "reversedTranslations": [
      //           "coloring",
      //           "indecision",
      //           "brainchild",
      //           "idea",
      //           "mind",
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "লালসা",
      //         "reversedTranslations": [
      //           "lustcovetousness",
      //           "greediness",
      //           "rapacity",
      //           "avarice",
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "পেয়ার",
      //         "reversedTranslations": [
      //           "paircaress",
      //           "love",
      //           "affection",
      //           "marriage",
      //           "fondling"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "করুণা",
      //         "reversedTranslations": [
      //           "mercylove",
      //           "sympathy",
      //           "lenity",
      //           "remorse",
      //           "ruth"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "প্রণয়",
      //         "reversedTranslations": [
      //           "loveloving",
      //           "amour",
      //           "affection",
      //           "attachment",
      //           "friendship"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "প্রীতি",
      //         "reversedTranslations": [
      //           "loveloving",
      //           "amour"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "রতি",
      //         "reversedTranslations": [
      //           "copulationlove",
      //           "attachment"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "অনুরাগপছন্দ",
      //         "reversedTranslations": [
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "প্রবল পছন্দ",
      //         "reversedTranslations": [
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "পিরিত",
      //         "reversedTranslations": [
      //           "amouraffection",
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "অনুরক্তি",
      //         "reversedTranslations": [
      //           "inclinationdevotion",
      //           "fidelity",
      //           "proneness",
      //           "attachment",
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "আসক্তি",
      //         "reversedTranslations": [
      //           "attachmentliking",
      //           "penchant",
      //           "love",
      //           "feeling",
      //           "attention"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "অনুষঙ্গ",
      //         "reversedTranslations": [
      //           "contextadherence",
      //           "connexion",
      //           "affection",
      //           "association",
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "আসঙ্গ",
      //         "reversedTranslations": [
      //           "sexual intercourselove",
      //           "attachment",
      //           "company",
      //           "union"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "পরিচয়",
      //         "reversedTranslations": [
      //           "acquaintanceintroduction",
      //           "antecedents",
      //           "reputation",
      //           "impression",
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "লিপ্সা",
      //         "reversedTranslations": [
      //           "yearningavidity",
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "প্রণয়ঘটিত ব্যাপার",
      //         "reversedTranslations": [
      //           "affairslove affair",
      //           "love",
      //           "affair"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "প্রণয়লীলা",
      //         "reversedTranslations": [
      //           "love affairlove",
      //           "amour",
      //           "gallantry"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "প্রণয়দেবতা",
      //         "reversedTranslations": [
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "কামদেব",
      //         "reversedTranslations": [
      //           "Kamalove"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "সোহাগ",
      //         "reversedTranslations": [
      //           "caressaffection",
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "লোভ",
      //         "reversedTranslations": [
      //           "temptationallurement",
      //           "greediness",
      //           "cupidity",
      //           "love",
      //           "avarice"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "প্রেম",
      //         "reversedTranslations": [
      //           "love",
      //           "fancy",
      //           "amour"
      //         ],
      //         "frequency": "common"
      //       }
      //     ],
      //     "verb": [
      //       {
      //         "translation": "স্নেহ করা",
      //         "reversedTranslations": [
      //           "cherishlove",
      //           "fancy"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "প্রীতিপূর্ণ হত্তয়া",
      //         "reversedTranslations": [
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "পেয়ার করা",
      //         "reversedTranslations": [
      //           "caressfondle",
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "আসক্ত হত্তয়া",
      //         "reversedTranslations": [
      //           "become addictedlove",
      //           "attach",
      //           "be keen on",
      //           "cotton",
      //           "addict"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "প্রবলভাবে পছন্দ করা",
      //         "reversedTranslations": [
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "প্রণয়াকাঙ্ক্ষী হত্তয়া",
      //         "reversedTranslations": [
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "লুব্ধ হত্তয়া",
      //         "reversedTranslations": [
      //           "love"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "লিপ্সু হত্তয়া",
      //         "reversedTranslations": [
      //           "long forlove"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "করুণা করা",
      //         "reversedTranslations": [
      //           "pitylove"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "সোহাগ করা",
      //         "reversedTranslations": [
      //           "lovecaress",
      //           "fondle",
      //           "canoodle",
      //           "dandle"
      //         ],
      //         "frequency": "rare"
      //       },
      //       {
      //         "translation": "ভালবাসা",
      //         "reversedTranslations": [
      //           "love",
      //           "become addicted",
      //           "addict",
      //           "be fond of",
      //           "be keen on",
      //           "be carried away"
      //         ],
      //         "frequency": "common"
      //       }
      //     ]
      //   }
      // });
      setData({
        result:
          "১৯৫০-এর দশকে আগত পারমাণবিক বা প্রচলিত অস্ত্রকে বাধা দিতে সক্ষম সিস্টেম তৈরির জন্য প্রোগ্রামগুলি প্রথম চালু হওয়ার পর থেকে, মার্কিন যুক্তরাষ্ট্র বিভিন্ন ক্ষেপণাস্ত্র প্রতিরক্ষা কর্মসূচিতে ৪০০ বিলিয়ন ডলারেরও বেশি ব্যয় করেছে।কয়েক দশক ধরে গবেষণা, উন্নয়ন এবং পরীক্ষা-নিরীক্ষার পরেও, আন্তঃমহাদেশীয় ব্যালিস্টিক ক্ষেপণাস্ত্র (ICBM) মোকাবেলা করার জন্য কোনও নির্ভরযোগ্যভাবে কার্যকর অ্যান্টি-মিসাইল সিস্টেম এখনও অবধি নেই।প্যাট্রিয়ট এবং THAAD ক্ষেপণাস্ত্র প্রতিরক্ষা কর্মসূচির মতো স্বল্প-পাল্লার ক্ষেপণাস্ত্র মোকাবেলা করার জন্য সিস্টেমগুলি পরীক্ষায় বেশি সফল হয়েছে, তবে তাদের উপযোগিতা ছোট, আঞ্চলিক কভারেজ এলাকায় সীমাবদ্ধ।প্রকৃতপক্ষে, ICBM-কে বাধা দেওয়ার জন্য মনোনীত সিস্টেম, যা গ্রাউন্ড-ভিত্তিক মিডকোর্স ডিফেন্স (GMD) প্রোগ্রাম নামে পরিচিত, তার ১৯টি পরীক্ষার মধ্যে আটটিতে ব্যর্থ হয়েছে।এই ব্যর্থ পরীক্ষার রেকর্ডটি পরীক্ষার অত্যন্ত স্ক্রিপ্টেড অবস্থার দ্বারা আরও খারাপ হয়েছে।",
        pronunciation:
          "1950-Ēra daśakē āgata pāramāṇabika bā pracalita astrakē bādhā ditē sakṣama sisṭēma tairira jan'ya prōgrāmaguli prathama cālu ha'ōẏāra para thēkē, mārkina yuktarāṣṭra bibhinna kṣēpaṇāstra pratirakṣā karmasūcitē 400 biliẏana ḍalārēra'ō bēśi byaẏa karēchē. Kaẏēka daśaka dharē gabēṣaṇā, unnaẏana ēbaṁ parīkṣā-nirīkṣāra parē'ō, āntaḥmahādēśīẏa byālisṭika kṣēpaṇāstra (ICBM) mōkābēlā karāra jan'ya kōna'ō nirbharayōgyabhābē kāryakara ayānṭi-misā'ila sisṭēma ēkhana'ō abadhi nē'i. Pyāṭriẏaṭa ēbaṁ THAAD kṣēpaṇāstra pratirakṣā karmasūcira matō sbalpa-pāllāra kṣēpaṇāstra mōkābēlā karāra jan'ya sisṭēmaguli parīkṣāẏa bēśi saphala haẏēchē, tabē tādēra upayōgitā chōṭa, āñcalika kabhārēja ēlākāẏa sīmābad'dha. Prakr̥tapakṣē, ICBM-kē bādhā dē'ōẏāra jan'ya manōnīta sisṭēma, yā grā'unḍa-bhittika miḍakōrsa ḍiphēnsa (GMD) prōgrāma nāmē paricita, tāra 19ṭi parīkṣāra madhyē āṭaṭitē byartha haẏēchē. Ē'i byartha parīkṣāra rēkarḍaṭi parīkṣāra atyanta skripṭēḍa abasthāra dbārā āra'ō khārāpa haẏēchē.",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await chrome.runtime.sendMessage({
        type: "api-request",
        url,
      });

      if (chrome.runtime.lastError) {
        throw new Error(chrome.runtime.lastError.message);
      }

      // Handle custom errors returned within the response object
      if (response && response.error) {
        throw new Error(response.error);
      }

      // On success, update data and stop loading
      setData(response);
      setLoading(false);
    } catch (err) {
      console.error(`Fetch attempt ${attempt + 1} failed:`, err.message);

      if (attempt < MAX_RETRIES) {
        timeoutIdRef.current = setTimeout(() => {
          setAttempt((prev) => prev + 1);
        }, RETRY_DELAY);
      } else {
        setError(err);
        setLoading(false);
      }
    }
  }, [url, attempt]);

  // This effect triggers the fetch when the url or attempt count changes
  useEffect(() => {
    fetchData();
    return () => {
      clearTimeout(timeoutIdRef.current);
    };
  }, [fetchData]);

  // This effect resets the entire fetch cycle when the URL changes
  useEffect(() => {
    setData(null);
    setError(null);
    setAttempt(0);
  }, [url]);

  // Expose a function to allow the UI to trigger a manual retry
  const retry = useCallback(() => {
    setData(null);
    setError(null);
    setAttempt(0);
  }, []);

  return { data, loading, error, retry };
};

export default useFetch;
