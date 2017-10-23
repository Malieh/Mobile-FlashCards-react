export const GET_DECKS = 'GET_DECKS'
export const GET_DECK = 'GET_DECK'

/**
 * @description take a list of decks and return it along with the type GET_DECKS
 * @param { array } decks
 */
export function getDecks (decks) {
    return {
        type: GET_DECKS,
        decks
    }
}

/**
 * @description take a deck and return it along with the type GET_DECK
 * @param { Object } deck
 */
export function getDeck (deck) {
    return {
        type: GET_DECK,
        deck
    }
}
