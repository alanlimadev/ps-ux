export class Order {
  id: number;
  name: string;
  products: string[];
  address: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
}
