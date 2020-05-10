import { AsyncStorage } from "react-native";
import { DECK_STORAGE_KEY } from "./helpers";
export const saveDeckTitle = (title) => {
  return AsyncStorage.mergeItem(
    DECK_STORAGE_KEY,
    JSON.stringify({ [title]: { title: title, questions: [] } })
  );
};
export const fetchDeck = (title) => {
  return AsyncStorage.getItem(DECK_STORAGE_KEY).then((results) => {
    const data = JSON.parse(results);
    return data[title];
  });
};
export const removeDeck = (deck) => {
  return AsyncStorage.getItem(DECK_STORAGE_KEY).then((results) => {
    const data = JSON.parse(results);
    data[deck] = undefined;
    delete data[deck];
    AsyncStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(data));
  });
};
export const addCardToDeck = (title, question) => {
  return AsyncStorage.getItem(DECK_STORAGE_KEY).then((results) => {
    const data = JSON.parse(results);
    if (data[title] !== undefined) {
      data[title].questions.push(question);
      AsyncStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(data));
    }
  });
};
export const fetchAllDecks = () => {
  return AsyncStorage.getItem(DECK_STORAGE_KEY).then((results) => {
    return JSON.parse(results);
  });
};
