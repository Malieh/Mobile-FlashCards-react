import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
    Platform,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { getDeck } from '../actions'
import { primary } from '../utils/colors'
import { styles } from '../utils/styles'
import { fetchDeck } from '../utils/api'

class DeckDetails extends Component {

    /**
     * @description set navigation options
     * @param { object } navigation
     * @return set the nav bar title to the title of the deck
     */
    static navigationOptions = ({ navigation }) => {
        const { title } = navigation.state.params
        return {
            title: title
        }
    }

    /**
     * @description set the state
     */
    state = {
        loading: false
    }

    /**
     * @description when the component mounts we need to load a deck
     */
    componentDidMount() {
        this.loadDeck()
    }

    /**
     * @description get the deck title from the nav params and use it to load the deck
     */
    loadDeck = () => {
        this.setState({ loading: true })
        const { dispatch } = this.props
        fetchDeck(this.props.navigation.state.params.title)
            .then((deck) => {
                dispatch(getDeck(deck));
                this.setState({ loading: false })
            })
    }

    /**
     * @description render the deck deatils view
     * @param { object } deck title, questions array
     */
    deckView = (deck) => {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.largeHeaderText}>{deck.title}</Text>
                    <Text style={styles.largeMutedText}>{deck.questions.length} cards</Text>
                </View>
                <View style={{ flex: 2, justifyContent: 'flex-start' }}>
                        <TouchableOpacity
                            style={[(Platform.OS === 'ios') ? styles.iosSubmitBtn : styles.AndroidBtn, { marginBottom: 10 }]}
                            onPress={() => {
                            this.props.navigation.navigate('AddCard', { title: deck.title, refresh: this.loadDeck })
                            }} >
                            <Text style={styles.submitBtnText}>Add Card</Text>
                        </TouchableOpacity>
                        {deck.questions.length > 0 &&
                        <TouchableOpacity
                            style={(Platform.OS === 'ios') ? styles.iosSubmitBtn : styles.AndroidBtn}
                            disabled={deck.questions.length === 0}
                            onPress={() => {
                                this.props.navigation.navigate('Quiz', { title: deck.title })
                            }} >
                                <Text style={styles.submitBtnText}>Start Quiz</Text>
                        </TouchableOpacity>}
                </View>
            </View>
        )
    }

    /**
     * @description render the main view
     */
    render() {
        const { deck } = this.props
        return (
            <View style={styles.container}>
                <ActivityIndicator animating={this.state.loading} color={primary} />
                {this.deckView(deck)}
            </View>
        )
    }
}

/**
 * @description map state  to this.props
 * @param { object } state
 */
function mapStateToProps (state) {
    return {
        deck: state.deck
    }
}

export default connect(mapStateToProps)(DeckDetails)