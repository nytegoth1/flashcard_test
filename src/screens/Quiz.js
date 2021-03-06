import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { StyleSheet, View, TouchableOpacity, Animated, Image } from "react-native";
import { Colors, FAB, Text } from "react-native-paper";
import { Main, Button, TextHeader, Paragraph } from "../components";
import CardFlip from "react-native-card-flip";
import { connect } from "react-redux";
import { handleDeleteDeck } from "../store/actions/decks";
import { clearLocalNotification, setLocalNotification } from "../utils/helper";
import { theme } from "../utils/theme";

class Quiz extends React.Component {
  state = {
    cardRotated: true,
    questionIndex: 0,
    correctCount: 0,
    quizCompleted: false,
    viewedAnswer: 0,
    actionsDisabled: false,
    actionsFadeValue: new Animated.Value(1)
  };

  _handleActionsFade = () => {
    Animated.timing(this.state.actionsFadeValue, {
      toValue: 0.3,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  handleCardFlip() {
    if (!this.state.quizCompleted) {
      this.card.flip();
      if (!this.state.cardRotated) {
        this.setState({
          viewedAnswer: ++this.state.viewedAnswer
        });
      }
    }
  }

  handleMarkQuestion(isCorrect) {
    if (!this.state.quizCompleted) {
      const updatedQuestionIndex = this.state.questionIndex + 1;
      this.state.viewedAnswer === 0 && this.handleCardFlip();
      this._handleActionsFade();
      this.setState({
        actionsDisabled: false
      });

      setTimeout(
        function() {
          if (this.props.deck.questions.length != updatedQuestionIndex) {
            this.handleCardFlip();
            this._handleActionsFade();
          }
          setTimeout(
            function() {
              this.setState((state, props) => {
                return {
                  correctCount: isCorrect
                    ? ++state.correctCount
                    : state.correctCount,
                  questionIndex: updatedQuestionIndex,
                  quizCompleted:
                    props.deck.questions.length === updatedQuestionIndex,
                  viewedAnswer: 0,
                  actionsDisabled: false
                };
              });
            }.bind(this),
            400
          );
        }.bind(this),
        1000
      );
    } else {
      setupNotificaiton();
    }
  }

  render() {
    if (this.state.quizCompleted) {
      return this.renderQuizCompleted();
    } else {
      return this.renderQuiz();
    }
  }

  restartQuiz() {
    this.setState({
      cardRotated: false,
      correctCount: 0,
      questionIndex: 0,
      quizCompleted: false,
      viewedAnswer: 0
    });
    if (!this.state.cardRotated) {
      this.handleCardFlip();
    }
  }

  setupNotificaiton() {
    clearLocalNotification().then(setLocalNotification);
  }

  renderQuiz() {
    const { questions } = this.props.deck;
    const { questionIndex } = this.state;

    return (
      <Main>
        <View style={styles.cardContainer}>
          <CardFlip style={styles.cardFlip} ref={card => (this.card = card)}>
            <TouchableOpacity
              style={[styles.card, styles.card1]}
              activeOpacity={0.9}
              onPress={() => this.handleCardFlip()}
            >
            {/* <Image style={{width: 320, height: 320}} resizeMode={'contain'} source={questions[questionIndex].avatarURL}/> */}
      {/* <img style={{width: 180, height: 180}} className="leader-avatar" alt="user-avatar" src={questions[questionIndex].avatarURL} /> */}
              <Text style={[styles.label, styles.label1]}>
                {questions[questionIndex].question}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, styles.card2]}
              activeOpacity={0.9}
              onPress={() => this.handleCardFlip()}
            >
              <Text style={[styles.label, styles.label2]}>
                {questions[questionIndex].answer}
              </Text>
            </TouchableOpacity>
          </CardFlip>
          <Text style={styles.remainingQuestionText}>
            {this.props.deck.questions.length - questionIndex}{" "}
            {this.props.deck.questions.length - questionIndex > 1
              ? "questions "
              : "question "}
            remaining
          </Text>
        </View>
        <View style={styles.actionContainer}>
          <FAB
            style={[
              styles.fab,
              styles.fabCenter,
              this.state.actionsDisabled && {
                opacity: this.state.actionsFadeValue
              }
            ]}
            disabled={this.state.actionsDisabled}
            color={Colors.white}
            small
            icon="rotate-right"
            onPress={() => this.handleCardFlip()}
          />
          <FAB
            style={[
              styles.fab,
              styles.fabLeft,
              this.state.actionsDisabled && {
                opacity: this.state.actionsFadeValue
              }
            ]}
            disabled={this.state.actionsDisabled}
            color={theme.colors.primary}
            icon="close"
            onPress={() => this.handleMarkQuestion(false)}
          />
          <FAB
            style={[
              styles.fab,
              styles.fabRight,
              this.state.actionsDisabled && {
                opacity: this.state.actionsFadeValue
              }
            ]}
            disabled={this.state.actionsDisabled}
            color={Colors.green500}
            icon="check"
            onPress={() => this.handleMarkQuestion(true)}
          />
        </View>
      </Main>
    );
  }

  renderQuizCompleted() {
    return (
      <Main>
        <View style={styles.quizCompletedContainer}>
          <TextHeader style={styles.deckTitle}>Quiz Completed</TextHeader>
          <Paragraph style={styles.deckCardCount}>
            You have answered{" "}
            {(
              (this.state.correctCount / this.props.deck.questions.length) * 100
            )}
            % correct
          </Paragraph>
          <Button mode="contained" onPress={() => this.restartQuiz()}>
            Restart Quiz
          </Button>

          <Button
            mode="outlined"
            onPress={() => this.props.navigation.goBack()}
          >
            Back to Deck
          </Button>
        </View>
      </Main>
    );
  }
}

function mapStateToProps({ decks }, props) {
  const { deckId } = props.navigation.state.params;
  return {
    deck: decks[deckId]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteDeck: deckId => {
      dispatch(handleDeleteDeck(deckId));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Quiz);

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#4BB6F3"
  },

  imgContainer: {
    flexDirection: 'row'
},
image: {
    resizeMode: 'contain',
    flex: 1,
    aspectRatio: 1 // Your aspect ratio
},

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  animatedCardContainer: { flex: 1 },
  cardContainer: {
    flex: 4,
    alignItems: "center"
  },
  cardFlip: {
    flex: 1,
    height: hp("80%"),
    width: wp("80%") - 45,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10
  },
  actionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    flex: 1,
    borderRadius: 10,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 2,
      height: 1
    },
    shadowOpacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  card1: {
    backgroundColor: theme.colors.primary,
  },
  card2: {
    backgroundColor: theme.colors.secondary,
  },
  label: {
    textAlign: "center",
    fontSize: 24,
    padding: 20,
    fontFamily: "System"
  },
  label1: { color: theme.colors.blanco },
  label2: { color: theme.colors.blanco },
  fab: {
    position: "absolute",
    margin: 60,
    bottom: 0,
    zIndex: 9999,
    borderWidth: 5,
    borderRadius: 50,
    backgroundColor: theme.colors.blanco
  },
  fabCenter: {
    marginBottom: 50,
    borderWidth: 0,
    backgroundColor: theme.colors.secondary
  },
  fabLeft: {
    left: 0,
    marginBottom: 20,
    borderColor: theme.colors.error
  },
  fabRight: {
    right: 0,
    marginBottom: 20,
    borderColor: theme.colors.correct
  },
  quizCompletedContainer: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  remainingQuestionText: {
    fontSize: 16,
    paddingTop: 20,
    color: theme.colors.greytext,
  }
});
