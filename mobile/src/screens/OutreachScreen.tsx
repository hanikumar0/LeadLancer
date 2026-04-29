import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { outreachService } from '../api/outreachService';
import { leadService } from '../api/leadService';

export default function OutreachScreen() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    leadService.getLeads().then(res => {
      const emailLeads = res.data.leads.filter((l: any) => l.email);
      setLeads(emailLeads);
      if (emailLeads.length > 0) setSelectedLead(emailLeads[0]);
    });
  }, []);

  const handleGenerate = async () => {
    if (!selectedLead) return Alert.alert('Error', 'Select a lead first');
    setLoadingAi(true);
    try {
      const res = await outreachService.generateAiEmail({ leadId: selectedLead._id });
      setSubject(res.data.subject);
      setBody(res.data.body);
    } catch (e) {
      Alert.alert('Error', 'Failed to generate email');
    }
    setLoadingAi(false);
  };

  const handleSend = async () => {
    if (!selectedLead || !subject || !body) return Alert.alert('Error', 'Fill all fields');
    try {
      await outreachService.sendEmail({ leadId: selectedLead._id, subject, body });
      Alert.alert('Success', 'Email Sent!');
      setSubject('');
      setBody('');
    } catch (e) {
      Alert.alert('Error', 'Failed to send email');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quick Outreach</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Selected Lead</Text>
        <Text style={styles.leadText}>{selectedLead ? `${selectedLead.businessName} (${selectedLead.email})` : 'Loading...'}</Text>

        <TouchableOpacity style={styles.aiButton} onPress={handleGenerate} disabled={loadingAi}>
          <Text style={styles.aiButtonText}>{loadingAi ? 'Generating...' : '✨ Generate AI Pitch'}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Subject</Text>
        <TextInput 
          style={styles.input} 
          value={subject}
          onChangeText={setSubject}
          placeholder="Email Subject"
        />

        <Text style={styles.label}>Message</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={6}
          placeholder="Email Body"
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send Email</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  leadText: { fontSize: 16, color: '#111827', marginBottom: 16, padding: 12, backgroundColor: '#f3f4f6', borderRadius: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  textArea: { height: 120, textAlignVertical: 'top' },
  aiButton: { backgroundColor: '#8b5cf6', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  aiButtonText: { color: 'white', fontWeight: 'bold' },
  sendButton: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center' },
  sendButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
