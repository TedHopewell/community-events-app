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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth} from "./config/firebaseConfig";
import { useNavigation,NavigationProp  } from "@react-navigation/native";
import { RootStackParamList } from "./navigation/types"; // adjust path


export default function SignUp() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  

  console.log(auth)

  const handleSignUp = async () => {
    if (!email || !password || !name ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with full name
      await updateProfile(user, {
        displayName: `${name} ${surname}`,
      });

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login")

      console.log("User created:", user);
    } catch (error) {
      Alert.alert("Signup failed");
      console.log(error);
      
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.logoContainer}>
        <Text style={styles.welcometxt}>Sign up Here</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.logindetails}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
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
        </View>
      </View>

      <View style={styles.loginbuttons}>
        <TouchableOpacity style={styles.loginbtn} onPress={handleSignUp}>
          <Text style={styles.btnText}>Sign Up</Text>
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
  logoContainer: {
    flex: 3,
    paddingTop: 20,
    justifyContent: "space-between",
    width: deviceWidth - 80,
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
    fontWeight: "bold",
  },
});
