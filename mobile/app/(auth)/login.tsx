import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Ingresá usuario y contraseña');
      return;
    }
    setLoading(true);
    const ok = await login({ username, password });
    setLoading(false);
    if (ok) {
      router.replace('/(app)/events');
    } else {
      Alert.alert('Error', 'Usuario o clave inválida');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TP Integrador - Login</Text>
      <TextInput
        placeholder="Usuario (email)"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? 'Ingresando…' : 'Ingresar'} onPress={onSubmit} disabled={loading} />
      <View style={{ height: 12 }} />
      <Link href="/(auth)/register">¿No tenés cuenta? Registrate</Link>
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


