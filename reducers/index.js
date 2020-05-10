import { GET_DECKS, GET_DECK } from "../actions";
const initState = {
  decks: [],
  deck: {
    title: "",
    questions: [],
  },
};
export const decks = (state = initState, action) => {
  switch (action.type) {
    case GET_DECK:
      return {
        ...state,
        deck: action.deck,
      };
    case GET_DECKS:
      if (action.decks !== null && action.decks !== undefined)
        return {
          ...state,
          decks: Object.keys(action.decks).map(function (k) {
            return action.decks[k];
          }),
        };
      return state;

    default:
      return state;
  }
};
