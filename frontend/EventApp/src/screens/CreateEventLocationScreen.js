import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { eventLocationService } from '../services/eventLocationService';

export default function CreateEventLocationScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    full_address: '',
    max_capacity: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.full_address.trim()) {
      Alert.alert('Error', 'Por favor completa al menos el nombre y la dirección');
      return;
    }

    setLoading(true);
    try {
      const locationData = {
        ...formData,
        max_capacity: parseInt(formData.max_capacity) || 100,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      await eventLocationService.createEventLocation(locationData);
      
      Alert.alert('Éxito', 'Ubicación creada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre de la Ubicación *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Ej: Auditorio Principal"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dirección Completa *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.full_address}
              onChangeText={(value) => handleInputChange('full_address', value)}
              placeholder="Ingresa la dirección completa"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Capacidad Máxima</Text>
            <TextInput
              style={styles.input}
              value={formData.max_capacity}
              onChangeText={(value) => handleInputChange('max_capacity', value)}
              placeholder="100"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.sectionTitle}>
            <Text style={styles.sectionText}>Coordenadas (Opcional)</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Latitud</Text>
              <TextInput
                style={styles.input}
                value={formData.latitude}
                onChangeText={(value) => handleInputChange('latitude', value)}
                placeholder="-34.6037"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Longitud</Text>
              <TextInput
                style={styles.input}
                value={formData.longitude}
                onChangeText={(value) => handleInputChange('longitude', value)}
                placeholder="-58.3816"
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creando...' : 'Crear Ubicación'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -5,
  },
  sectionTitle: {
    marginVertical: 10,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
