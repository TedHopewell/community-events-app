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
import { collection, getDocs } from "firebase/firestore";
import themecolors from "../themes/themecolors";
import { useNavigation } from "@react-navigation/native";

export default function RSVPEventsScreen() {
  const [rsvpEvents, setRsvpEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const navigation = useNavigation();

  const fetchRSVPEvents = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "userEvents"));
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter events where current user has RSVPed
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
            </View>
          ))
        ) : (
          <View style={styles.noEventsContainer}>
            <Text style={styles.noEventsText}>You haven’t RSVPed for any events yet.</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate("EventsScreen")}
            >
              <Text style={styles.backText}>Browse Events</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  backButton: {
    backgroundColor: themecolors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
