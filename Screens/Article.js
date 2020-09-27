import React, {useEffect, useState} from 'react';
import {
  RefreshControl,
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
} from 'react-native';
import {getData} from './Connection.js';

let articleRandom = 0;
export function Article({route, navigation}) {
  const [LoadingArticle, setLoadingArticle] = useState(true);
  const [ArticleText, setArticle] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [comments, setComment] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const {article, name, text, port2, reloadRandom} = route.params;
  const [port, setPort] = useState(port2);
  navigation.setOptions({
    title: name,
    headerTitleStyle: {alignSelf: 'center', paddingRight: 50},
    headerStyle: {backgroundColor: 'dodgerblue'},
    headerTintColor: 'white',
  });
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    getData(
      port,
      'article?id=' + article,
      setArticle,
      setLoadingArticle,
      setPort,
    );
    getData(
      port,
      'comments?id=' + article,
      setComment,
      setLoadingComments,
      setPort,
    );
    setRefreshing(false);
  }, [refreshing, article, port, setPort]);
  if (reloadRandom !== articleRandom) {
    onRefresh();
    articleRandom = reloadRandom;
  }
  return (
    <View>
      {LoadingArticle || loadingComments ? (
        body(text)
      ) : (
        <FlatList
          data={ArticleText}
          keyExtractor={({id}) => id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item}) => {
            navigation.setOptions({
              title: item.name,
              headerTitleStyle: {alignSelf: 'center', paddingRight: 50},
            });
            return (
              <View>
                {body(item.text)}
                {getComments(comments, navigation, article, port, onRefresh)}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
function body(text) {
  return (
    <View>
      <View>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}
let lastClick = 0;
function getComments(comments, navigation, article, port, onRefresh) {
  return (
    <View>
      <Text style={styles.commentsTitle}>Коментарии: </Text>
      <View
        style={styles.cardLine}
        onTouchStart={() => {
          lastClick = Date.now();
        }}
        onTouchEnd={() => {
          if (lastClick + 200 > Date.now()) {
            navigation.navigate('Comment', {
              article: article,
              port: port,
              onGoBack: () => onRefresh(),
            });
          }
        }}>
        <View style={styles.image}>
          <Image
            style={styles.cardIcon}
            source={require('../icons/comment.png')}
          />
          <Text style={styles.newCommentText}>Оставить свой</Text>
        </View>
      </View>
      <FlatList
        data={comments}
        keyExtractor={({id}) => id}
        renderItem={({item}) => (
          <View style={styles.cardLine}>
            <View style={styles.card}>
              <Text>{item.name}</Text>
              <Text>{item.time}</Text>
            </View>
            <Text>{item.comment}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    textAlign: 'justify',
    padding: 25,
  },
  newCommentText: {
    fontSize: 22,
    justifyContent: 'center',
  },
  cardLine: {
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderColor: '#000',
    borderWidth: 0.5,
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
  image: {
    flexDirection: 'row',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 30,
    //justifyContent: 'center',
  },
  commentsTitle: {
    fontSize: 26,
    textAlign: 'center',
  },
});
