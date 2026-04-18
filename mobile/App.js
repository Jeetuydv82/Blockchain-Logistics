import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import ShipmentListScreen from './screens/ShipmentListScreen';
import ShipmentDetailScreen from './screens/ShipmentDetailScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import DocumentUploadScreen from './screens/DocumentUploadScreen';
import PublicTrackerScreen from './screens/PublicTrackerScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ShipmentList" 
          component={ShipmentListScreen}
          options={{ title: 'My Shipments' }}
        />
        <Stack.Screen 
          name="ShipmentDetail" 
          component={ShipmentDetailScreen}
          options={{ title: 'Shipment Details' }}
        />
        <Stack.Screen 
          name="QRScanner" 
          component={QRScannerScreen}
          options={{ title: 'Scan QR', headerShown: false }}
        />
        <Stack.Screen 
          name="DocumentUpload" 
          component={DocumentUploadScreen}
          options={{ title: 'Upload Document' }}
        />
        <Stack.Screen 
          name="PublicTracker" 
          component={PublicTrackerScreen}
          options={{ title: 'Track Shipment' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;