import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,getAuth,signInWithCredential  } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";

import { auth } from "./config/firebaseConfig";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "./navigation/types"; // adjust path
import themecolors from "../themes/themecolors";



export default function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePasswordReset = async () => {
  if (!email) {
    Alert.alert("Missing Email", "Please enter your email first.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    Alert.alert(
      "Password Reset",
      "A password reset link has been sent to your email."
    );
  } catch (error) {
    console.error(error);
    Alert.alert("Error");
  }
};


// const [request, response, promptAsync] = Google.useAuthRequest({
//     expoClientId: "YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com",
//     webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
//     androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
//     iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
//   });
//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await promptAsync();
//       if (result.type === "success") {
//         const { id_token } = result.params;
//         const credential = GoogleAuthProvider.credential(id_token);
//         await signInWithCredential(auth, credential);
//         Alert.alert("Success", "Logged in with Google!");
//       } else {
//         Alert.alert("Cancelled", "Google sign in cancelled");
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Google Sign-In failed");
//     }
//   };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    console.log('here');
    
    try {
      console.log('in');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Logged in:", user.email);
      navigation.navigate("Homepage")
      Alert.alert("Success", `Welcome back, ${user.email}!`);
      
      
      

    } catch (error) {
      console.error(error);
      Alert.alert("Login failed, email or password incorrect. Please try again.");
      console.log(error);
      
    }
  };

 

  return (
    <KeyboardAvoidingView style={styles.container}  behavior="padding">
      <View style={styles.loginContainer}>
        <Text style={styles.welcometxt}>Welcome Back</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.logindetails}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.logindetails}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.hyperlink}>
            <Text style={styles.inputboxBottomText}>Don't have an account yet?<Text style={styles.signupHyperlink} onPress={() =>navigation.navigate("Signup")}>Sign up here...</Text></Text>
            <Text style={styles.inputboxBottomText}>Forfot Password?<Text style={styles.signupHyperlink} onPress={() => handlePasswordReset(email)}>Reset Password here...</Text></Text>
          </View>
        </View>
        
      </View>
      

      <View style={styles.loginbuttons}>
        <TouchableOpacity style={styles.loginbtn} onPress={handleLogin}>
          <Text style={styles.btnText}>SignIn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginbtn} onPress={handleLogin}>
          <Image
              source={require("../assets/pictures/googleIcon.png")}
              style={styles.googleicon}
            
            /> 
          
          <Text style={styles.btnText}>SignIn</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const deviceWidth = Math.round(Dimensions.get("window").width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: themecolors.primary,
    alignItems: "center",
    alignContent: "center",
  },
  loginContainer: {
    flex: 2,
    justifyContent: "space-between",
    width: deviceWidth - 80,
    paddingTop:50,
    // backgroundColor:'blue'
  },
  welcometxt: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 30,
    paddingTop: 30,
  },
  inputBox: {
    flexDirection: "column",
  },
  logindetails: {
    borderBottomWidth: 1,
    padding: 20,
    backgroundColor: "white",
    marginTop: 20,
    color:themecolors.text2
  },
  hyperlink:{
    flexDirection:'column',
    alignItems:'center',
    gap:5,
    top:5,
    paddingTop:10,
  },
  inputboxBottomText:{
        color:themecolors.text2

  },
  signupHyperlink:{
    color:themecolors.accent
  },
  
  loginbuttons: {
    flex: 1,
    paddingVertical: 28,
    flexDirection:'column',
    justifyContent:'space-evenly'
  },
  loginbtn: {
    flexDirection:'row',
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 50,
    width: deviceWidth - 150,
    padding:15,
    gap:5,
    top:20
  },
  googleicon:{
    width:30,
    height:30
  },
  btnText: {
    fontWeight:"800",
    color:themecolors.text2
  },
});
