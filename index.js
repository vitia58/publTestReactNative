/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './Screens/Navigator';
//import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
