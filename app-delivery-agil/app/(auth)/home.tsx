import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import io from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';

const ip_address = '192.168.0.13';

export default function Home() {
  interface Order {
    id: number;
    name: string;
    products: string[];
    address: string;
    status: 'Pendente' | 'Em Andamento' | 'Concluído';
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const socket = io(`http://${ip_address}:3000`);
  const navigation = useNavigation();

  useEffect(() => {
    fetchOrders();

    socket.on('orderCreated', (newOrder: Order) => {
      setOrders((prevOrders) => {
        const exists = prevOrders.some((order) => order.id === newOrder.id);
        const matchesFilter = !statusFilter || newOrder.status === statusFilter;
        return exists || !matchesFilter
          ? prevOrders
          : [...prevOrders, newOrder];
      });
    });

    socket.on('orderUpdated', (updatedOrder: Order) => {
      setOrders((prevOrders) => {
        const matchesFilter =
          !statusFilter || updatedOrder.status === statusFilter;

        if (matchesFilter) {
          return prevOrders.some((order) => order.id === updatedOrder.id)
            ? prevOrders.map((order) =>
                order.id === updatedOrder.id ? updatedOrder : order
              )
            : [...prevOrders, updatedOrder];
        } else {
          return prevOrders.filter((order) => order.id !== updatedOrder.id);
        }
      });
    });

    socket.on('orderDeleted', (deletedOrderId: number) => {
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== deletedOrderId)
      );
    });

    return () => {
      socket.off('orderCreated');
      socket.off('orderUpdated');
      socket.off('orderDeleted');
    };
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://${ip_address}:3000/orders/`);
      const data = await response.json();

      const filteredOrders = statusFilter
        ? data.filter((order: Order) => order.status === statusFilter)
        : data;

      setOrders(filteredOrders);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <View style={styles.container}>
      <View style={styles.span}>
        <Text style={styles.title}>Pedidos</Text>
        <Link href="/settings">Configurações</Link>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => handleFilterChange('')}>
          <Text style={styles.filterButton}>ALL</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilterChange('Pendente')}>
          <Text style={styles.filterButton}>PENDENTE</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilterChange('Em Andamento')}>
          <Text style={styles.filterButton}>EM ANDAMENTO</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilterChange('Concluído')}>
          <Text style={styles.filterButton}>CONCLUÍDO</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text>Cliente: {item.name}</Text>
              <Text>Produtos: {item.products.join(', ')}</Text>
              <Text>Endereço: {item.address}</Text>
              <Text>Status: {item.status}</Text>
              <TouchableOpacity
                style={styles.orderButton}
                onPress={() =>
                  navigation.navigate('delivery', { orderId: item.id })
                }
              >
                <Text style={styles.orderButtonText}>Ver Entrega</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#8B0000',
    color: '#fff',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 5,
  },
  orderItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  span: {
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderButton: {
    backgroundColor: '#8B0000',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
