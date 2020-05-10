import React, { Component } from "react";
import { danger } from "../utils/colors";
import { addCardToDeck } from "../utils/api";
import { styles } from "../utils/styles";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";

class AddCard extends Component {
  state = {
    question: "",
    answer: "",
    valid: true,
  };
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Add a new card",
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginBottom: 10 }}>
          <TextInput
            onChangeText={(question) => this.setState({ question })}
            placeholderTextColor={!this.state.valid ? danger : "#ddd"}
            style={[styles.input, !this.state.valid ? styles.errorInput : ""]}
            ref='question'
            placeholder='Enter a question'
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <TextInput
            onChangeText={(answer) => this.setState({ answer })}
            placeholderTextColor={!this.state.valid ? danger : "#ddd"}
            style={[styles.input, !this.state.valid ? styles.errorInput : ""]}
            ref='answer'
            placeholder='Enter the answer'
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <SubmitBtn onPress={this.addCard} />
        </View>
      </View>
    );
  }
  addCard = () => {
    if (this.state.question && this.state.answer) {
      addCardToDeck(this.props.navigation.state.params.title, this.state);
      Alert.alert(
        "Add Another?",
        "Would you like to add another deck?",
        [
          {
            text: "Yes",
            onPress: () => {
              this.refs["question"].setNativeProps({ text: "" });
              this.refs["answer"].setNativeProps({ text: "" });
              this.refs["question"].focus();
            },
          },
          {
            text: "No",
            onPress: () => {
              this.props.navigation.goBack();
              this.props.navigation.state.params.refresh();
            },
          },
        ],
        { cancelable: false }
      );
    } else this.setState({ valid: false });
  };
}

const SubmitBtn = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={
        Platform.OS === "ios" ? styles.iosSubmitBtn : styles.AndroidSubmitBtn
      }
      onPress={onPress}
    >
      <Text style={styles.submitBtnText}>Submit</Text>
    </TouchableOpacity>
  );
};

export default AddCard;
