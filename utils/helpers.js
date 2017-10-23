import React from 'react'
import { AsyncStorage } from 'react-native'
import { Notifications, Permissions } from 'expo'

/**
 * @description storage keys
 */
export const DECK_STORAGE_KEY = 'MobileFlashCards:decks'
const NOTIFICATION_KEY = 'MobileFlashCards:notifications'

/**
 * @description clear local notification
 */
export function clearLocalNotifications () {
    return AsyncStorage.removeItem(NOTIFICATION_KEY)
        .then(Notifications.cancelAllScheduledNotificationsAsync)
}

/**
 * @description create a new local notification
 */
export function createNotification () {
    return {
        title: 'Take a quiz!',
        body: "🤓 Don't forget to complete a quiz today!",
        ios: {
            sound: true,

        },
        android: {
            sound: true,
            priority: 'high',
            sticky: false,
            vibrate: true,
        }
    }
}

/**
 * @description check for an existing notification and if one does not exist, create a new one
 */
export function setLocalNotification() {
    AsyncStorage.getItem(NOTIFICATION_KEY)
        .then(JSON.parse)
        .then((data) => {
            if(data === null) {
                Permissions.askAsync(Permissions.NOTIFICATIONS)
                    .then(({ status }) => {
                        if (status === 'granted') {
                            Notifications.cancelAllScheduledNotificationsAsync()
                            let tomorrow = new Date()
                            tomorrow.setDate(tomorrow.getDate() + 1)
                            tomorrow.setHours(19)
                            tomorrow.setMinutes(0)

                            Notifications.scheduleLocalNotificationAsync(
                                createNotification(),
                                {
                                    time: tomorrow,
                                    repeat: 'day',
                                }
                            )

                            AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true))
                        }
                    })
            }
        })
}