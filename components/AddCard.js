import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    Alert
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { primary, white, danger } from '../utils/colors'
import { addDeck } from '../actions'
import { addCardToDeck } from '../utils/api'
import { styles } from '../utils/styles'

class AddCard extends Component {
    state = {
        question: '',
        answer: '',
        valid: true
    }

    /**
     * @description set nav title
     */
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Add a new card'
        }
    }

    /**
     * render Q/A form components
     */
    render() {
        return (
            <View style={styles.container}>
                <View style={{ marginBottom: 10 }}>
                    <TextInput
                        style={[styles.input, (!this.state.valid) ? styles.errorInput : '']}
                        ref="question"
                        onChangeText={(question) => this.setState({question})}
                        placeholderTextColor={(!this.state.valid) ? danger : '#ddd'}
                        placeholder="Enter a question" />
                </View>
                <View style={{ marginBottom: 10 }}>
                    <TextInput
                        style={[styles.input, (!this.state.valid) ? styles.errorInput : '']}
                        ref="answer"
                        onChangeText={(answer) => this.setState({answer})}
                        placeholderTextColor={(!this.state.valid) ? danger : '#ddd'}
                        placeholder="Enter the answer" />
                </View>
                <View style={{ marginTop: 10 }}>
                    <SubmitBtn onPress={this.addCard} />
                </View>
            </View>
        )
    }

    /**
     * @description save question and answer entered to the appropriate deck, then prompt user to add another
     */
    addCard = () => {
        if(this.state.question && this.state.answer) {
            addCardToDeck(this.props.navigation.state.params.title, this.state)
            Alert.alert(
                'Add Another?',
                'Would you like to add another deck?',
                [
                    { text: 'Yes',
                    onPress: () => {
                        this.refs['question'].setNativeProps({text: ''});
                        this.refs['answer'].setNativeProps({text: ''});
                        this.refs['question'].focus();
                    }},
                    { text: 'No', onPress: () => {
                        this.props.navigation.goBack()
                        this.props.navigation.state.params.refresh()
                    }}
                ],
                { cancelable: false }
            )
        }
        else
            this.setState({ valid: false })

    }
}

/**
 * @description render submit button
 * @param { function } onPress
 */
function SubmitBtn({ onPress }) {
    return (
        <TouchableOpacity
            style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.AndroidSubmitBtn}
            onPress={onPress}>
            <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
    )
}

export default AddCard