import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../../../src/context/AuthContext';

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>Perfil</Text>
      {user ? (
        <>
          <Text>Nombre: {user.first_name} {user.last_name}</Text>
          <Text>Usuario: {user.username}</Text>
        </>
      ) : (
        <Text>Sesión activa</Text>
      )}
      <View style={{ height: 16 }} />
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}


