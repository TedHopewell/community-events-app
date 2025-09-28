import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Image,Dimensions, KeyboardAvoidingView, } from 'react-native';
import LinearGradient from "react-native-linear-gradient";

// import google from "./assets/google.png";
// import { StatusBar } from 'expo-status-bar';

export default function Loginpage() {
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">



          <View style={styles.logoContainer}>
            <Text style={styles.welcometxt}>Welcome Back</Text>
              <Image></Image>
          </View>

          <View style={styles.loginbuttons}>
            <TouchableOpacity style={styles.loginbtn}>
              <Text style={styles.btnText}>SignIn</Text>
            </TouchableOpacity>
          </View>


            {/* <View style={styles.loginTextContainer}>
            </View>
            <View style={styles.inputContainer}>
                            <Text style={styles.loginText}>Welcome Back</Text>

              <TextInput style={styles.inputBox} placeholder='Username here...'></TextInput>
            <TextInput style={styles.inputBox} placeholder='Password here...'></TextInput>
            </View>
            <View style={styles.loginbuttons}>
              <TouchableOpacity style={styles.loginBtn} >
                      <Text style={{fontSize:20,fontWeight:'800'}}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.loginBtnGoogle} >
                      <Image  style={{width:20,height:20}} />
                      <Text style={{fontSize:20,fontWeight:'800',paddingRight:20}}>Sign In</Text>
              </TouchableOpacity>
            </View> */}
            {/* <View style={styles.hyperLinksContainer}>
              <TouchableOpacity>
                <Text style={styles.hyperLink}>Create Account</Text>
                </TouchableOpacity>  
              <TouchableOpacity>
                <Text style={styles.hyperLink}>Forgot Password?</Text>
              </TouchableOpacity>
            </View> */}
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
  logoContainer:{
    flex:3,
    backgroundColor:'#cd2d2dff',
    paddingTop:20
  },
  welcometxt:{
    color:'black',
    fontWeight:'bold',
    textAlign:'center',
    fontSize:30,
    paddingTop:30
  },
  loginbuttons:{
    flex:1,
    paddingVertical:30,
  },


  loginbtn:{
    justifyContent:'center',
    alignItems:"center",
    borderWidth:2,
    borderRadius:50,
    width:deviceWidth-150, 
  },
  btnText:{
    paddingHorizontal:20,
    paddingVertical:20
  }

});
//   loginTextContainer:{
//     flex:2
//   },
//     loginText:{
//     color:'black',
//     fontWeight:'bold',
//     textAlign:'center',
//     fontSize:30,
//     paddingTop:30
//   },
//   inputContainer:{
//     flex:4,
//     backgroundColor:'#b41515ff'
//   },
//   inputBox:{
  
//     height:40,
//     width:deviceWidth-50,
//     marginTop:20,
//     backgroundColor:'#dededeee',
//     paddingHorizontal:20,
//     borderBottomWidth:2
//   },
//   hyperLinksContainer:{
//     width:deviceWidth-50,
//     display:'flex',
//     flexDirection:'row',
//     justifyContent:'space-between',
//     marginTop:20,
//   },
//   hyperLink:{
//     textAlign:'center',
//     color:'blue',
//   },
//   loginBtn:{
//     justifyContent:'center',
//     alignItems:'center',
//     backgroundColor:'orange',
//     height:35,
//     width:deviceWidth-50,
//     textAlign:'center',
//     borderRadius:8,
//     marginTop:20,
//   },
//   loginBtnGoogle:{
//     flexDirection:'row',
//     alignItems:'center',
//     justifyContent:'center',
//     backgroundColor:'white',
//     height:35,
//     width:deviceWidth-50,
//     textAlign:'center',
//     borderRadius:8,
//     marginTop:20,
//   },
//   loginbuttons:{
//     flex:2
//   }

  
// 
