import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ActivityIndicator, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../src/api/client';

type EventDetail = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  duration_in_minutes: number;
  price: number;
  enabled_for_enrollment: boolean;
  max_assistance: number;
  event_location?: any;
  creator_user?: any;
  tags?: { id: number; name: string }[];
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, refetch } = useQuery<EventDetail>({
    queryKey: ['event', id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/event/${id}`);
      return res.data;
    },
  });

  const enroll = async () => {
    try {
      const res = await apiClient.post(`/api/event/${id}/enrollment`);
      if (res.status === 201) {
        Alert.alert('Listo', 'Te inscribiste al evento');
        refetch();
      } else {
        Alert.alert('Aviso', res.data?.error || 'No se pudo inscribir');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo inscribir');
    }
  };

  const unenroll = async () => {
    try {
      const res = await apiClient.delete(`/api/event/${id}/enrollment`);
      if (res.status === 200) {
        Alert.alert('Listo', 'Cancelaste tu inscripción');
        refetch();
      } else {
        Alert.alert('Aviso', res.data?.error || 'No se pudo cancelar');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo cancelar');
    }
  };

  if (isLoading || !data) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{data.name}</Text>
      <Text style={{ color: '#555', marginBottom: 8 }}>{new Date(data.start_date).toLocaleString()} • {data.duration_in_minutes} min</Text>
      <Text style={{ marginBottom: 12 }}>{data.description}</Text>
      {data.event_location && (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Ubicación</Text>
          <Text>{data.event_location.name}</Text>
          <Text style={{ color: '#555' }}>{data.event_location.full_address}</Text>
          {!!data.event_location.max_capacity && <Text>Capacidad: {data.event_location.max_capacity}</Text>}
        </View>
      )}
      {!!data.tags?.length && (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Tags</Text>
          <Text>{data.tags.map((t) => t.name).join(', ')}</Text>
        </View>
      )}
      <View style={{ height: 12 }} />
      <Button title="Inscribirme" onPress={enroll} />
      <View style={{ height: 8 }} />
      <Button title="Desinscribirme" color="#b00020" onPress={unenroll} />
      <View style={{ height: 16 }} />
      <Button title="Volver" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  block: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
  blockTitle: { fontWeight: '600', marginBottom: 4 },
});


