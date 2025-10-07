import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import themecolors from "../themes/themecolors";
import textsettings from "../themes/textsettings";
import { auth } from "./config/firebaseConfig";

export default function EventsScreen() {
  const user = auth.currentUser;

  const [name] = useState({ username: user?.displayName || "Guest" });
  const [date] = useState({
    time: "12:18",
    date: "9th Oct 2025",
  });
  const [text] = useState({
    eventName: "Feed the poor street bash",
    eventDetails:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only five centuries but also the leap into electronic typesetting.",
  });
  const [tabs] = useState({
    all: "All",
    entertainment: "Entertainment",
    education: "Education",
    Spiritual: "Spiritual",
    sport: "Sport",
  });

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* ==== TOP ==== */}
      <View style={styles.topContainer}>
        <View style={styles.topTextContainer}>
          <View style={styles.usernameContainer}>
            <Text style={styles.welcometext}>Hi,</Text>
            <Text style={styles.name}>{name.username}</Text>
          </View>
          <Image
            style={styles.profilePic}
            source={require("../assets/pictures/image1.webp")}
          />
        </View>
      </View>

      {/* ==== MIDDLE (Scrollable) ==== */}
      <View style={styles.middleContainer}>
        {/* Tabs */}
        <View style={styles.eventTabs}>
          {Object.values(tabs).map((tab, index) => (
            <TouchableOpacity key={index} style={styles.eventsSelection}>
              <Text style={styles.eventText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ==== Vertical ScrollView for event cards ==== */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.eventScrollContainer}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.eventCards}>
              {/* Card Top Section */}
              <View style={styles.eventcardTop}>
                <Image
                  style={styles.eventcardprofilepic}
                  source={require("../assets/pictures/image1.webp")}
                />
                <View style={styles.eventcardtopText}>
                  <Text style={styles.eventcardUsername}>{name.username}</Text>
                  <Text style={styles.eventcardDatandTime}>
                    {date.date} • {date.time}
                  </Text>
                </View>
              </View>

              {/* Event Image */}
              <View>
                <Image
                  style={styles.imagecontainer}
                  source={require("../assets/pictures/image2.webp")}
                  resizeMode="cover"
                />
              </View>

              {/* Event Bottom Text */}
              <View style={styles.eventbottomText}>
                <Text style={styles.eventTitle}>{text.eventName}</Text>
                <Text style={styles.eventdetailsText}>{text.eventDetails}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ==== BOTTOM ==== */}
      <View style={styles.bottomContainer}></View>
    </KeyboardAvoidingView>
  );
}

const deviceWidth = Math.round(Dimensions.get("window").width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themecolors.primary,
    alignItems: "center",
    justifyContent: "center",
    width: deviceWidth,
  },
  topContainer: {
    flex: 1,
    width: deviceWidth - 50,
    paddingTop: 40,
  },
  usernameContainer:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center"
  },
  topTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcometext: {
    fontSize: 30,
    fontWeight: "800",
    color: themecolors.text,
  },
  name: {
    fontWeight: "200",
    fontSize: 25,
  },
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: themecolors.accent,
  },
  middleContainer: {
    flex: 7,
    backgroundColor: themecolors.primary,
    width: deviceWidth - 50,
  },
  eventTabs: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 10,
  },
  eventsSelection: {
    backgroundColor: themecolors.accent,
    padding: 7,
    borderRadius: 8,
  },
  eventText: {
    fontSize: textsettings.primarySubheading,
  },
  eventScrollContainer: {
    flexGrow: 1,
  },
  eventCards: {
    backgroundColor: themecolors.accent,
    borderRadius: 12,
    marginBottom: 20,
    padding: 10,
  },
  imagecontainer: {
    width: "100%",
    height: 180,
    borderRadius: 10,
  },
  eventcardTop: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  eventcardprofilepic: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  eventcardtopText: {
    flexDirection: "column",
    alignContent: "center",
    gap: 5,
  },
  eventcardUsername: {
    fontSize: textsettings.primarySize,
    fontWeight: "700",
  },
  eventcardDatandTime: {
    fontSize: textsettings.primaryDate,
    fontWeight: "600",
    color: themecolors.text2,
  },
  eventbottomText: {
    gap: 5,
    marginTop: 10,
  },
  eventTitle: {
    fontSize: textsettings.primarySize,
    fontWeight: "700",
  },
  eventdetailsText: {
    color: themecolors.text2,
    fontSize: textsettings.primarySubheading,
  },
  bottomContainer: {
    flex: 1,
  },
});
