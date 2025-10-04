import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Image,Dimensions, KeyboardAvoidingView, } from 'react-native';
import themecolors from "../themes/themecolors";
import textsettings from "../themes/textsettings";
import { auth } from "./config/firebaseConfig";


// import google from "./assets/google.png";
// import { StatusBar } from 'expo-status-bar';

export default function EventsScreen() {

const user=auth.currentUser
console.log(user);

const[name,useName]=useState({username:user?.displayName})
const[tabs,setTabs] = useState({
        all: "All",
        entertainment: "Entertainment",
        education: "Education",
        Spiritual:"Spiritual",
        sport:"Sport",
     
})


  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.topContainer}>
         <View style={styles.topTextContainer}>
              <Text style={styles.welcometext}>Hi,<Text style={styles.name}>{name.username}</Text></Text>

              <Image style={styles.profilePic}>
          
              </Image>
         </View>
         
      </View>
      <View style={styles.middleContainer}>
            <View style={styles.eventTabs}>
              <TouchableOpacity style={styles.eventsSelection}>
                <Text style={styles.eventText}>{tabs.all}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.eventsSelection}>
                <Text style={styles.eventText}>{tabs.entertainment}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.eventsSelection}>
                <Text style={styles.eventText}>{tabs.education}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.eventsSelection}>
                <Text style={styles.eventText}>{tabs.Spiritual}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.eventsSelection}>
                <Text style={styles.eventText}>{tabs.sport}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.eventcardContainer}>
              <View style={styles.eventCards}>
                <View style={styles.eventcardTop}>
                  <Image style={styles.eventcardprofilepic}>

                  </Image>
                  <View style={styles.eventcardtopText}>

                        <Text style={styles.eventcardUsername}>

                    </Text>
                    <Text style={styles.eventcardDatandTime}>

                    </Text>
                  </View>
                </View>
                <View style={styles.eventcardImageContainter}>
                  <Image style={styles.imagecontainer}>

                  </Image>
                </View>
                <Text>Feed the poor street bash</Text>
              </View>
            </View>

      </View>
      <View style={styles.bottomContainer}>

      </View>
            
    </KeyboardAvoidingView>
  );
}

const deviceWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themecolors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',

  },
  topContainer:{
    flex:1,
    width:deviceWidth-50,
    paddingTop:20,
    
  },
  topTextContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
     
  },

  welcometext:{
    fontSize:30,
    fontWeight:'800',
    color:themecolors.text
  },
  name:{
   padding:2,
   fontWeight:'200',
  },
  profilePic:{
    height:50,
    width:50,
    borderRadius:50,
    backgroundColor:themecolors.accent,
  },

  middleContainer:{
    flex:5,
    backgroundColor:themecolors.primary,
    width:deviceWidth-50,
  },
  eventTabs:{
    flexDirection:'row',
    gap:5,
  },
  eventsSelection:{
      backgroundColor:themecolors.accent,
      padding:7,
      borderRadius:8,
  },
  eventText:{
    fontSize:textsettings.primarySubheading,
  },
  eventcardContainer:{
      padding:10,
      backgroundColor:'yellow',

  },
  eventCards:{
    backgroundColor:themecolors.accent,
  },
  imagecontainer:{
    width:deviceWidth-50,
    height:50,
  },
  bottomContainer:{
    flex:1,
  },

});
