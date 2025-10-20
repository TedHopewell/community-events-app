import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  Alert, 
  ActivityIndicator, 
  TextInput 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from "./config/firebaseConfig";
import themecolors from '../themes/themecolors';
import { signOut, updateProfile, updateEmail } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const Profilepage = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState(user?.photoURL || 'https://via.placeholder.com/150');
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  // Refresh Events screen after updating image
  const refreshEventsScreen = () => {
    navigation.navigate("Homepage", { refresh: true });
  };

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      { text: "❌", style: "cancel" },
      {
        text: "✅",
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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "We need camera roll permissions to update your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setUploading(true);

      try {
        await updateProfile(auth.currentUser!, { photoURL: uri });
        setPhotoURL(uri);
        Alert.alert("Success", "Profile picture updated!");
        refreshEventsScreen();
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to update profile picture.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Update display name
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      // Update email
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      Alert.alert("Success", "Profile updated successfully!");
      setEditing(false);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
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
        <View style={styles.imageWrapper}>
          <Image style={styles.profileImage} source={{ uri: photoURL }} />
          <TouchableOpacity style={styles.editButton} onPress={pickImage}>
            {uploading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.editIcon}>✎</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.welcomeText}>
          Welcome <Text style={styles.username}>{displayName}</Text> 👋
        </Text>
        <Text style={styles.subtitle}>It’s good to have you back!</Text>

        {/* Editable fields */}
        <View style={styles.infoCard}>
          {editing ? (
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              style={styles.input}
              placeholder="Display Name"
            />
          ) : (
            <Text style={styles.infoText}>{displayName}</Text>
          )}
        </View>

        <View style={styles.infoCard}>
          {editing ? (
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.infoText}>{email}</Text>
          )}
        </View>

        <View style={styles.messageCard}>
          <Text style={styles.messageText}>
            Thank you <Text style={styles.highlight}>@{displayName}</Text> for trusting us. 🎉
          </Text>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomView}>
        {editing ? (
          <View style={{ flexDirection: 'column', gap: 10 }}>
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: 'grey' }]}
              onPress={() => setEditing(false)}
            >
              <Text style={styles.logoutText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleSave}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.logoutText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: 'grey' }]}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.logoutText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("RSVP")}>
              <Text style={styles.logoutText}>View RSVP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default Profilepage;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    alignItems: 'center' 

  },
  topView: {
    width: '100%',
    height: 100,
    backgroundColor: themecolors.accent,
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
    padding: 5 
  },
  backText: { 
    fontSize: 30, 
    fontWeight: '700', 
    color: '#fff' 
  },
  title: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#fff' 
  },
  midView: { 
    flex: 1, 
    alignItems: 'center', 
    marginTop: -40 

  },
  imageWrapper: { 
    position: 'relative' 

  },
  profileImage: {
    height: 150,
    width: 150,
    borderRadius: 100,
    backgroundColor: '#eee',
    borderWidth: 3,
    borderColor: themecolors.accent,
  },
  editButton: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    backgroundColor: themecolors.accent,
    borderRadius: 20,
    padding: 8,
  },
  editIcon: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  welcomeText: { 
    fontSize: 18, 
    color: '#444', 
    marginTop: 20 
  },
  username: { 
    color: '#000', 
    fontWeight: 'bold' 
  },
  subtitle: { 
    color: 'grey', 
    fontSize: 14, 
    marginBottom: 20 
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
  infoText: { fontSize: 16, 
    color: '#333' 
  },
  input: { fontSize: 16, 
    color: '#333', 
    borderBottomWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 4 
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
    color: '#333' 
  },
  highlight: { 
    color: themecolors.accent, 
    fontWeight: 'bold' 
  },
  bottomView: { 
    width: '100%', 
    alignItems: 'center', 
    bottom: 130, 
    gap: 10 
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
    fontSize: 16 
  },
});
