import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../src/api/client';

type EventItem = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  event_location?: any;
};

type EventsResponse = {
  collection: EventItem[];
  pagination: { offset: number; limit: number; total: number };
};

export default function EventsListScreen() {
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const { data, isFetching, refetch, isLoading } = useQuery<EventsResponse>({
    queryKey: ['events', search, offset],
    queryFn: async () => {
      const params: any = { limit, offset };
      if (search) params.name = search;
      const res = await apiClient.get('/api/event', { params });
      return res.data;
    },
  });

  const events = data?.collection ?? [];
  const total = data?.pagination?.total ?? 0;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>Eventos</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <TextInput placeholder="Buscar por nombre" style={styles.input} value={search} onChangeText={setSearch} />
        <Button title="Buscar" onPress={() => { setOffset(0); refetch(); }} />
      </View>
      {(isLoading || isFetching) && events.length === 0 ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Link asChild href={`/(app)/events/${item.id}`}>
              <TouchableOpacity style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text numberOfLines={2} style={{ color: '#555' }}>{item.description}</Text>
                <Text style={{ marginTop: 4, color: '#333' }}>{new Date(item.start_date).toLocaleString()}</Text>
              </TouchableOpacity>
            </Link>
          )}
          ListEmptyComponent={<Text>No hay eventos</Text>}
        />
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <Button title="Anterior" disabled={offset === 0} onPress={() => setOffset(Math.max(0, offset - limit))} />
        <Text style={{ alignSelf: 'center' }}>{events.length > 0 ? `${offset + 1}-${Math.min(offset + limit, total)} de ${total}` : ''}</Text>
        <Button title="Siguiente" disabled={offset + limit >= total} onPress={() => setOffset(offset + limit)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
});


