import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { getShipments } from '../services/api';

const ShipmentListScreen = ({ navigation }) => {
  const [shipments, setShipments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.addListener('focus', fetchShipments);
    return () => {};
  }, []);

  const fetchShipments = async () => {
    try {
      const response = await getShipments();
      setShipments(response.data.shipments);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchShipments();
    setRefreshing(false);
  };

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
    container: { flex: 1, backgroundColor: '#f8fafc' },
    card: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      marginHorizontal: 16,
      marginTop: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    title: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
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
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: 12,
      fontWeight: '600',
      overflow: 'hidden',
    },
    route: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    city: { fontSize: 14, color: '#475569' },
    arrow: { color: '#2563eb', fontSize: 18 },
    emptyText: {
      textAlign: 'center',
      color: '#64748b',
      marginTop: 40,
    },
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ShipmentDetail', { id: item._id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
            {item.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={styles.tracking}>{item.trackingNumber}</Text>
      <View style={styles.route}>
        <Text style={styles.city}>{item.origin.city}</Text>
        <Text style={styles.arrow}>→</Text>
        <Text style={styles.city}>{item.destination.city}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={shipments}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No shipments found</Text>
        }
      />
    </View>
  );
};

export default ShipmentListScreen;