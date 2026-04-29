import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { leadService } from '../api/leadService';

export default function LeadsListScreen() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await leadService.getLeads();
      setLeads(res.data.leads);
    } catch (e) {
      console.log('Error fetching leads', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const openUrl = (url: string) => Linking.openURL(url);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.businessName}</Text>
          <Text style={styles.niche}>{item.niche} • {item.city}</Text>
        </View>
        <View style={[styles.scoreCircle, { backgroundColor: item.totalLeadScore >= 80 ? '#22c55e' : item.totalLeadScore >= 60 ? '#eab308' : '#ef4444' }]}>
          <Text style={styles.scoreText}>{item.totalLeadScore}</Text>
        </View>
      </View>
      
      <View style={styles.contactRow}>
        {item.phone && <Text style={styles.contactText}>📞 {item.phone}</Text>}
        {item.email && <Text style={styles.contactText}>✉️ {item.email}</Text>}
      </View>
      
      <View style={styles.actions}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        {item.website && (
          <TouchableOpacity onPress={() => openUrl(item.website)}>
            <Text style={styles.link}>Website ↗</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList 
        data={leads}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={fetchLeads}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  niche: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  contactRow: { marginTop: 12, gap: 4 },
  contactText: { fontSize: 14, color: '#4b5563' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  statusBadge: { backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: 12, color: '#374151', fontWeight: '500' },
  link: { color: '#2563eb', fontWeight: '500' },
  scoreCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  scoreText: { color: 'white', fontWeight: 'bold', fontSize: 14 }
});
