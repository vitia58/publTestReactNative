import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Articles} from './Articles';
import {Article} from './Article';
import {CommentWidget} from './NewComment';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Articles">
        <Stack.Screen name="Articles" component={Articles} />
        <Stack.Screen name="Article" component={Article} />
        <Stack.Screen name="Comment" component={CommentWidget} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
