import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth, db } from "./config/firebaseConfig";
import themecolors from "../themes/themecolors";
import { MaterialIcons } from "@expo/vector-icons";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import MapView, { Marker } from "react-native-maps"; // 🗺️ Added import

const { width: deviceWidth } = Dimensions.get("window");

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [newEventImageUri, setNewEventImageUri] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventVenue, setNewEventVenue] = useState("");
  const [firestoreEvents, setFirestoreEvents] = useState([]);

  const user = auth.currentUser;
  const imageSrc = { uri: user?.photoURL || "https://via.placeholder.com/150" };

  const navigation = useNavigation();
  const TM_API_KEY = "KdxoXJfOhu4xYkRJtHU3TBVBQ7rJ46Ad";
  const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";
  const categories = ["All", "Music", "Sports", "Arts & Theatre", "Miscellaneous"];

  // Fetch Ticketmaster Events
  const fetchEvents = async (category) => {
    setLoading(true);
    try {
      const categoryParam =
        category !== "All" ? `&classificationName=${encodeURIComponent(category)}` : "";
      const url = `${BASE_URL}?countryCode=ZA${categoryParam}&apikey=${TM_API_KEY}`;
      const response = await axios.get(url);
      const data = response.data._embedded?.events || [];
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      Alert.alert("Error", "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Firestore Events
  const fetchFirestoreEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "userEvents"));
      const eventsFromDb = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data()),
      }));
      setFirestoreEvents(eventsFromDb);
    } catch (error) {
      console.error("Error fetching Firestore events:", error);
    }
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
            navigation.navigate("Login");
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong while logging out.");
          }
        },
      },
    ]);
  };

  // Pick image from device
  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "We need permission to access your photos.");
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewEventImageUri(result.assets[0].uri);
    }
  };

  // Add event to Firestore
  const handleAddEvent = async () => {
    if (!newEventName || !newEventDate || !newEventVenue) {
      Alert.alert("Missing info", "Please fill in all required fields.");
      return;
    }

    const newEvent = {
      name: newEventName,
      category: selectedCategory,
      dates: { start: { localDate: newEventDate, localTime: newEventTime } },
      _embedded: {
        venues: [
          {
            name: newEventVenue,
            location: { latitude: -26.2041, longitude: 28.0473 }, // 🗺️ Default location
          },
        ],
      },
      images: newEventImageUri ? [{ url: newEventImageUri }] : undefined,
      rsvps: [],
    };

    try {
      const docRef = await addDoc(collection(db, "userEvents"), newEvent);
      const eventWithId = { ...newEvent, id: docRef.id };
      setFirestoreEvents([eventWithId, ...firestoreEvents]);
      setModalVisible(false);
      setNewEventName("");
      setNewEventDate("");
      setNewEventTime("");
      setNewEventVenue("");
      setNewEventImageUri("");
    } catch (error) {
      console.error("Error saving event to Firestore:", error);
      Alert.alert("Error", "Failed to save event.");
    }
  };

  const handleRSVP = async (event) => {
    if (!user?.email) {
      Alert.alert("Login required", "You need to log in to RSVP.");
      return;
    }

    try {
      const eventRef = doc(db, "userEvents", event.id);
      await updateDoc(eventRef, {
        rsvps: arrayUnion(user.email),
      });

      Alert.alert("RSVP Confirmed", `You have successfully RSVPed for ${event.name}`, [
        { text: "OK", onPress: () => navigation.navigate("RSVP") },
      ]);
    } catch (error) {
      console.error("Error adding RSVP:", error);
      Alert.alert("Error", "Failed to RSVP. Please try again.");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "❌", style: "cancel" },
      {
        text: "✅",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "userEvents", eventId));
            setFirestoreEvents((prev) => prev.filter((e) => e.id !== eventId));
            Alert.alert("Deleted", "Event has been deleted successfully.");
          } catch (error) {
            console.error("Error deleting event:", error);
            Alert.alert("Error", "Failed to delete event.");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchEvents(selectedCategory);
    fetchFirestoreEvents();
  }, [selectedCategory]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={themecolors.accent} />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading events...</Text>
      </View>
    );
  }

  const refreshPage = async () => {
    setLoading(true);
    await fetchEvents(selectedCategory);
    await fetchFirestoreEvents();
    setLoading(false);
  };

  const filteredFirestoreEvents =
    selectedCategory === "All"
      ? firestoreEvents
      : firestoreEvents.filter((e) => e.category === selectedCategory);

  const filteredTMEvents =
    selectedCategory === "All"
      ? events
      : events.filter((e) => e.classifications?.[0]?.segment?.name === selectedCategory);

  const combinedEvents = [...filteredFirestoreEvents, ...filteredTMEvents];

  return (
    <ImageBackground style={styles.container} source={require("../assets/pictures/bg6.jpg")}>
      <View style={styles.topContainer}>
        <View style={styles.topTextContainer}>
          <View style={styles.usernameContainer}>
            <Text style={styles.welcometext}>Hi,</Text>
            <Text style={styles.name}>{user?.displayName || "Guest"}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profilepage")}>
            <Image style={styles.profilePic} source={imageSrc} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabsContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryTab, selectedCategory === cat && styles.activeTab]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.categoryText, selectedCategory === cat && styles.activeCategoryText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {combinedEvents.length > 0 ? (
          combinedEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.name}</Text>
                <Text style={styles.eventDate}>
                  {event.dates?.start?.localDate} • {event.dates?.start?.localTime || ""}
                </Text>
              </View>

              {event.images?.[0] && (
                <Image source={{ uri: event.images[0].url }} style={styles.eventImage} resizeMode="cover" />
              )}

              <View style={styles.eventFooter}>
                <Text style={styles.venueText}>{event._embedded?.venues?.[0]?.name}</Text>
                <TouchableOpacity style={styles.rsvpButton} onPress={() => handleRSVP(event)}>
                  <Text style={styles.rsvpText}>RSVP HERE</Text>
                </TouchableOpacity>
              </View>

              {/* 🗺️ Embedded Map */}
              {event._embedded?.venues?.[0]?.location && (
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: parseFloat(event._embedded.venues[0].location.latitude),
                      longitude: parseFloat(event._embedded.venues[0].location.longitude),
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                  >
                    <Marker
                      coordinate={{
                        latitude: parseFloat(event._embedded.venues[0].location.latitude),
                        longitude: parseFloat(event._embedded.venues[0].location.longitude),
                      }}
                      title={event._embedded.venues[0].name}
                    />
                  </MapView>
                </View>
              )}

              {firestoreEvents.some((e) => e.id === event.id) && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteEvent(event.id)}>
                  <MaterialIcons name="delete" size={18} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noEvents}>No events found.</Text>
        )}
      </ScrollView>

      {/* Add Event Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.floatingText}>+</Text>
      </TouchableOpacity>

      {/* Add Event Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView style={styles.modalContainer} behavior="padding">
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Add New Event</Text>

            <TextInput placeholder="Event Name" value={newEventName} onChangeText={setNewEventName} style={styles.modalInput} />
            <TextInput placeholder="Date (YYYY-MM-DD)" value={newEventDate} onChangeText={setNewEventDate} style={styles.modalInput} />
            <TextInput placeholder="Time (HH:MM)" value={newEventTime} onChangeText={setNewEventTime} style={styles.modalInput} />
            <TextInput placeholder="Venue" value={newEventVenue} onChangeText={setNewEventVenue} style={styles.modalInput} />

            <TouchableOpacity style={[styles.modalInput, { justifyContent: "center", alignItems: "center" }]} onPress={pickImage}>
              {newEventImageUri ? (
                <Image source={{ uri: newEventImageUri }} style={{ width: 100, height: 100, borderRadius: 12 }} />
              ) : (
                <Text style={{ color: "#888" }}>Select Image</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={handleAddEvent}>
              <Text style={styles.modalButtonText}>Add Event</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#888", marginTop: 5 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.bottomtabsbuttons}>
          <Image style={styles.bottomtabsimages} source={require("../assets/pictures/logouttab-removebg-preview.png")} />
        </TouchableOpacity>
        <TouchableOpacity onPress={refreshPage} style={styles.bottomtabsbuttons}>
          <Image style={styles.bottomtabsimages} source={require("../assets/pictures/hometab2-removebg-preview.png")} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profilepage")} style={styles.bottomtabsbuttons}>
          <Image style={styles.bottomtabsimages} source={require("../assets/pictures/profiletab-removebg-preview.png")} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  loaderContainer: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "#000" 
  },
  topContainer: { 
    width: deviceWidth - 40, 
    paddingTop: 40, 
    marginBottom: 10 
  },
  topTextContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 

  },
  usernameContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 4 
    
  },
  welcometext: { 
    color: themecolors.primaryLight, 
    fontSize: 28, 
    fontWeight: "700" 
    
  },
  name: { 
    color: themecolors.primaryLight, 
    fontSize: 24, 
    fontWeight: "600" 

  },
  profilePic: { 
    height: 50, 
    width: 50, 
    borderRadius: 25, 
    backgroundColor: "#ccc" 

  },
  categoryTabsContainer: { 
    flexGrow: 0, 
    marginVertical: 10, 
    paddingHorizontal: 10 
    
  },
  categoryTab: { 
    paddingVertical: 8, 
    paddingHorizontal: 18, 
    borderRadius: 20, 
    backgroundColor: "rgba(255,255,255,0.15)", 
    marginHorizontal: 5 
    
  },
  activeTab: { 
    backgroundColor: themecolors.accent 
    
  },
  categoryText: { 
    color: themecolors.primaryLight, 
    fontWeight: "600" 
    
  },
  activeCategoryText: { 
    color: "#000" 
    
  },
  scrollContainer: { 
    flex: 1, 
    width: deviceWidth - 40, 
    marginBottom: 20 
    
  },
  eventCard: { 
    backgroundColor: "rgba(255,255,255,0.1)", 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 20, 
    shadowColor: "#000", 
    shadowOpacity: 0.2, 
    shadowRadius: 6, 
    elevation: 4 
    
  },
  eventHeader: { 
    marginBottom: 8 
    
  },
  eventTitle: { 
    color: themecolors.primaryLight, 
    fontWeight: "700", 
    fontSize: 18 
    
  },
  eventDate: { 
    color: "#ccc", 
    fontSize: 14 
    
  },
  eventImage: { 
    width: "100%", 
    height: 180, 
    borderRadius: 12, 
    marginBottom: 10 
    
  },
  eventFooter: { 
    alignItems: "center", 
    gap: 6 
    
  },
  venueText: { 
    color: themecolors.primaryLight, 
    fontSize: 14 
    
  },
  rsvpButton: { 
    backgroundColor: themecolors.accent, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 50, 
    marginTop: 8 
    
  },
  rsvpText: { 
    fontWeight: "700", 
    color: themecolors.text2 
    
  },
  mapContainer: { 
    width: "100%", 
    height: 150, 
    borderRadius: 12, 
    overflow: "hidden", 
    marginTop: 10 
    
  },
  map: { flex: 1 },
  deleteButton: { 
    position: "absolute", 
    top: 10, 
    right: 10, 
    width: 34, 
    height: 34, 
    alignItems: "center", 
    justifyContent: "center" 
    
  },
  noEvents: { 
    color: themecolors.primaryLight, textAlign: "center", marginTop: 20 },
  bottomContainer: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    width: "100%", 
    backgroundColor: "rgba(0,0,0,0.85)", 
    paddingVertical: 45 
    
  },
  bottomtabsbuttons: { 
    backgroundColor: themecolors.accent, 
    padding: 12, 
    borderRadius: 25, 
    alignItems: "center" 
    
  },
  bottomtabsimages: { 
    width: 30, height: 30 },
  floatingButton: { 
    position: "absolute", 
    bottom: 120, 
    right: 20, 
    backgroundColor: themecolors.accent, 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    alignItems: "center", 
    justifyContent: "center", 
    elevation: 6, 
    zIndex: 999 
    
  },
  floatingText: { 
    color: themecolors.text2, 
    fontSize: 28, 
    fontWeight: "900" 
    
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
    
  },
  modalContent: { 
    backgroundColor: "#fff", borderRadius: 12, padding: 20, width: "85%" },
  modalHeading: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginBottom: 12, 
    color: "#000" 
    
  },
  modalInput: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 10 
    
  },
  modalButton: { 
    backgroundColor: themecolors.accent, 
    borderRadius: 8, 
    paddingVertical: 12, 
    alignItems: "center" 
    
  },
  modalButtonText: { 
    color: themecolors.text2, 
    fontWeight: "700" },
});
