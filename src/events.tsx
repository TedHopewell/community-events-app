import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Image,Dimensions, KeyboardAvoidingView, } from 'react-native';

// import google from "./assets/google.png";
// import { StatusBar } from 'expo-status-bar';

export default function EventsScreen() {
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
            
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
  }});
