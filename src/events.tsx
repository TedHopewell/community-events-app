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
  Alert,
  ImageBackground
} from "react-native";
import themecolors from "../themes/themecolors";
import textsettings from "../themes/textsettings";
import { auth } from "./config/firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function EventsScreen() {
  const user = auth.currentUser;
  const navigation = useNavigation();
  const [name] = useState({ username: user?.displayName || "Guest" });
  const [date] = useState({
    time: "12:18",
    currentdate: "9th Oct 2025",
    eventDate:"27 Dec 2025",
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

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel",
        },
        {
          text: "Yes, Log Out",
          onPress: async () => {
            try {
              await signOut(auth);
              Alert.alert("Logged Out", "You have been signed out successfully.");
              navigation.navigate("Login"); // navigate back to login page
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Something went wrong while logging out.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };


  return (
    
    <ImageBackground style={styles.container} source={require("../assets/pictures/bg6.jpg")}>
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
                    {date.currentdate} • {date.time}
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
                <Text style={styles.eventDate}>{date.eventDate}</Text>
                <Text style={styles.eventdetailsText}>{text.eventDetails}</Text>
              </View>
              <View>
                <TouchableOpacity style={styles.rsvpbutton}>
                  <Text style={styles.rsvpText}>RSVP HERE</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ==== BOTTOM ==== */}
      <View style={styles.bottomContainer}>
        
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        
      </View>
    </ImageBackground>
  );
}

const deviceWidth = Math.round(Dimensions.get("window").width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems:"center",
    gap:2
  },
  topTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcometext: {   
    color:themecolors.primaryLight,
    fontSize: 30,
    fontWeight: "800",
  },
  name: {
    fontWeight: "600",
    fontSize: 25,
    width:"75%",
    color:themecolors.primaryLight,


  },
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: themecolors.accent,
    resizeMode:'cover'
  },


  //Whole middle contaner


  middleContainer: {
    flex: 7,
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

  //events Card Container

  eventCards: {
    borderRadius: 12,
    marginBottom: 20,
    padding: 10,
    backgroundColor:themecolors.accentBg
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
    resizeMode:'cover'
  },
  eventcardtopText: {
    flexDirection: "column",
    alignContent: "center",
    gap: 5,
  },
  eventcardUsername: {
    color: themecolors.primaryLight,
    fontSize: textsettings.primarySize,
    fontWeight: "700",
  },
  eventcardDatandTime: {
    fontSize: textsettings.primaryDate,
    fontWeight: "600",
    color: themecolors.primaryLight,
  },
  eventbottomText: {
    gap: 5,
    marginTop: 10,
  },
  eventTitle: {
    color: themecolors.primaryLight,
    fontSize: textsettings.primarySize,
    fontWeight: "700",
  },
  eventDate:{
    color: themecolors.primaryLight,
    fontWeight:'800',
  },
  eventdetailsText: {
    color: themecolors.primaryLight,
    fontSize: textsettings.primarySubheading,
  },

  rsvpbutton:{
    padding:20,
    backgroundColor:themecolors.accent,    
    alignItems:"center",
    borderRadius:50
  },
  rsvpText:{
    fontWeight:"800",
  },
  bottomContainer: {
    flex: 1,
    flexDirection:"row",
    gap:50,
    backgroundColor:"red"
  },
  
 
  logoutBtn: {
    backgroundColor: "#E63946",
    padding:10,
    borderRadius: 25,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },


});
