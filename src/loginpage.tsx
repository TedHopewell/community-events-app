import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./config/firebaseConfig";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "./navigation/types"; // adjust path



export default function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();


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
      Alert.alert("Login failed");
      console.log(error);
      
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.loginContainer}>
        <Text style={styles.welcometxt}>Welcome Back</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.logindetails}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.logindetails}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.hyperlink}>
            <Text>Don't have an account yet?</Text><Text>Sign up here...</Text>
          </View>
        </View>
        
      </View>
      

      <View style={styles.loginbuttons}>
        <TouchableOpacity style={styles.loginbtn} onPress={handleLogin}>
          <Text style={styles.btnText}>SignIn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginbtn} onPress={handleLogin}>
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
    backgroundColor: "rgba(192, 230, 204, 0.6)",
    alignItems: "center",
    justifyContent: "center",
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
    paddingVertical: 20,
    
  },
  logindetails: {
    borderBottomWidth: 1,
    padding: 10,
    backgroundColor: "white",
    marginTop: 20,
  },
  hyperlink:{
    flexDirection:'row',
    gap:2,
  },
  loginbuttons: {
    flex: 1,
    paddingVertical: 30,
  },
  loginbtn: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 50,
    width: deviceWidth - 150,
  },
  btnText: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
