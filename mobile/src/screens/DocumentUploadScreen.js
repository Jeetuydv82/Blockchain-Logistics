import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadDocument } from '../services/api';

const DocumentUploadScreen = ({ navigation, route }) => {
  const { shipmentId } = route.params;
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Camera permission is needed');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'document.jpg',
      });
      formData.append('shipmentId', shipmentId);

      await uploadDocument(formData);
      Alert.alert('Success', 'Document uploaded successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
      padding: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: 20,
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#f1f5f9',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 16,
      color: '#1e293b',
      fontWeight: '600',
    },
    buttonPrimary: {
      backgroundColor: '#2563eb',
      borderRadius: 12,
      padding: 16,
      marginTop: 20,
      alignItems: 'center',
    },
    buttonPrimaryText: {
      fontSize: 16,
      color: 'white',
      fontWeight: 'bold',
    },
    imagePreview: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 16,
      backgroundColor: '#f1f5f9',
    },
    selectedText: {
      textAlign: 'center',
      color: '#10b981',
      marginBottom: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Document</Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>📷 Choose from Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>📸 Take Photo</Text>
      </TouchableOpacity>

      {image && (
        <>
          <Text style={styles.selectedText}>Image selected</Text>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={handleUpload}
            disabled={uploading}
          >
            <Text style={styles.buttonPrimaryText}>
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default DocumentUploadScreen;