import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  sendPasswordResetEmail,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { auth } from "./config/firebaseConfig";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "./navigation/types";
import themecolors from "../themes/themecolors";

WebBrowser.maybeCompleteAuthSession();

export default function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
  });

  useEffect(() => {
  if (response?.type === "success") {
    const { id_token } = response.params; // Firebase needs id_token
    const credential = GoogleAuthProvider.credential(id_token);
    signInWithCredential(auth, credential)
      .then(() => {
        Alert.alert("Success", "Signed in with Google!");
        navigation.navigate("Homepage");
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", "Google Sign-In failed.");
      });
  }
}, [response]);


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
      Alert.alert("Error", "Failed to send reset email.");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      navigation.navigate("Homepage");
      Alert.alert("Success", `Welcome back, ${user.email}!`);
    } catch (error) {
      console.error(error);
      Alert.alert("Login failed", "Email or password incorrect.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Google Sign-In failed.");
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/pictures/mainbg.png")}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.card}>
            <Text style={styles.welcometxt}>Welcome Back 👋</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <View style={styles.inputBox}>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
                keyboardType="email-address"
                placeholderTextColor="#aaa"
              />

              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#aaa"
              />

              <TouchableOpacity onPress={handlePasswordReset}>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginbtn} onPress={handleLogin}>
              <Text style={styles.btnText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginbtn, styles.googleBtn]}
              onPress={handleGoogleSignIn}
            >
              <Image
                source={require("../assets/pictures/googlelogo.png")}
                style={styles.googleicon}
              />
              <Text style={[styles.btnText, { color: "#000" }]}>
                Sign in with Google
              </Text>
            </TouchableOpacity>

            <Text style={styles.signupText}>
              Don’t have an account?{" "}
              <Text
                style={styles.signupLink}
                onPress={() => navigation.navigate("Signup")}
              >
                Sign up here
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themecolors.primary,
  },
  card: {
    width: width * 0.85,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  welcometxt: {
    fontSize: 28,
    fontWeight: "bold",
    color: themecolors.primaryDark,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: themecolors.text2,
    marginBottom: 30,
    textAlign: "center",
  },
  inputBox: {
    width: "100%",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#333",
  },
  forgotPassword: {
    textAlign: "right",
    color: themecolors.accent,
    fontWeight: "500",
    marginBottom: 15,
  },
  loginbtn: {
    width: "100%",
    backgroundColor: themecolors.accent,
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  googleBtn: {
    flexDirection: "row",
    backgroundColor: "white",
    borderColor: "#ddd",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  googleicon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  signupText: {
    marginTop: 20,
    color: themecolors.text2,
    textAlign: "center",
  },
  signupLink: {
    color: themecolors.accent,
    fontWeight: "bold",
  },
});
