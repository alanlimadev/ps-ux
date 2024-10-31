import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';

// Altere o valor da constante para o IP da sua máquina
const ip_address = '192.168.0.13';

interface Order {
  id: number;
  name: string;
  products: string[];
  address: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
}

const deliveryStartLocation = {
  latitude: -3.6892,
  longitude: -40.355,
  address: 'Av. Monsenhor José Aloísio Pinto, 300, Dom Expedito, Sobral',
};

export default function Delivery() {
  const route = useRoute();
  const { orderId } = route.params as { orderId: number };
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://${ip_address}:3000/orders/${orderId}`
      );
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    newStatus: 'Em Andamento' | 'Concluído'
  ) => {
    try {
      await fetch(`http://${ip_address}:3000/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrder((prevOrder) =>
        prevOrder ? { ...prevOrder, status: newStatus } : null
      );
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
    }
  };

  const openGoogleMaps = () => {
    if (order) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        deliveryStartLocation.address
      )}&destination=${encodeURIComponent(order.address)}`;
      Linking.openURL(url);
    }
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (!order) {
    return <Text>Pedido não encontrado.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Pedido</Text>
      <Text>Cliente: {order.name}</Text>
      <Text>Produtos: {order.products.join(', ')}</Text>
      <Text>Endereço: {order.address}</Text>
      <Text>Status: {order.status}</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: deliveryStartLocation.latitude,
          longitude: deliveryStartLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{
            latitude: deliveryStartLocation.latitude,
            longitude: deliveryStartLocation.longitude,
          }}
          title="Ponto de Partida"
          description={deliveryStartLocation.address}
          pinColor="blue"
        />
        <Marker
          coordinate={{
            latitude: -23.5505,
            longitude: -46.6333,
          }}
          title="Destino"
          description={order.address}
        />
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            order.status !== 'Pendente' && styles.buttonDisabled,
          ]}
          onPress={() => handleStatusChange('Em Andamento')}
          disabled={order.status !== 'Pendente'}
        >
          <Text style={styles.buttonText}>Saindo para a Entrega</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleStatusChange('Concluído')}
        >
          <Text style={styles.buttonText}>Pedido Entregue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={openGoogleMaps}>
          <Text style={styles.buttonText}>Abrir no Google Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  map: {
    height: 200,
    marginVertical: 16,
  },
  buttonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#800000',
    borderRadius: 8,
    padding: 12,
    width: '80%',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
