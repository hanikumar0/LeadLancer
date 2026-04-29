import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { leadService } from '../api/leadService';
import { communicationService } from '../api/communicationService';

export default function InboxScreen() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await leadService.getLeads();
      const contactable = res.data.leads.filter((l: any) => l.whatsappNumber || l.phone);
      setLeads(contactable);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openWhatsApp = async (lead: any) => {
    try {
      const res = await communicationService.getWhatsAppLink({ leadId: lead._id });
      
      const canOpen = await Linking.canOpenURL(res.data.link);
      if (canOpen) {
        await Linking.openURL(res.data.link);
        
        // Log the attempt
        await communicationService.logCommunication({
          leadId: lead._id,
          channel: 'whatsapp',
          direction: 'outbound',
          message: res.data.message
        });
      } else {
        Alert.alert('Error', 'WhatsApp is not installed');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to generate WhatsApp link');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.businessName}</Text>
        <Text style={styles.phone}>📞 {item.whatsappNumber || item.phone}</Text>
        <Text style={styles.niche}>{item.niche} • {item.crmStage}</Text>
      </View>

      <TouchableOpacity style={styles.waButton} onPress={() => openWhatsApp(item)}>
        <Text style={styles.waButtonText}>WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList 
        data={leads}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={fetchData}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  phone: { fontSize: 14, color: '#4b5563', marginTop: 4 },
  niche: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  waButton: { backgroundColor: '#25D366', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  waButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 }
});
