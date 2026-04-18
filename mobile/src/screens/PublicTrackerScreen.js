import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { trackShipment } from '../services/api';

const PublicTrackerScreen = ({ route }) => {
  const { trackingNumber } = route.params;
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const response = await trackShipment(trackingNumber);
        setShipment(response.data.shipment);
      } catch (err) {
        setError(err.response?.data?.message || 'Shipment not found');
      } finally {
        setLoading(false);
      }
    };
    fetchShipment();
  }, [trackingNumber]);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      picked_up: '#3b82f6',
      in_transit: '#8b5cf6',
      out_for_delivery: '#f97316',
      delivered: '#10b981',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 20,
      margin: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1e293b',
      textAlign: 'center',
      marginBottom: 8,
    },
    tracking: {
      fontSize: 14,
      color: '#64748b',
      backgroundColor: '#f1f5f9',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      textAlign: 'center',
    },
    badge: {
      color: 'white',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
      marginVertical: 16,
    },
    routeCard: {
      backgroundColor: '#f1f5f9',
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
    },
    routeItem: { flex: 1 },
    routeLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
    routeCity: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
    routeArrow: { fontSize: 24, color: '#2563eb', marginHorizontal: 12 },
    historyCard: {
      backgroundColor: '#f1f5f9',
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
    },
    historyTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: 12,
    },
    historyItem: { flexDirection: 'row', marginBottom: 12 },
    historyDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4, marginRight: 12 },
    historyStatus: { fontWeight: 'bold', color: '#1e293b', fontSize: 14 },
    historyNote: { color: '#64748b', fontSize: 13 },
    historyTime: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
    errorText: { textAlign: 'center', color: '#64748b', marginTop: 40 },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Shipment Tracking</Text>
        <Text style={styles.tracking}>{shipment.trackingNumber}</Text>

        <Text style={styles.badge} backgroundColor={getStatusColor(shipment.status)}>
          {shipment.status.replace('_', ' ').toUpperCase()}
        </Text>

        <View style={styles.routeCard}>
          <View style={styles.routeItem}>
            <Text style={styles.routeLabel}>Origin</Text>
            <Text style={styles.routeCity}>{shipment.origin?.city}</Text>
          </View>
          <Text style={styles.routeArrow}>→</Text>
          <View style={styles.routeItem}>
            <Text style={styles.routeLabel}>Destination</Text>
            <Text style={styles.routeCity}>{shipment.destination?.city}</Text>
          </View>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Tracking History</Text>
          {shipment.statusHistory?.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={[styles.historyDot, { background: getStatusColor(item.status) }]} />
              <View>
                <Text style={styles.historyStatus}>
                  {item.status.replace('_', ' ').toUpperCase()}
                </Text>
                {item.note && <Text style={styles.historyNote}>{item.note}</Text>}
                <Text style={styles.historyTime}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default PublicTrackerScreen;