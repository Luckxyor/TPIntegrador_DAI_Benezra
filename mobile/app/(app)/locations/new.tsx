import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { apiClient } from '../../../src/api/client';

export default function NewLocationScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [idLocation, setIdLocation] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name || !idLocation) {
      Alert.alert('Error', 'Nombre e id_location son obligatorios');
      return;
    }
    setLoading(true);
    try {
      const payload: any = {
        id_location: Number(idLocation),
        name,
        full_address: fullAddress,
        max_capacity: maxCapacity ? Number(maxCapacity) : null,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
      };
      const res = await apiClient.post('/api/event-location', payload);
      if (res.status === 201) {
        Alert.alert('Listo', 'Ubicación creada');
        router.replace('/(app)/locations');
      } else {
        Alert.alert('Error', res.data?.message || 'No se pudo crear');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'No se pudo crear');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>Nueva ubicación</Text>
      <TextInput placeholder="Nombre" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Dirección completa" style={styles.input} value={fullAddress} onChangeText={setFullAddress} />
      <TextInput placeholder="ID de location base (locations.id)" style={styles.input} keyboardType="numeric" value={idLocation} onChangeText={setIdLocation} />
      <TextInput placeholder="Capacidad máxima (opcional)" style={styles.input} keyboardType="numeric" value={maxCapacity} onChangeText={setMaxCapacity} />
      <TextInput placeholder="Latitud (opcional)" style={styles.input} keyboardType="numeric" value={latitude} onChangeText={setLatitude} />
      <TextInput placeholder="Longitud (opcional)" style={styles.input} keyboardType="numeric" value={longitude} onChangeText={setLongitude} />
      <Button title={loading ? 'Creando…' : 'Crear'} onPress={onSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
});


