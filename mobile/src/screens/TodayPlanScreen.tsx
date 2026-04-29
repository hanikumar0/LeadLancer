import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { automationService } from '../api/automationService';

export default function TodayPlanScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await automationService.getDashboard();
      setData(res.data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDismiss = async (id: string) => {
    try {
      await automationService.dismissRecommendation(id);
      fetchData();
    } catch (e) {
      Alert.alert('Error', 'Failed to dismiss');
    }
  };

  if (!data) return <View style={styles.container}><Text>Loading Plan...</Text></View>;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
    >
      <Text style={styles.headerTitle}>Your Daily Plan</Text>
      <Text style={styles.subText}>AI-curated tasks to maximize your revenue today.</Text>

      {/* AI Coach Area */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ AI Coach Suggestions</Text>
        {data.recommendations.length === 0 ? (
          <Text style={styles.emptyText}>You're all caught up!</Text>
        ) : data.recommendations.map((rec: any) => (
          <View key={rec._id} style={styles.recCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.recTitle}>{rec.title}</Text>
              <Text style={styles.recDesc}>{rec.description}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnAction}>
                <Text style={styles.btnActionText}>Do It</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnDismiss} onPress={() => handleDismiss(rec._id)}>
                <Text style={styles.btnDismissText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Queue Area */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🕒 Background Tasks</Text>
        <View style={styles.queueContainer}>
          {data.tasks.length === 0 ? (
            <Text style={styles.emptyText}>No background tasks scheduled.</Text>
          ) : data.tasks.map((task: any) => (
            <View key={task._id} style={styles.taskItem}>
              <Text style={styles.taskType}>{task.type.toUpperCase()}</Text>
              <Text style={styles.taskTime}>Runs at {new Date(task.runAt).toLocaleTimeString()}</Text>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#111827' },
  subText: { fontSize: 14, color: '#6b7280', marginBottom: 24, marginTop: 4 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginBottom: 12 },
  emptyText: { color: '#9ca3af', fontStyle: 'italic' },
  recCard: { backgroundColor: '#eef2ff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#c7d2fe' },
  recTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e40af' },
  recDesc: { fontSize: 14, color: '#3b82f6', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btnAction: { backgroundColor: '#4f46e5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  btnActionText: { color: 'white', fontWeight: 'bold' },
  btnDismiss: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  btnDismissText: { color: '#4f46e5', fontWeight: 'bold' },
  queueContainer: { backgroundColor: 'white', borderRadius: 12, padding: 8, elevation: 1 },
  taskItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  taskType: { fontWeight: 'bold', color: '#4b5563' },
  taskTime: { color: '#6b7280', fontSize: 12 }
});
