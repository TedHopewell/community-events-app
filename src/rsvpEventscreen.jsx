import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from "react-native";
import { auth, db } from "./config/firebaseConfig";
import { collection, getDocs, doc, updateDoc, arrayRemove } from "firebase/firestore";
import themecolors from "../themes/themecolors";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";


export default function RSVPEventsScreen() {
  const [rsvpEvents, setRsvpEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const navigation = useNavigation();

  // Fetch all RSVPed events for current user
  const fetchRSVPEvents = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "userEvents"));
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const userEmail = user?.email;
      const filteredEvents = events.filter((event) => event.rsvps?.includes(userEmail));
      setRsvpEvents(filteredEvents);
    } catch (error) {
      console.error("Error fetching RSVP events:", error);
      Alert.alert("Error", "Failed to load your RSVP events.");
    } finally {
      setLoading(false);
    }
  };

  const refreshPage = async () => {
    setLoading(true);
    await fetchEvents(selectedCategory);
    await fetchFirestoreEvents();
    setLoading(false);
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

  // Un-RSVP (Remove user from event rsvps array)
  const handleDeleteRSVP = async (eventId, eventName) => {
    Alert.alert(
      "Cancel RSVP",
      `Are you sure you want to cancel your RSVP for ${eventName}?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              const eventRef = doc(db, "userEvents", eventId);
              await updateDoc(eventRef, {
                rsvps: arrayRemove(user.email),
              });

              // Update UI instantly
              setRsvpEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));

              Alert.alert("Canceled", `You have canceled your RSVP for ${eventName}.`);
            } catch (error) {
              console.error("Error removing RSVP:", error);
              Alert.alert("Error", "Failed to cancel RSVP. Please try again.");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchRSVPEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={themecolors.accent} />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading RSVP events...</Text>
      </View>
    );
  }

  return (
    <ImageBackground style={styles.container} source={require("../assets/pictures/bg6.jpg")}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My RSVP'd Events</Text>
      </View>

      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollContainer}>
        {rsvpEvents.length > 0 ? (
          rsvpEvents.map((event) => (
            <View key={event.id} style={styles.card}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventDate}>
                {event.dates?.start?.localDate} • {event.dates?.start?.localTime || ""}
              </Text>

              {event.images?.[0] && (
                <Image source={{ uri: event.images[0].url }} style={styles.eventImage} resizeMode="cover" />
              )}

              <Text style={styles.venue}>{event._embedded?.venues?.[0]?.name}</Text>

              {/* Delete / Cancel RSVP button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteRSVP(event.id, event.name)}
              >
                <Text style={styles.deleteText}>Cancel RSVP</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.noEventsContainer}>
            <Text style={styles.noEventsText}>You haven’t RSVPed for any events yet.</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate("Homepage")}
            >
              <Text style={styles.browseText}>Browse Events</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={handleLogout} style={styles.bottomtabsbuttons}>
              <Image style={styles.bottomtabsimages} source={require("../assets/pictures/logouttab-removebg-preview.png")} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Homepage")} style={styles.bottomtabsbuttons}>
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
    backgroundColor: themecolors.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themecolors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom:30,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  eventDate: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  eventImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginVertical: 10,
  },
  venue: {
    fontSize: 14,
    color: "#333",
    textAlign:'center'
  },
  deleteButton: {
    backgroundColor: themecolors.accent,
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noEventsContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  noEventsText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: themecolors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  browseText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: themecolors.accent,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    position: "absolute",
    top: 70,
    left: 15,
    zIndex: 10,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
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
    width: 30, 
    height: 30 
  },
});
