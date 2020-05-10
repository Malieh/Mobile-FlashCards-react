import React, { Component } from "react";

import { connect } from "react-redux";
import { success, danger } from "../utils/colors";
import {
  clearLocalNotifications,
  setLocalNotification,
} from "../utils/helpers";
import { styles } from "../utils/styles";
import { loadDeck } from "../utils/dispatches";
import {
  Animated,
  Easing,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";

class Quiz extends Component {
  state = {
    correct: 0,
    index: 0,
    showAnswer: false,
    animate: new Animated.Value(0),
  };

  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return {
      title: `${title} Quiz`,
    };
  };

  nextQuestion = () => {
    const { questions } = this.props.deck;
    if (this.state.index < questions.length - 1) {
      this.setState({ index: this.state.index + 1 });
    } else {
      clearLocalNotifications().then(setLocalNotification);

      Alert.alert(
        "Score: " +
          Math.round((this.state.correct / questions.length) * 100) +
          "%",
        `You correctly answered ${this.state.correct} out of ${questions.length} questions.  Would you like to try again?`,
        [
          {
            text: "Yes",
            onPress: () => {
              this.setState({ correct: 0, index: 0, showAnswer: false });
            },
          },
          {
            text: "No",
            onPress: () => {
              this.props.navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  componentDidMount() {
    loadDeck(this.props.navigation.state.params.title, this.props.dispatch);
  }

  showAnswer = (questions) => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.headerText}>
          {questions[this.state.index].answer}
        </Text>
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            onPress={() => {
              this.flipCard();
            }}
          >
            <Text style={{ color: danger, fontWeight: "600" }}>
              Show Question
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  showQuizButtons = (questions) => {
    const { correct } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={[
            Platform.OS === "ios" ? styles.iosSubmitBtn : styles.AndroidBtn,
            { marginBottom: 10, backgroundColor: success },
          ]}
          onPress={() => {
            this.setState(
              {
                correct: correct + 1,
              },
              this.nextQuestion
            );
          }}
        >
          <Text style={styles.submitBtnText}>Correct</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            Platform.OS === "ios" ? styles.iosSubmitBtn : styles.AndroidBtn,
            { backgroundColor: danger },
          ]}
          onPress={() => {
            this.nextQuestion();
          }}
        >
          <Text style={styles.submitBtnText}>Incorrect</Text>
        </TouchableOpacity>
      </View>
    );
  };

  flipCard = () => {
    Animated.timing(this.state.animate, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
    }).start(() => {
      this.setState({
        showAnswer: !this.state.showAnswer,
        animate: new Animated.Value(0),
      });
    });
  };

  showQuestion = (questions) => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.headerText}>
          {questions[this.state.index].question}
        </Text>
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            onPress={() => {
              this.flipCard();
            }}
          >
            <Text style={{ color: danger, fontWeight: "600" }}>
              Show Answer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const rotateX = this.state.animate.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ["0deg", "180deg", "0deg"],
    });

    return (
      <View style={styles.container}>
        <View>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            {this.state.correct}/{this.props.deck.questions.length}
          </Text>
        </View>
        <Animated.View style={{ flex: 1, transform: [{ rotateX }] }}>
          {this.state.showAnswer
            ? this.showAnswer(this.props.deck.questions)
            : this.showQuestion(this.props.deck.questions)}
        </Animated.View>
        {this.showQuizButtons(this.props.deck.questions)}
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    deck: state.deck,
  };
};

export default connect(mapStateToProps)(Quiz);
