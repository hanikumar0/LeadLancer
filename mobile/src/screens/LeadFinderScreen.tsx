import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { scrapeService } from '../api/scrapeService';

export default function LeadFinderScreen() {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!keyword || !city) return alert('Enter keyword and city');
    setLoading(true);
    try {
      await scrapeService.startScrape({ keyword, city, source: 'google-maps' });
      alert('Scraping started!');
      setKeyword('');
      setCity('');
    } catch (e) {
      alert('Error starting scrape');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Find New Leads</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Keyword</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Dentist"
          value={keyword}
          onChangeText={setKeyword}
        />

        <Text style={styles.label}>City</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Gurgaon"
          value={city}
          onChangeText={setCity}
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleStart}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Starting...' : 'Start Scraping'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
