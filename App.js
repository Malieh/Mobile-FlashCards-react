import React from 'react';
import {
  View,
  Platform,
  StatusBar
} from 'react-native';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { TabNavigator, StackNavigator } from 'react-navigation'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { primary, white } from './utils/colors'
import { Constants } from 'expo'
import { decks} from './reducers'
import AddDeck from './components/AddDeck'
import Decks from './components/Decks'
import DeckDetails from './components/DeckDetails'
import AddCard from './components/AddCard'
import Quiz from './components/Quiz'
import { setLocalNotification } from './utils/helpers'

/**
 * @description set up the status bar
 * @param { string } backgroundColor
 * @param { object } props
 */
function AppStatusBar ({ backgroundColor, ...props}) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

/**
 * @description setup tab navigation between the deck list view and the add deck view
 */
const Tabs = TabNavigator({
  Decks: {
    screen: Decks,
    navigationOptions: {
      tabBarLabel: 'Decks',
      tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name='cards' size={25} color={tintColor} />
    }
  },
  AddDeck: {
    screen: AddDeck,
    navigationOptions: {
      tabBarLabel: 'Add New Deck',
      tabBarIcon: ({ tintColor }) => <Ionicons name='ios-add' size={25} color={tintColor} />
    }
  }
}, {
  navigationOptions: {
    header: null
  },
  animationEnabled: true,
  lazy: true,
  tabBarOptions: {
    activeTintColor: Platform.OS === 'ios' ? primary : white,
    style: {
      height: 50,
      backgroundColor: Platform.OS === 'ios' ? white : primary,
      shadowColor: 'rgba(0, 0, 0, 0.24)',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
})

/**
 * @description set up the stack navigator to navigate from the deck list to deck details and from deck details to AddCard or Quiz
 */
const MainNav = StackNavigator({
  Home: {
    screen: Tabs
  },
  Deck: {
    screen: DeckDetails
  },
  AddCard: {
    screen: AddCard
  },
  Quiz: {
    screen: Quiz
  }
},
{
  navigationOptions: {
    headerStyle: {
      backgroundColor: primary,
    },
    headerTitleStyle: {
      color: white
    },
    headerTintColor: white,
  }
})

export default class App extends React.Component {

  componentDidMount() {
    setLocalNotification()
  }

  /**
   * @description render the app
   */
  render() {
    return (
      <Provider store={createStore(decks)}>
        <View style={{ flex: 1 }}>
          <AppStatusBar backgroundColor={primary} barStyle="light-content" />
          <MainNav  />
        </View>
      </Provider>
    )
  }
}