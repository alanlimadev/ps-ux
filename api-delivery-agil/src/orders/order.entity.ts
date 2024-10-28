export class Order {
  id: number;
  name: string;
  products: string[];
  address: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';

  constructor(
    id: number,
    name: string,
    products: string[] = [],
    address: string = '',
    status: 'Pendente' | 'Em Andamento' | 'Concluído' = 'Pendente',
  ) {
    this.id = id;
    this.name = name;
    this.products = products;
    this.address = address;
    this.status = status;
  }
}
