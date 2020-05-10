import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import sortBy from "sort-by";
import { styles } from "../utils/styles";
import { loadDecks } from "../utils/dispatches";
import { SearchBar } from "react-native-elements";
import { primary, white, action } from "../utils/colors";
class Decks extends Component {
  state = {
    refreshing: false,
    filter: "",
  };
  componentDidMount() {
    loadDecks(this.props.dispatch);
  }
  _renderItem = ({ item }) => {
    let size = new Animated.Value(0);
    const textSize = size.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [20, 25, 20],
    });

    return (
      <TouchableHighlight
        onPress={() => {
          Animated.timing(size, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
          }).start(() => {
            this.props.navigation.navigate("Deck", { title: item.title });
            size.setValue(0);
          });
        }}
        underlayColor='#eeeeee'
      >
        <View style={styles.listItem}>
          <View style={{ flex: 2, marginLeft: 20, alignItems: "flex-start" }}>
            <Animated.Text style={[styles.headerText, { fontSize: textSize }]}>
              {item.title}
            </Animated.Text>
            <Text style={styles.mutedText}>{item.questions.length} cards</Text>
          </View>
          <View
            style={{
              flex: 1,
              marginRight: 20,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <Text>
              <Ionicons name='ios-arrow-forward' color={primary} size={30} />
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  _renderSeparator = () => {
    return (
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: primary,
        }}
      />
    );
  };

  _keyExtractor = (item, index) => {
    return index;
  };

  _renderHeader = () => {
    const ph = "Type a deck name here...";
    const containerStyle = { backgroundColor: primary, borderColor: primary };
    const inputStyle = { backgroundColor: white };
    return Platform.OS === "ios" ? (
      <SearchBar
        placeholder={ph}
        containerStyle={containerStyle}
        inputStyle={inputStyle}
        onChangeText={this.searchText}
        round
      />
    ) : (
      <SearchBar
        placeholder={ph}
        containerStyle={containerStyle}
        inputStyle={inputStyle}
        onChangeText={this.searchText}
      />
    );
  };

  searchText = (text) => {
    this.setState({ filter: text });
  };

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        loadDecks(this.props.dispatch);
        this.setState({ refreshing: false });
      }
    );
  };

  render() {
    const { decks } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: white }}>
        {(decks !== null || decks !== undefined) && decks.length > 0 ? (
          <FlatList
            data={decks
              .filter(
                (deck) =>
                  ~deck.title
                    .toLowerCase()
                    .indexOf(this.state.filter.toLowerCase())
              )
              .sort(sortBy("title"))}
            style={{ flex: 1 }}
            renderItem={this._renderItem}
            ItemSeparatorComponent={this._renderSeparator}
            keyExtractor={this._keyExtractor}
            extraData={this.props}
            ListHeaderComponent={this._renderHeader}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        ) : (
          <View style={{ flex: 1, padding: 10, alignItems: "center" }}>
            <Text style={styles.headerText}>No Decks Found</Text>
            <Text style={styles.mutedText}>
              Please select the "Add New Deck" tab to continue.
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    decks: state.decks,
  };
};

export default connect(mapStateToProps)(Decks);
