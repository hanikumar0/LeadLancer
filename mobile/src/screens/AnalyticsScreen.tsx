import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { analyticsService } from '../api/analyticsService';

export default function AnalyticsScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getOverview();
      setData(res.data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
    >
      <Text style={styles.title}>Performance Snapshot</Text>

      {data.insights?.length > 0 && (
        <View style={styles.insightBox}>
          <Text style={styles.insightTitle}>✨ AI Insights</Text>
          {data.insights.map((insight: any, i: number) => (
            <Text key={i} style={styles.insightText}>• {insight.text}</Text>
          ))}
        </View>
      )}

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Productivity</Text>
          <Text style={[styles.cardValue, { color: '#2563eb' }]}>{data.productivityScore}/100</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Reply Rate</Text>
          <Text style={styles.cardValue}>{data.kpis.replyRate}%</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Pipeline</Text>
          <Text style={styles.cardValue}>${data.kpis.pipelineValue}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Won Revenue</Text>
          <Text style={[styles.cardValue, { color: '#16a34a' }]}>${data.kpis.wonRevenue}</Text>
        </View>
      </View>

      <Text style={[styles.title, { marginTop: 24, fontSize: 18 }]}>Funnel Metrics</Text>
      <View style={styles.listCard}>
        {data.trends.funnel.map((f: any, i: number) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.listName}>{f.name}</Text>
            <Text style={styles.listValue}>{f.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#111827' },
  insightBox: { backgroundColor: '#eff6ff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
  insightTitle: { fontWeight: 'bold', color: '#1e3a8a', marginBottom: 8 },
  insightText: { color: '#1e40af', fontSize: 13, marginBottom: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%', backgroundColor: 'white', padding: 16, borderRadius: 12, elevation: 1 },
  cardLabel: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  cardValue: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 8 },
  listCard: { backgroundColor: 'white', borderRadius: 12, elevation: 1, padding: 8, marginBottom: 32 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  listName: { color: '#374151' },
  listValue: { fontWeight: 'bold' }
});
