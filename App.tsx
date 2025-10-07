import * as React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Loginpage from './src/loginpage';
import Signup from './src/signup';
import EventsScreen from './src/events';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Homepage" screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Homepage" component={EventsScreen}/>
        <Stack.Screen name="Login" component={Loginpage} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}