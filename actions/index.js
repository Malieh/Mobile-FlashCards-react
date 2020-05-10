export const GET_DECKS = "GET_DECKS";
export const GET_DECK = "GET_DECK";
export const getDeck = (deck) => {
  return {
    type: GET_DECK,
    deck,
  };
};
export const getDecks = (decks) => {
  return {
    type: GET_DECKS,
    decks,
  };
};
