import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import themecolors from "../themes/themecolors";
import textsettings from "../themes/textsettings";
import { useNavigation } from "@react-navigation/native";

const { width: deviceWidth } = Dimensions.get("window");

export default function CreateEventScreen() {
  const navigation = useNavigation();

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = () => {
    if (!eventName || !eventDate || !venue) {
      Alert.alert("Missing Info", "Please fill in all required fields.");
      return;
    }

    const newEvent = {
      eventName,
      eventDate,
      eventTime,
      venue,
      description,
      imageUrl,
    };

    Alert.alert("Event Created!", JSON.stringify(newEvent, null, 2));

    // Clear fields
    setEventName("");
    setEventDate("");
    setEventTime("");
    setVenue("");
    setDescription("");
    setImageUrl("");

    // Optionally navigate back
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Create New Event</Text>

        <TextInput
          placeholder="Event Name"
          value={eventName}
          onChangeText={setEventName}
          style={styles.input}
        />
        <TextInput
          placeholder="Date (YYYY-MM-DD)"
          value={eventDate}
          onChangeText={setEventDate}
          style={styles.input}
        />
        <TextInput
          placeholder="Time (HH:MM)"
          value={eventTime}
          onChangeText={setEventTime}
          style={styles.input}
        />
        <TextInput
          placeholder="Venue"
          value={venue}
          onChangeText={setVenue}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textArea]}
          multiline
        />
        <TextInput
          placeholder="Image URL"
          value={imageUrl}
          onChangeText={setImageUrl}
          style={styles.input}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Create Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    backgroundColor: themecolors.primary,
  },
  scrollContainer: {
    width: deviceWidth - 40,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: themecolors.primaryLight,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: textsettings.primarySize,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: themecolors.accent,
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 18,
  },
});
