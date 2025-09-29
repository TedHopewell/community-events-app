import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Image,Dimensions, KeyboardAvoidingView, } from 'react-native';

// import google from "./assets/google.png";
// import { StatusBar } from 'expo-status-bar';

export default function EventsScreen() {
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.topContainer}>
         <Text style={styles.Logopart}>E.</Text>
         <Text style={styles.welcometext}>Welcome back<span style={styles.name}>name</span></Text>
         <View style={styles.profilePic}>
          
         </View>
      </View>
      <View style={styles.middleContainer}>

      </View>
      <View style={styles.bottomContainer}>

      </View>
            
    </KeyboardAvoidingView>
  );
}

const deviceWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(192, 230, 204, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer:{
    flex:1,
  }
});
