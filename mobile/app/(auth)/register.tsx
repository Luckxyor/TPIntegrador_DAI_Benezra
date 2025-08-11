import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { apiClient } from '../../src/api/client';

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!firstName || !lastName || !username || !password) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post('/api/user/register', {
        first_name: firstName,
        last_name: lastName,
        username,
        password,
      });
      if (res.data?.success) {
        Alert.alert('Listo', 'Usuario creado, ahora iniciá sesión');
        router.replace('/(auth)/login');
      } else {
        Alert.alert('Error', res.data?.message || 'No se pudo registrar');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <TextInput placeholder="Nombre" style={styles.input} value={firstName} onChangeText={setFirstName} />
      <TextInput placeholder="Apellido" style={styles.input} value={lastName} onChangeText={setLastName} />
      <TextInput placeholder="Usuario (email)" autoCapitalize="none" keyboardType="email-address" style={styles.input} value={username} onChangeText={setUsername} />
      <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
      <Button title={loading ? 'Creando…' : 'Registrarme'} onPress={onSubmit} disabled={loading} />
      <View style={{ height: 12 }} />
      <Link href="/(auth)/login">Ya tengo cuenta</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});


