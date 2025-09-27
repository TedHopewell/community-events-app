import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Image,Dimensions,  } from 'react-native';

// import google from "./assets/google.png";
// import { StatusBar } from 'expo-status-bar';

export default function Signup() {
  return (
    <View style={styles.container}>
            <Text style={styles.loginText}>Welcome Back</Text>
            <TextInput style={styles.inputBox} placeholder='Username here...'></TextInput>
            <TextInput style={styles.inputBox} placeholder='Password here...'></TextInput>
            <TouchableOpacity style={styles.loginBtn} >
                    <Text style={{fontSize:20,fontWeight:'800'}}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtnGoogle} >
                    <Image  style={{width:20,height:20}} />
                    <Text style={{fontSize:20,fontWeight:'800',paddingRight:20}}>Sign In</Text>
            </TouchableOpacity>
            <View style={styles.hyperLinksContainer}>
              <TouchableOpacity>
                <Text style={styles.hyperLink}>Create Account</Text>
                </TouchableOpacity>  
              <TouchableOpacity>
                <Text style={styles.hyperLink}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
    </View>
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
  logo:{
    flex:2,
    fontSize:90,
    backgroundColor:"#4b16ddff"
  },
  loginText:{
    color:'black',
    fontWeight:'bold',
    textAlign:'center',
    fontSize:30,
  },
  inputBox:{
    height:40,
    width:deviceWidth-50,
    marginTop:20,
    backgroundColor:'#dededeee',
    paddingHorizontal:20,
    borderRadius:6,
  },
  hyperLinksContainer:{
    width:deviceWidth-50,
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:20,
  },
  hyperLink:{
    textAlign:'center',
    color:'blue',
  },
  loginBtn:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'orange',
    height:35,
    width:deviceWidth-50,
    textAlign:'center',
    borderRadius:8,
    marginTop:20,
  },
  loginBtnGoogle:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'white',
    height:35,
    width:deviceWidth-50,
    textAlign:'center',
    borderRadius:8,
    marginTop:20,
  },

  
});
