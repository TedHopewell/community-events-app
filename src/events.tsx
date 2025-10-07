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
const[date,setDate]=useState({
  time: "12:18",
  date:"9th Oct 2025"
})
const[text,setText] = useState({
  eventName:"Feed the poor street bash",
  eventDetails:"orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
})
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
              <Text style={styles.welcometext}>Hi,</Text><Text style={styles.name}>{name.username}</Text>

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
                  <Image style={styles.eventcardprofilepic} 
                        source={require("../assets/pictures/image1.webp")}
                  />
                  <View style={styles.eventcardtopText}>

                        <Text style={styles.eventcardUsername}>
                              {name.username}
                        </Text>
                        <Text style={styles.eventcardDatandTime}>
                              {date.date}
                              {date.time}
                        </Text>
                  </View>
                </View>
                <View style={styles.eventcardImageContainter}>
                  <Image 
                      style={styles.imagecontainer}
                      source={require("../assets/pictures/image2.webp")}
                        resizeMode="cover"
                  />
                </View>
                <View style={styles.eventbottomText}>
                    <Text style={styles.eventTitle}>{text.eventName}</Text>
                    <Text style={styles.eventdetailsText}>{text.eventDetails}</Text>
                </View> 

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
    width:deviceWidth,

  },
  topContainer:{
    flex:1,
    width:deviceWidth-50,
    paddingTop:40,
    
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
   fontWeight:'200',
   fontSize:20
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
      padding:5,
      

  },
  eventCards:{
    flexDirection:'column',
    gap:10,
    padding:5,
    paddingVertical:10
  },
  imagecontainer:{
  width:"100%",
  height: 150,
  resizeMode: "contain",
  alignSelf: "center",
  
  
  backgroundColor:'blue'
  },
  eventcardTop:{
    flexDirection:'row',
    gap:10
  },
  eventcardprofilepic:{
    width:50,
    height:50,
    borderRadius:50,
  },
  eventcardtopText:{
    flexDirection:'column',
    alignContent:'center',
    gap:5
    
  },
  eventcardUsername:{
    fontSize:textsettings.primarySize,
    fontWeight:'700'  
  },
  eventcardDatandTime:{
    fontSize:textsettings.primaryDate,
    fontWeight:'600',
    color:themecolors.text2
  },
  eventcardImageContainter:{},
  bottomContainer:{
    flex:1,
  },

});
