import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions,ImageBackground,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {auth} from "./config/firebaseConfig";
import themecolors from '../themes/themecolors';
import { signOut } from "firebase/auth";



const { width } = Dimensions.get('window');

const Profilepage = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const imageSrc = { uri: user?.photoURL || 'https://via.placeholder.com/150' };

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Log Out",
        onPress: async () => {
          try {
            await signOut(auth);
            Alert.alert("Logged Out", "You have been signed out successfully.");
            navigation.navigate("Login" as never);
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong while logging out.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topView}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* Middle Section */}
      <View style={styles.midView}>
        <Image style={styles.profileImage} source={imageSrc} />
        <Text style={styles.welcomeText}>
          Welcome <Text style={styles.username}>{user?.displayName}</Text> 👋
        </Text>
        <Text style={styles.subtitle}>It’s good to have you back!</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{user?.email}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{user?.displayName}</Text>
        </View>

        <View style={styles.messageCard}>
          <Text style={styles.messageText}>
            Thank you <Text style={styles.highlight}>@{user?.displayName}</Text> for trusting us. 🎉
          </Text>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomView}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profilepage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  topView: {
    width: '100%',
    height: 100,
    backgroundColor:themecolors.accent,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 55,
    padding: 5,
  },
  backText: {
    fontSize: 24,
    color: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  midView: {
    flex: 1,
    alignItems: 'center',
    marginTop: -40,
  },
  profileImage: {
    height: 150,
    width: 150,
    borderRadius: 100,
    backgroundColor: '#eee',
    borderWidth: 3,
    borderColor: themecolors.accent,
  },
  welcomeText: {
    fontSize: 18,
    color: '#444',
    marginTop: 20,
  },
  username: {
    color: '#000',
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'grey',
    fontSize: 14,
    marginBottom: 20,
  },
  infoCard: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    padding: 15,
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  messageCard: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    padding: 15,
    marginTop: 20,
  },
  messageText: {
    textAlign: 'center',
    color: '#333',
  },
  highlight: {
    color: themecolors.accent,
    fontWeight: 'bold',
  },
  bottomView: {
    width: '100%',
    alignItems: 'center',
    bottom:130
  },
  logoutButton: {
    width: width * 0.6,
    backgroundColor: themecolors.accent,
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
