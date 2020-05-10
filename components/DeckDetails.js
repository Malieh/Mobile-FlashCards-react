import React, { Component } from "react";
import { connect } from "react-redux";
import { styles } from "../utils/styles";
import { fetchDeck } from "../utils/api";
import { getDeck } from "../actions";
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { primary } from "../utils/colors";

class DeckDetails extends Component {
  state = {
    loading: false,
  };
  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return {
      title: title,
    };
  };
  componentDidMount() {
    this.loadDeck();
  }
  loadDeck = () => {
    this.setState({ loading: true });
    fetchDeck(this.props.navigation.state.params.title).then((deck) => {
      this.props.dispatch(getDeck(deck));
      this.setState({ loading: false });
    });
  };
  deckView = (deck) => {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.headerText}>{deck.title}</Text>
          <Text style={styles.mutedText}>{deck.questions.length} cards</Text>
        </View>
        <View style={{ flex: 2, justifyContent: "flex-start" }}>
          <TouchableOpacity
            style={[
              Platform.OS === "ios" ? styles.iosSubmitBtn : styles.AndroidBtn,
              { marginBottom: 10 },
            ]}
            onPress={() => {
              this.props.navigation.navigate("AddCard", {
                title: deck.title,
                refresh: this.loadDeck,
              });
            }}
          >
            <Text style={styles.submitBtnText}>Add Card</Text>
          </TouchableOpacity>
          {deck.questions.length > 0 && (
            <TouchableOpacity
              style={
                Platform.OS === "ios" ? styles.iosSubmitBtn : styles.AndroidBtn
              }
              disabled={deck.questions.length === 0}
              onPress={() => {
                this.props.navigation.navigate("Quiz", { title: deck.title });
              }}
            >
              <Text style={styles.submitBtnText}>Start Quiz</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={this.state.loading} color={primary} />
        {this.deckView(this.propsdeck)}
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    deck: state.deck,
  };
};

export default connect(mapStateToProps)(DeckDetails);
