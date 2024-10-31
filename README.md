# Processo Seletivo UX Mobile
Descrição do desafio técnico: imagine que você foi contratado com desenvolvedor para criar um aplicativo para entregadores de delivery, a empresa em questão está expandindo os seus negócios e quadruplicou o número de entregadores. Com isso, ela deseja permitir aos seus entregadores gerenciar suas entregas diárias de forma ágil.

## Stack utilizada

**App:** React Native

**Back-end:** Nestjs e WebSocket

# Instalação do Projeto

Este projeto possui duas partes: um aplicativo mobile feito com React Native (Expo Router) e um backend feito com NestJS.

## Rodando localmente

Clone o projeto e entre na pasta principal:

```bash
git clone https://github.com/alanlimadev/ps-ux
cd ps-ux
````

### Rodar o aplicativo

```bash
cd app-delivery-agil
npm install
npx expo start
````

### Rodar a API

```bash
cd app-delivery-agil
npm install
npm run start
````
porta: http://localhost:3000/

## Documentação da API

#### Cria um novo pedido
```http
  POST /orders
```

#### Atualizar pedido

```http
  PUT /orders/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `number` | **Obrigatório**. O ID do item que você quer atualizar |

#### Deletar pedido

```http
  PUT /orders/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `number` | **Obrigatório**. O ID do item que você quer deletar |

#### Retornar todos os pedidos

```http
  GET /orders
```

#### Retornar um pedido

```http
  GET /orders/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `number` | **Obrigatório**. O ID do item que você quer |


