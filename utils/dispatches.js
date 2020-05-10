import { fetchAllDecks, fetchDeck } from "../utils/api";
import { getDecks, getDeck } from "../actions";

export const loadDeck = (title, dispatch) => {
  fetchDeck(title).then((deck) => {
    dispatch(getDeck(deck));
  });
};
export const loadDecks = (dispatch) => {
  fetchAllDecks().then((decks) => {
    dispatch(getDecks(decks));
  });
};
