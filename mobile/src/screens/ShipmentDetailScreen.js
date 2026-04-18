import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getShipment } from '../services/api';

const ShipmentDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [shipment, setShipment] = useState(null);

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const response = await getShipment(id);
        setShipment(response.data.shipment);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchShipment();
  }, [id]);

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
      borderRadius: 12,
      padding: 20,
      margin: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1e293b',
      flex: 1,
    },
    tracking: {
      fontSize: 12,
      color: '#64748b',
      backgroundColor: '#f1f5f9',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    badge: {
      color: 'white',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      fontSize: 12,
      fontWeight: '600',
      overflow: 'hidden',
    },
    routeCard: {
      backgroundColor: '#f1f5f9',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
    },
    routeItem: {
      flex: 1,
    },
    routeLabel: {
      fontSize: 12,
      color: '#64748b',
      marginBottom: 4,
    },
    routeCity: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1e293b',
    },
    routeArrow: {
      fontSize: 24,
      color: '#2563eb',
      marginHorizontal: 12,
    },
    historyCard: {
      backgroundColor: '#f1f5f9',
      borderRadius: 12,
      padding: 16,
    },
    historyTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: 12,
    },
    historyItem: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    historyDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginTop: 4,
      marginRight: 12,
    },
    historyStatus: {
      fontWeight: 'bold',
      color: '#1e293b',
      fontSize: 14,
    },
    historyNote: {
      color: '#64748b',
      fontSize: 13,
    },
    historyTime: {
      color: '#94a3b8',
      fontSize: 12,
    },
  });

  if (!shipment) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{shipment.title}</Text>
            <Text style={styles.tracking}>{shipment.trackingNumber}</Text>
          </View>
          <Text style={styles.badge} backgroundColor={getStatusColor(shipment.status)}>
            {shipment.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeItem}>
            <Text style={styles.routeLabel}>Origin</Text>
            <Text style={styles.routeCity}>{shipment.origin.city}</Text>
          </View>
          <Text style={styles.routeArrow}>→</Text>
          <View style={styles.routeItem}>
            <Text style={styles.routeLabel}>Destination</Text>
            <Text style={styles.routeCity}>{shipment.destination.city}</Text>
          </View>
        </View>

        {shipment.blockchainTxHash && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold', color: '#16a34a', marginBottom: 4 }}>
              ✅ Blockchain Verified
            </Text>
            <Text style={{ fontSize: 12, color: '#15803d', wordBreak: 'break-all' }}>
              {shipment.blockchainTxHash}
            </Text>
          </View>
        )}

        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Status History</Text>
          {shipment.statusHistory.map((item, index) => (
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

export default ShipmentDetailScreen;