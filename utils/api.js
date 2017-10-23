import { AsyncStorage } from 'react-native'
import { DECK_STORAGE_KEY } from './helpers'

/**
 * @description fetch all decks from async storage
 */
export function fetchAllDecks () {
    return AsyncStorage.getItem(DECK_STORAGE_KEY)
        .then( (results) => {
            return JSON.parse(results)
        })
}

/**
 * @description fetch specific deck from async storage
 * @param { string } title
 */
export function fetchDeck (title) {
    return AsyncStorage.getItem(DECK_STORAGE_KEY)
        .then( (results) => {
            const data = JSON.parse(results);
            return data[title]
        })
}

/**
 * @description create a new deck by adding it's name as the key to an empty array
 * @param { string } title - Name of deck to create
 */
export function saveDeckTitle (title) {
    return AsyncStorage.mergeItem(DECK_STORAGE_KEY, JSON.stringify({ [title]: { title: title, questions: [] } }))
}

/**
 * @description add a card to a deck
 * @param { string } title
 * @param { object } question
 */
export function addCardToDeck (title, question) {
    return AsyncStorage.getItem(DECK_STORAGE_KEY)
        .then((results) => {
            const data = JSON.parse(results)
            if(data[title] !== undefined) {
                data[title].questions.push(question);
                AsyncStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(data))
            }
        })
}

/**
 * @description remove a deck from storage
 * @param { string } deck - which deck to remove
 */
export function removeDeck (deck) {
    return AsyncStorage.getItem(DECK_STORAGE_KEY)
        .then((results) => {
            const data = JSON.parse(results)
            data[deck] = undefined
            delete data[deck]
            AsyncStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(data))
        })
}

