import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { leadService } from '../api/leadService';
import { crmService } from '../api/crmService';

const STAGES = ['New Lead', 'Contacted', 'Replied', 'Qualified', 'Meeting Booked', 'Proposal Sent', 'Won'];

export default function CrmScreen() {
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const leadsRes = await leadService.getLeads();
      setLeads(leadsRes.data.leads);
      const statsRes = await crmService.getStats();
      setStats(statsRes.data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const moveStage = async (lead: any) => {
    const currentIndex = STAGES.indexOf(lead.crmStage || 'New Lead');
    const nextStage = STAGES[currentIndex + 1];
    
    if (!nextStage) return Alert.alert('Info', 'Lead is at the final stage.');

    Alert.alert(
      'Update Stage',
      `Move ${lead.businessName} to ${nextStage}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Move', 
          onPress: async () => {
            try {
              await crmService.updateLeadStage(lead._id, nextStage);
              fetchData();
            } catch (e) {
              Alert.alert('Error', 'Failed to update stage');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.businessName}</Text>
          <Text style={styles.niche}>{item.niche} • {item.city}</Text>
        </View>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{item.totalLeadScore}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.crmStage || 'New Lead'}</Text>
        </View>
        <TouchableOpacity style={styles.moveButton} onPress={() => moveStage(item)}>
          <Text style={styles.moveButtonText}>Advance ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Pipeline</Text>
          <Text style={styles.statValue}>${stats.pipelineValue || 0}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Won</Text>
          <Text style={[styles.statValue, { color: '#22c55e' }]}>${stats.wonValue || 0}</Text>
        </View>
      </View>

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
  statsContainer: { flexDirection: 'row', padding: 16, gap: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  statBox: { flex: 1, backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginTop: 4 },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  niche: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  scoreCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
  scoreText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  statusBadge: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusText: { fontSize: 12, color: '#374151', fontWeight: 'bold' },
  moveButton: { backgroundColor: '#e0e7ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  moveButtonText: { color: '#4f46e5', fontWeight: 'bold', fontSize: 12 }
});
