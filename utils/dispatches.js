import React from 'react'
import { getDecks, getDeck } from '../actions'
import { fetchAllDecks, fetchDeck } from '../utils/api'

/**
 * @description load all decks from storage
 * @param { object } dispatch
 */
export function loadDecks (dispatch) {
    fetchAllDecks()
        .then((decks) => {
            dispatch(getDecks(decks))
        })

}

/**
 * @description take the deck title and load the chosen deck
 * @param { string } title
 * @param { object } dispatch
 */
export function loadDeck (title, dispatch) {
    fetchDeck(title)
        .then((deck) => {
            dispatch(getDeck(deck))
        })
}