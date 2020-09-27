import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {getData} from './Connection.js';
let loaded = false;
export function Articles({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [port, setPort] = useState(3200);
  const [lastClick, setLastClick] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    getData(port, 'listarts', setData, setLoading, setPort);
    setRefreshing(false);
  }, [refreshing, port, setPort]);
  navigation.setOptions({
    title: 'News',
    headerTitleStyle: {alignSelf: 'center'},
    headerStyle: {backgroundColor: 'dodgerblue'},
    headerTintColor: 'white',
  });
  if (!loaded) {
    onRefresh();
    loaded = true;
  }
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView
          style={{height: '100%'}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <FlatList
            data={data}
            keyExtractor={({id}) => id}
            renderItem={({item}) => (
              <View
                style={styles.card}
                onTouchStart={() => setLastClick(Date.now())}
                onTouchEnd={() => {
                  if (lastClick + 450 > Date.now()) {
                    navigation.navigate('Article', {
                      article: item.id,
                      name: item.name,
                      text: item.text,
                      port2: port,
                      reloadRandom: Date.now(),
                    });
                  }
                }}>
                <View flex={1}>
                  <Text style={styles.articleTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.articlePreload} numberOfLines={1}>
                    {item.text}
                  </Text>
                </View>
                <View style={{justifyContent: 'center'}}>
                  <Image
                    style={styles.cardIcon}
                    source={require('../icons/next.png')}
                  />
                </View>
              </View>
            )}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderColor: '#000',
    borderWidth: 0.5,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  cardIcon: {
    width: 25,
    height: 25,
    //justifyContent: 'center',
  },
  articleTitle: {
    fontSize: 24,
  },
  articlePreload: {
    fontSize: 16,
    marginRight: 25,
  },
});
