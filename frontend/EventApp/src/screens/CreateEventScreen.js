import React, { useState, useEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { eventService } from '../services/eventService';
import { eventLocationService } from '../services/eventLocationService';

export default function CreateEventScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    id_event_category: 1,
    id_event_location: '',
    start_date: new Date(),
    duration_in_minutes: '',
    price: '',
    enabled_for_enrollment: true,
    max_assistance: '',
  });
  
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const response = await eventLocationService.getEventLocations();
      console.log('Event locations response:', response);
      
      // Asegurar que siempre sea un array
      if (Array.isArray(response)) {
        setLocations(response);
      } else if (response && Array.isArray(response.data)) {
        setLocations(response.data);
      } else {
        console.warn('Response is not an array:', response);
        setLocations([]);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
      Alert.alert('Error', 'Error al cargar ubicaciones');
      setLocations([]); // Fallback a array vacío
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.start_date;
    setShowDatePicker(false);
    handleInputChange('start_date', currentDate);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (!formData.id_event_location) {
      Alert.alert('Error', 'Por favor selecciona una ubicación');
      return;
    }

    setLoading(true);
    try {
      await eventService.createEvent({
        ...formData,
        duration_in_minutes: parseInt(formData.duration_in_minutes) || 60,
        price: parseFloat(formData.price) || 0,
        max_assistance: parseInt(formData.max_assistance) || 50,
      });
      
      Alert.alert('Éxito', 'Evento creado correctamente', [
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
            <Text style={styles.label}>Nombre del Evento *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Ingresa el nombre del evento"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Describe el evento"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ubicación *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.id_event_location}
                onValueChange={(value) => handleInputChange('id_event_location', value)}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona una ubicación" value="" />
                {Array.isArray(locations) && locations.map((location) => (
                  <Picker.Item
                    key={location.id}
                    label={location.name}
                    value={location.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fecha y Hora</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formData.start_date.toLocaleDateString('es-ES')} {formData.start_date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.start_date}
                mode="datetime"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Duración (min)</Text>
              <TextInput
                style={styles.input}
                value={formData.duration_in_minutes}
                onChangeText={(value) => handleInputChange('duration_in_minutes', value)}
                placeholder="60"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Precio</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Capacidad Máxima</Text>
            <TextInput
              style={styles.input}
              value={formData.max_assistance}
              onChangeText={(value) => handleInputChange('max_assistance', value)}
              placeholder="50"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creando...' : 'Crear Evento'}
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
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
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
