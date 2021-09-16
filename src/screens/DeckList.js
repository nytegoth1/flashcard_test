import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { Avatar, Card, Divider, Colors, FAB } from "react-native-paper";
import Main from "../components/Main";
import { connect } from "react-redux";
import { theme } from "../utils/theme";


class DeckList extends React.Component {
  state = {
    decks: null
  };

  onButtonPress() {
    this.props.navigation.navigate("Details");
  }

  onDeckAdd() {
    this.props.navigation.navigate("DeckAdd");
  }

  onDeckCardPress(deck) {
    this.props.navigation.navigate("DeckSingle", {
      deckId: deck.id,
      title: deck.title,
      navigation: this.props.navigation
    });
  }
  render() {
    const { decks } = this.props;
    return (
      <Main style={styles.main}>
        <View style={styles.logo}>
                <Image style={{width: 180, height: 180}}
        resizeMode={'cover'} source={require('../../assets/icon.png')}
      />
      </View>
        <ScrollView>
          {decks &&
            Object.keys(decks).map(id => (
              <TouchableOpacity
                key={id}
                onPress={() => this.onDeckCardPress(decks[id])}
              >
                <Card.Title
                  title={decks[id].title}
                  left={props => (
                    <Avatar.Icon
                      {...props}
                      style={styles.avatarIcon}
                      icon="folder-text"
                      color={Colors.white}
                    />
                  )}
                  right={props => (
                    <Avatar.Text
                      size={24}
                      style={styles.avatarText}
                      label={decks[id].questions.length}
                    />
                  )}
                />
                <Divider />
              </TouchableOpacity>
            ))}
        </ScrollView>
        <FAB style={styles.fab} icon="plus-box" onPress={() => this.onDeckAdd()} />
      </Main>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00c0ff"
  },
  main: {
    backgroundColor: "#00c0ff"
  },
  logo: {
    flexDirection: "row",
    marginHorizontal: 0,
    marginTop: -9,
    marginBottom: 12,
    justifyContent: "center",
    borderBottomColor: theme.colors.primary,
    borderWidth: 1,
    backgroundColor: "#00c0ff",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "500"
  },
  avatarIcon: {
    backgroundColor: "#003d82"
  },
  avatarText: {
    marginRight: 16,
    backgroundColor: "#003d82"
  }
});

function mapStateToProps({ decks }) {
  return {
    decks
  };
}

export default connect(mapStateToProps)(DeckList);
