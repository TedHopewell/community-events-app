import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, ActivityIndicator } from 'react-native';
import { auth, db } from './config/firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import themecolors from '../themes/themecolors';

const { width } = Dimensions.get('window');

const RSVPEventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchRSVPEvents = async () => {
      try {
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, where('rsvps', 'array-contains', user.email)); // Make sure RSVPs are stored as emails
        const querySnapshot = await getDocs(q);
        const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRSVPEvents();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.eventCard}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.eventImage} />
      ) : null}
      <Text style={styles.eventTitle}>{item.name}</Text>
      <Text style={styles.eventLocation}>{item._embedded?.venues?.[0]?.name || 'Location not set'}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={themecolors.accent} />
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#555' }}>You have not RSVPed to any events yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

export default RSVPEventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 15,
    padding: 10,
  },
  eventImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventLocation: {
    fontSize: 14,
    color: 'grey',
    marginVertical: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
  },
});
