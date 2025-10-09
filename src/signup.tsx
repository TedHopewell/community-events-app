import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./config/firebaseConfig";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "./navigation/types";
import themecolors from "../themes/themecolors";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Homepage");
    } catch (error) {
      Alert.alert("Signup failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/pictures/bg4.jpg")}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, width: "100%" }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.welcometxt}>Create Your Account</Text>

            <View style={styles.inputBox}>
              <TextInput
                style={styles.logindetails}
                placeholder="Name"
                placeholderTextColor="#777"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.logindetails}
                placeholder="Email"
                placeholderTextColor="#777"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.logindetails}
                placeholder="Password"
                placeholderTextColor="#777"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <View style={styles.hyperlinkcontainer}>
                <Text style={styles.hyperlinkText}>
                  Already have an account?{" "}
                  <Text
                    style={styles.hyperlink}
                    onPress={() => navigation.navigate("Login")}
                  >
                    Login here
                  </Text>
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.loginbtn} onPress={handleSignUp} disabled={loading}>
              <Text style={styles.btnText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loader Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={themecolors.accent} />
        </View>
      )}
    </ImageBackground>
  );
}

const deviceWidth = Math.round(Dimensions.get("window").width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: deviceWidth - 80,
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  welcometxt: {
    color: themecolors.text2,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 28,
    marginBottom: 20,
  },
  inputBox: {
    width: "100%",
    alignItems: "center",
  },
  logindetails: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "white",
    marginTop: 15,
    fontSize: 16,
    color: themecolors.text2,
  },
  hyperlinkcontainer: {
    marginTop: 25,
  },
  hyperlinkText: {
    color: themecolors.text2,
    fontSize: 14,
  },
  hyperlink: {
    color: themecolors.accent,
    fontWeight: "600",
  },
  loginbtn: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    width: deviceWidth - 150,
    backgroundColor: themecolors.accent,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginTop: 30,
  },
  btnText: {
    paddingVertical: 15,
    fontWeight: "bold",
    color: themecolors.text2,
    fontSize: 18,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
