import * as React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Loginpage from './src/loginpage';
import Signup from './src/signup';
import EventsScreen from './src/events';
import CreateEventScreen from './src/createevent';
import ProfileScreen from './src/profile';
import RSVPEventsScreen from './src/rsvpEventscreen';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Homepage" component={EventsScreen}/>
        <Stack.Screen name="Profilepage" component={ProfileScreen}/>
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        <Stack.Screen name="Login" component={Loginpage} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="RSVP" component={RSVPEventsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}