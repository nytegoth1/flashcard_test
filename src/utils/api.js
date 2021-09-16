import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUID } from "./helper";
//import shine from '../../assets/shinex2.png';
//import shrek from '../../assets/shrek-face.png';

const FLASHCARDS_STORAGE_KEY = "flashcards_data";

function initialData() {
  return {
    "632mgp7hm68vzvg2amz1hq": {
      id: "632mgp7hm68vzvg2amz1hq",
      title: "Movies",
      questions: [
        {
          question: "Who was known to say: Here's Johnny?",
          answer:
            "Jack Nicholson",
            //avatarURL: shine
        },
        {
          question: "Who was the voice of ShrekTM?",
          answer:
            "Mike Myers",
            //avatarURL: shrek
        },
        {
          question: "Who is the only actor to receive an Oscar nomination for acting in a Lord of the Rings?",
          answer:
            "Ian McKellen"
        },
        {
          question: "What is the highest-grossing R-rated movie of all time?",
          answer: "Joker"
        },
        {
          question: "Who is the first actor to play Jack Ryan on screen?",
          answer: "Alec Baldwin"
        }
      ]
    },
    "724mgp7hm68vzvg2amz1hq": {
      id: "724mgp7hm68vzvg2amz1hq",
      title: "Music",
      questions: [
        {
          question: "Who founded Motown Records?",
          answer: "Berry Gordy"
        },
        {
          question: "Jimi Hendrix only had one Top 40 hit. Which song was it?",
          answer: "All Along the Watchtower"
        },
        {
          question:
            "What was Elvis Presley‘s first No. 1 hit in the US?",
          answer: "Heartbreak Hotel"
        },
        {
          question:
            "Which classical composer was deaf",
          answer: "Ludwig van Beethoven"
        }
      ]
    },
    "636jgrwdbhf58lxznh9q79": {
      id: "636jgrwdbhf58lxznh9q79",
      title: "Video Games",
      questions: [
        {
          question: "What was the first commercially successful video game?",
          answer: "PONG"
        },
        {
          question: "What popular dining franchise is the founder of Atari also responsible for?",
          answer:
            "Chuck E Cheese"
        },
        {
          question: "What position did the creator of the Game Boy have at Nintendo?",
          answer:
            "A Janitor"
        },
        {
          question: "Mario first appeared in what video game?",
          answer:
            "Donkey Kong"
        }
      ]
    }
  };
}

export async function getDecks() {
  try {
    const results = await AsyncStorage.getItem(FLASHCARDS_STORAGE_KEY);
    if (results) {
      const data = JSON.parse(results);
      return data;
    } else {
      await AsyncStorage.setItem(
        FLASHCARDS_STORAGE_KEY,
        JSON.stringify(initialData())
      );
      return initialData();
    }
  } catch (error) {
    await AsyncStorage.setItem(
      FLASHCARDS_STORAGE_KEY,
      JSON.stringify(initialData())
    );
    return initialData();
  }
}

export async function saveDeckTitle(title) {
  const id = generateUID();
  const deck = {
    id: id,
    title: title,
    //correctAnswer: correctAnswer,
    questions: []
  };

  await AsyncStorage.mergeItem(
    FLASHCARDS_STORAGE_KEY,
    JSON.stringify({
      [id]: deck
    })
  );
  return deck;
}

export async function saveCardToDeck(deckId, card) {
  const results = await AsyncStorage.getItem(FLASHCARDS_STORAGE_KEY);
  if (results) {
    const data = JSON.parse(results);
    const deck = data[deckId];
    deck.questions = deck.questions.concat([card]);
    await AsyncStorage.mergeItem(
      FLASHCARDS_STORAGE_KEY,
      JSON.stringify({
        [deckId]: deck
      })
    );
    return card;
  }
}

export async function removeDeck(deckId) {
  const results = await AsyncStorage.getItem(FLASHCARDS_STORAGE_KEY);
  if (results) {
    const data = JSON.parse(results);
    delete data[deckId];

    await AsyncStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(data));
    return data;
  }
  return {};
}
