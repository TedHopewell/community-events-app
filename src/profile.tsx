import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Alert, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, storage, db } from './config/firebaseConfig';
import { signOut, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import themecolors from '../themes/themecolors';

const { width } = Dimensions.get('window');

const ProfilePage = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const [image, setImage] = useState(user?.photoURL || 'https://via.placeholder.com/150');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // Handle picking image
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Denied', 'Please allow access to photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      uploadImage(uri);
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePics/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, { photoURL: downloadURL });
      Alert.alert("Success", "Profile picture updated!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not upload image");
    }
  };

  // Logout
  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Log Out",
        onPress: async () => {
          try {
            await signOut(auth);
            Alert.alert("Logged Out", "You have been signed out successfully.");
            navigation.navigate("Login");
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong while logging out.");
          }
        },
      },
    ]);
  };

  // Create new event
  const handleCreateEvent = async () => {
    if (!eventTitle || !eventDescription || !eventLocation) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'events'), {
        title: eventTitle,
        description: eventDescription,
        location: eventLocation,
        creator: user.email,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Event Created', 'Your event has been added successfully!');
      setEventTitle('');
      setEventDescription('');
      setEventLocation('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create event.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Section */}
      <View style={styles.topView}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.midView}>
        <TouchableOpacity onPress={pickImage}>
          <Image style={styles.profileImage} source={{ uri: image }} />
          <Text style={styles.changePic}>Change Picture</Text>
        </TouchableOpacity>

        <Text style={styles.welcomeText}>
          Welcome <Text style={styles.username}>{user?.displayName}</Text> 👋
        </Text>
        <Text style={styles.subtitle}>It’s good to have you back!</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{user?.email}</Text>
        </View>
      </View>

      {/* Event Creation Section */}
      <View style={styles.createEventContainer}>
        <Text style={styles.sectionTitle}>Create New Event</Text>

        <TextInput
          style={styles.input}
          placeholder="Event Title"
          value={eventTitle}
          onChangeText={setEventTitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Event Description"
          multiline
          value={eventDescription}
          onChangeText={setEventDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Event Location"
          value={eventLocation}
          onChangeText={setEventLocation}
        />

        <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
          <Text style={styles.createButtonText}>Create Event</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Section */}
      <View style={styles.bottomView}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 80,
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
    alignItems: 'center',
    marginTop: -40,
  },
  profileImage: {
    height: 150,
    width: 150,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: themecolors.accent,
  },
  changePic: {
    color: themecolors.accent,
    textAlign: 'center',
    marginTop: 5,
    fontSize: 14,
  },
  welcomeText: {
    fontSize: 18,
    color: '#444',
    marginTop: 10,
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
    textAlign: 'center',
  },
  createEventContainer: {
    width: width * 0.9,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: themecolors.accent,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
  },
  textArea: {
    height: 80,
  },
  createButton: {
    backgroundColor: themecolors.accent,
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomView: {
    marginTop: 30,
    alignItems: 'center',
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
