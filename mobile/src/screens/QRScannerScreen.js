import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const QRScannerScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, []);

  const handleQRCode = (code) => {
    try {
      let trackingNumber = code;
      if (code.includes('/track/')) {
        const parts = code.split('/track/');
        trackingNumber = parts[parts.length - 1];
      }
      
      if (trackingNumber.startsWith('SHP-')) {
        navigation.replace('PublicTracker', { trackingNumber });
      } else {
        navigation.replace('PublicTracker', { trackingNumber });
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid QR code');
    }
  };

  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      Alert.alert('Error', 'Please enter a tracking number');
      return;
    }
    handleQRCode(manualCode.trim());
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    camera: {
      flex: 1,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scanArea: {
      width: 250,
      height: 250,
      borderWidth: 2,
      borderColor: '#fff',
      borderRadius: 12,
      backgroundColor: 'transparent',
    },
    instruction: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },
    manualSection: {
      backgroundColor: '#f8fafc',
      margin: 16,
      padding: 20,
      borderRadius: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: 12,
      textAlign: 'center',
    },
    input: {
      backgroundColor: '#f1f5f9',
      borderRadius: 8,
      padding: 14,
      fontSize: 16,
      marginBottom: 12,
      color: '#1e293b',
    },
    button: {
      backgroundColor: '#2563eb',
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  if (!permission?.granted) {
    return (
      <View style={styles.manualSection}>
        <Text style={styles.title}>QR Scanner</Text>
        <Text style={{ textAlign: 'center', color: '#64748b', marginBottom: 16 }}>
          Camera permission required
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        
        <View style={{ marginTop: 20 }}>
          <Text style={{ textAlign: 'center', color: '#64748b', marginBottom: 8 }}>
            Or enter manually
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Tracking number"
            value={manualCode}
            onChangeText={setManualCode}
          />
          <TouchableOpacity style={styles.button} onPress={handleManualSubmit}>
            <Text style={styles.buttonText}>Track</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarCodeScanned={({ data }) => handleQRCode(data)}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
        <Text style={styles.instruction}>Point camera at QR code</Text>
      </View>

      <View style={styles.manualSection}>
        <Text style={styles.title}>Or enter manually</Text>
        <TextInput
          style={styles.input}
          placeholder="Tracking number"
          value={manualCode}
          onChangeText={setManualCode}
        />
        <TouchableOpacity style={styles.button} onPress={handleManualSubmit}>
          <Text style={styles.buttonText}>Track Shipment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QRScannerScreen;