import React, { Component } from 'react';
import {
    Animated,
    Easing,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    Alert
} from 'react-native';
import { connect } from 'react-redux'
import { primary, white, success, danger } from '../utils/colors'
import { getDeck } from '../actions'
import { fetchDeck } from '../utils/api'
import { styles } from '../utils/styles'
import { loadDeck } from '../utils/dispatches'
import {
    clearLocalNotifications,
    setLocalNotification
} from '../utils/helpers'

class Quiz extends Component {
    state = {
        showAnswer: false,
        correct: 0,
        index: 0,
        animate: new Animated.Value(0)
    }

    /**
     * @description set the title of the back bar
     */
    static navigationOptions = ({ navigation }) => {
        const { title } = navigation.state.params
        return {
            title: `${title} Quiz`
        }
    }

    /**
     * @description things to do once the component mounts, like loading the selected deck for the quiz
     */
    componentDidMount() {
        loadDeck(this.props.navigation.state.params.title, this.props.dispatch)
    }

    /**
     * @description handles moving to the "next" questions, if the state.index is not at the end, it moves to the next item in the array.
     * Otherwise, it clears notifications and sets another one for the next day since a quiz is now complete.  It alerts the user to their score and asks them if they want to try again or not.
     */
    nextQuestion = () => {
        const { questions } = this.props.deck
        if(this.state.index < questions.length - 1) {
            this.setState({ index: this.state.index + 1 })
        }
        else {

            clearLocalNotifications()
                .then(setLocalNotification)

            Alert.alert(
                'Score: ' + Math.round((this.state.correct/questions.length)*100) + '%',
                `You correctly answered ${this.state.correct} out of ${questions.length} questions.  Would you like to try again?`,
                [
                    { text: 'Yes', onPress: () => {
                        this.setState({ correct: 0, index: 0, showAnswer: false })
                    }},
                    { text: 'No',
                    onPress: () => {
                        this.props.navigation.goBack()
                    }},
                ],
                { cancelable: false }
            )
        }
    }

    /**
     * @description show "Correct" and "Incorrect" buttons for the quiz
     */
    showQuizButtons = (questions) => {
        const { correct } = this.state
        return (
            <View style={{flex: 1}}>
                <TouchableOpacity
                    style={[(Platform.OS === 'ios') ? styles.iosSubmitBtn : styles.AndroidBtn, { marginBottom: 10, backgroundColor: success }]}
                    onPress={() => {
                        this.setState(
                            {
                                correct: correct + 1
                            },
                            this.nextQuestion
                        )
                    }} >
                    <Text style={styles.submitBtnText}>Correct</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[(Platform.OS === 'ios') ? styles.iosSubmitBtn : styles.AndroidBtn, { backgroundColor: danger }]}
                    onPress={() => {
                        this.nextQuestion()
                    }} >
                    <Text style={styles.submitBtnText}>Incorrect</Text>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * @description show the answer to the question with a link back to the question
     */
    showAnswer = (questions) => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.headerText}>{questions[this.state.index].answer}</Text>
                <View style={{ padding: 20 }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.flipCard()
                        }} >
                        <Text style={{color: danger, fontWeight: '600'}}>Show Question</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    /**
     * @description default, show the question with a link to the answer
     */
    showQuestion = (questions) => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.headerText}>{questions[this.state.index].question}</Text>
                <View style={{ padding: 20 }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.flipCard()
                        }}>
                        <Text style={{color: danger, fontWeight: '600'}}>Show Answer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    /**
     * @description add some pizzaz, flip the card when the questions changes to an answer or vice versa
     */
    flipCard = () => {
        Animated.timing(
            this.state.animate,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(() => {
            this.setState({
                showAnswer: !this.state.showAnswer,
                animate: new Animated.Value(0)
            })
        })
    }

    /**
     * @description render the content of the component
     */
    render() {
        const { questions } = this.props.deck

        const rotateX = this.state.animate.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['0deg', '180deg', '0deg']
        })

        return (
            <View style={styles.container}>
                <View>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{this.state.correct}/{questions.length}</Text>
                </View>
                <Animated.View style={{ flex: 1, transform: [{rotateX}] }}>
                    {(this.state.showAnswer) ? this.showAnswer(questions) : this.showQuestion(questions)}
                </Animated.View>
                {this.showQuizButtons(questions)}
            </View>
        )
    }

}

/**
 * @description map the state to props, specifically deck
 * @param { object } state
 */
function mapStateToProps(state) {
    return {
        deck: state.deck
    }
}

export default connect(mapStateToProps)(Quiz)