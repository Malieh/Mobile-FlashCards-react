import React, { Component } from "react";
import { connect } from "react-redux";
import { styles } from "../utils/styles";
import { loadDecks } from "../utils/dispatches";
import { danger } from "../utils/colors";
import { saveDeckTitle } from "../utils/api";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
u;

class AddDeck extends Component {
  state = {
    title: "",
    valid: true,
  };
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <View style={[styles.center]}>
          <Text
            style={[
              styles.labelText,
              !this.state.valid ? styles.errorText : "",
            ]}
          >
            What is the name of your new deck?
          </Text>
        </View>
        <View>
          <TextInput
            ref='title'
            style={[styles.input, !this.state.valid ? styles.errorInput : ""]}
            value={this.state.title}
            onChangeText={(title) => this.setState({ title })}
            placeholderTextColor={!this.state.valid ? danger : "#333"}
            placeholder='Enter a deck title'
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <SubmitBtn onPress={this.newDeck} />
        </View>
      </KeyboardAvoidingView>
    );
  }
  newDeck = () => {
    if (this.state.title) {
      saveDeckTitle(this.state.title);
      this.refs["title"].setNativeProps({ text: "" });
      this.props.navigation.navigate("Deck", { title: this.state.title });
      this.setState({ valid: true, title: "" });
      loadDecks(this.props.dispatch);
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

const mapStateToProps = (state) => {
  return {
    decks: state.decks,
  };
};

export default connect(mapStateToProps)(AddDeck);
