import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Button,
} from 'react-native';

// Altere o valor da constante para o IP da sua máquina, lembre-se que deve ser uma string
const ip_address = '';

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

  useEffect(() => {
    fetchOrders();
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
        <Button title="Todos" onPress={() => handleFilterChange('')} />
        <Button
          title="Pendente"
          onPress={() => handleFilterChange('Pendente')}
        />
        <Button
          title="Em Andamento"
          onPress={() => handleFilterChange('Em Andamento')}
        />
        <Button
          title="Concluído"
          onPress={() => handleFilterChange('Concluído')}
        />
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
    justifyContent: 'space-around',
    marginBottom: 20,
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
});
