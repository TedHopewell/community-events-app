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
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "./config/firebaseConfig";
import { db } from "./config/firebaseConfig";
import themecolors from "../themes/themecolors";
import textsettings from "../themes/textsettings";
import { collection, addDoc, getDocs } from "firebase/firestore";

const { width: deviceWidth } = Dimensions.get("window");

interface EventData {
  id: string;
  name: string;
  images?: { url: string }[];
  dates: {
    start: { localDate: string; localTime?: string };
  };
  _embedded?: {
    venues?: { name: string; city?: { name: string } }[];
  };
}

export default function EventsScreen() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [newEventiImage, setNewEventImage] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventVenue, setNewEventVenue] = useState("");
  const [firestoreEvents, setFirestoreEvents] = useState<EventData[]>([]);


  const user = auth.currentUser;
  const imageSrc = { uri: user?.photoURL || 'https://via.placeholder.com/150' };

  const navigation = useNavigation();

  const TM_API_KEY = "KdxoXJfOhu4xYkRJtHU3TBVBQ7rJ46Ad";
  const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";
  const categories = ["All", "Music", "Sports", "Arts & Theatre", "Miscellaneous"];

  const fetchEvents = async (category: string) => {
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
  
  const fetchFirestoreEvents = async () => {
  try {
    const snapshot = await getDocs(collection(db, "userEvents"));
    const eventsFromDb: EventData[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as EventData),
    }));
    setFirestoreEvents(eventsFromDb);
  } catch (error) {
    console.error("Error fetching Firestore events:", error);
  }
};
  

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

  const handleAddEvent = async () => {
  if (!newEventName || !newEventDate || !newEventVenue) {
    Alert.alert("Missing info", "Please fill in all required fields.");
    return;
  }

  const newEvent: EventData = {
    id: Math.random().toString(),
    name: newEventName,
    dates: { start: { localDate: newEventDate, localTime: newEventTime } },
    _embedded: { venues: [{ name: newEventVenue }] },
    images: newEventiImage ? [{ url: newEventiImage }] : undefined,
  };

  try {
    // Save to Firestore
    const docRef = await addDoc(collection(db, "userEvents"), newEvent);
    // Add Firestore ID
    const eventWithId = { ...newEvent, id: docRef.id };
    // Update Firestore events state
    setFirestoreEvents([eventWithId, ...firestoreEvents]);
    // Also update local events display
    setEvents([eventWithId, ...events]);

    // Reset modal fields
    setModalVisible(false);
    setNewEventName("");
    setNewEventDate("");
    setNewEventTime("");
    setNewEventVenue("");
    setNewEventImage("");
  } catch (error) {
    console.error("Error saving event to Firestore:", error);
    Alert.alert("Error", "Failed to save event.");
  }
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

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/pictures/bg6.jpg")}
    >
      <View style={styles.topContainer}>
        <View style={styles.topTextContainer}>
          <View style={styles.usernameContainer}>
            <Text style={styles.welcometext}>Hi,</Text>
            <Text style={styles.name}>{user?.displayName || "Guest"}</Text>
          </View>
          <TouchableOpacity onPress={() =>navigation.navigate("Profilepage")}>
          <Image
            style={styles.profilePic}
            source={imageSrc}
            
          />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabsContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryTab,
              selectedCategory === cat && styles.activeTab,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.activeCategoryText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {events.length > 0 ? (
          events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.name}</Text>
                <Text style={styles.eventDate}>
                  {event.dates.start.localDate} • {event.dates.start.localTime || ""}
                </Text>
              </View>

              {event.images?.[0] && (
                <Image
                  source={{ uri: event.images[0].url }}
                  style={styles.eventImage}
                  resizeMode="cover"
                />
              )}

              <View style={styles.eventFooter}>
                <Text style={styles.venueText}>
                  {event._embedded?.venues?.[0]?.name},{" "}
                  {event._embedded?.venues?.[0]?.city?.name || ""}
                </Text>

                <TouchableOpacity
                  style={styles.rsvpButton}
                  onPress={() => Alert.alert("RSVP", `You selected ${event.name}`)}
                >
                  <Text style={styles.rsvpText}>RSVP HERE</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noEvents}>No events found in this category.</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView style={styles.modalContainer} behavior="padding">
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Add New Event</Text>

            <TextInput
              placeholder="Event Name"
              value={newEventName}
              onChangeText={setNewEventName}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Date (YYYY-MM-DD)"
              value={newEventDate}
              onChangeText={setNewEventDate}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Time (HH:MM)"
              value={newEventTime}
              onChangeText={setNewEventTime}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Venue"
              value={newEventVenue}
              onChangeText={setNewEventVenue}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="image Url"
              value={newEventiImage}
              onChangeText={setNewEventImage}
              style={styles.modalInput}
            />

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
        <TouchableOpacity onPress={handleLogout} style={styles.bottomtabsbuttons} >
          <Image style={styles.bottomtabsimages} source={require("../assets/pictures/logouttab-removebg-preview.png")}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={() =>navigation.navigate("Homepage")} style={styles.bottomtabsbuttons} >
          <Image style={styles.bottomtabsimages} source={require("../assets/pictures/hometab2-removebg-preview.png")}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={() =>navigation.navigate("Profilepage")} style={styles.bottomtabsbuttons} >
          <Image style={styles.bottomtabsimages} source={require("../assets/pictures/profiletab-removebg-preview.png")}></Image>
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
    resizeMode: "cover", 
    backgroundColor:"#ccc" 
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
    shadowOffset: { width: 0, height: 3 },
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
  noEvents: { 
    color: themecolors.primaryLight, 
    textAlign: "center", 
    marginTop: 20 
  },

  bottomContainer: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    width: "100%", 
    backgroundColor: "rgba(0,0,0,0.85)", 
    paddingVertical: 15 
  },
  bottomtabsbuttons: { 
    backgroundColor: themecolors.accent, 
    padding: 12, 
    borderRadius: 25, 
    alignItems: "center" 
  },
  bottomtabsimages: { 
    width: 30, 
    height: 30 
  },

  // Floating button
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
    zIndex: 999,
  },
  floatingText: { 
    color: "#fff", 
    fontSize: 32, 
    fontWeight: "bold" 
  },

  // Modal
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: { 
    width: deviceWidth - 40, 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 14 
  },
  modalHeading: { 
    fontSize: 22, 
    fontWeight: "700", 
    marginBottom: 20, 
    textAlign: "center" 
  },
  modalInput: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 12 
  },
  modalButton: { 
    backgroundColor: themecolors.accent, 
    paddingVertical: 12, 
    borderRadius: 50, 
    alignItems: "center" 
  },
  modalButtonText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 16 
  }
});
