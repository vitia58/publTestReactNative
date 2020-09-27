import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Dimensions,
} from 'react-native';

export function CommentWidget({route, navigation}) {
  navigation.setOptions({
    title: 'Adding comment',
    headerTitleStyle: {alignSelf: 'center', paddingRight: 50},
    headerStyle: {backgroundColor: 'dodgerblue'},
    headerTintColor: 'white',
  });
  const [fio, setFio] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [isFioCorrect, setFioCorrect] = useState(false);
  const [isEmailCorrect, setEmailCorrect] = useState(false);
  const [isCommentCorrect, setCommentCorrect] = useState(false);
  const [isSending, setSending] = useState(false);
  const {article, port, onGoBack} = route.params;
  const width = Math.round(Dimensions.get('window').width);
  const stylestext = StyleSheet.create({
    Text: {
      flex: width < 1000 ? 1.6 : width < 2000 ? 1.4 : 1,
      fontSize: width < 1000 ? 14 : width < 2000 ? 18 : 22,
      color: '#08F',
      textAlignVertical: 'center',
      textAlign: 'right',
      marginHorizontal: width < 2000 ? 0 : 5,
    },
    FieldIncorrect: {
      fontSize: width < 1000 ? 14 : width < 2000 ? 18 : 22,
      flex: 5,
      borderColor: 'red',
      color: '#004',
      borderRadius: 5,
      borderWidth: 1,
      marginLeft: 5,
      maxHeight: 160,
    },
    FieldCorrect: {
      fontSize: width < 1000 ? 14 : width < 2000 ? 18 : 22,
      flex: 5,
      borderColor: 'limegreen',
      color: '#004',
      borderRadius: 5,
      borderWidth: 1,
      marginLeft: 5,
      maxHeight: 160,
    },
  });
  return (
    <View style={styles.mainView}>
      <View style={styles.cardLine}>
        <View style={styles.Row}>
          <Text style={stylestext.Text}>ФИО</Text>
          <TextInput
            style={
              isFioCorrect ? stylestext.FieldCorrect : stylestext.FieldIncorrect
            }
            placeholder="ФИО"
            onChangeText={(text) => {
              setFio(text);
              const sp = text.split(' ');
              if (
                text.length > 5 &&
                text.length < 50 &&
                sp.length > 2 &&
                sp[0].length > 2 &&
                sp[1].length > 2 &&
                sp[2].length > 2
              ) {
                setFioCorrect(true);
              } else {
                setFioCorrect(false);
              }
            }}
          />
        </View>
        <View style={styles.Row}>
          <Text style={stylestext.Text}>Email</Text>
          <TextInput
            style={
              isEmailCorrect
                ? stylestext.FieldCorrect
                : stylestext.FieldIncorrect
            }
            placeholder="Email"
            onChangeText={(text) => {
              if (text.length < 50) {
                setEmail(text);
              }
              const sp = text.split('@');
              if (
                text.length > 5 &&
                text.length < 50 &&
                sp.length === 2 &&
                sp[0].length > 3 &&
                sp[1].length > 3
              ) {
                setEmailCorrect(true);
              } else {
                setEmailCorrect(false);
              }
            }}
          />
        </View>
        <View style={styles.Row}>
          <Text style={stylestext.Text}>Comment</Text>
          <TextInput
            multiline={true}
            style={
              isCommentCorrect
                ? stylestext.FieldCorrect
                : stylestext.FieldIncorrect
            }
            placeholder="Коментарий"
            onChangeText={(text) => {
              if (text.length < 150) {
                setComment(text);
              }
              if (text.length > 4 && text.length < 150) {
                setCommentCorrect(true);
              } else {
                setCommentCorrect(false);
              }
            }}
          />
        </View>
      </View>
      <View
        style={styles.sendDiv}
        opacity={
          isFioCorrect && isEmailCorrect && isCommentCorrect && !isSending
            ? 1
            : 0
        }>
        <View
          style={styles.send}
          onStartShouldSetResponder={() => {
            if (isFioCorrect && isEmailCorrect && isCommentCorrect) {
              setSending(true);
              addComment(article, fio, comment, email, navigation, port);
              onGoBack();
              navigation.goBack();
            }
          }}>
          <Image
            style={styles.sendImage}
            source={require('../icons/send.png')}
          />
        </View>
      </View>
    </View>
  );
}

function addComment(article, fio, comment, email, navigation, port) {
  const init = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: article,
      fio: fio,
      email: email,
      comment: comment,
    }),
  };
  //fetch('http://93.79.41.156:3000/comment', init);
  fetch('http://93.79.41.156:' + port + '/comment', init).catch(() =>
    fetch(
      'http://93.79.41.156:' + port === 3000 ? 3200 : 3000 + '/comment',
      init,
    ),
  );
}
const styles = StyleSheet.create({
  sendDiv: {
    alignItems: 'flex-end',
    margin: 20,
  },
  send: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#08F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendImage: {
    width: 40,
    height: 40,
  },
  cardLine: {
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderColor: '#08F',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  Row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  mainView: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    flex: 1,
  },
});
