# Delivery Tracker — Interface Web com EJS

Projeto da disciplina de Programação Web II — IFAL/Maceió.

O Delivery Tracker é uma aplicação web para gerenciamento de entregas e motoristas. A aplicação utiliza renderização no servidor (SSR) com EJS, persistência de dados com Prisma ORM e SQLite e arquitetura em camadas.

## Tecnologias

- Node.js
- Express
- EJS
- Express EJS Layouts
- Prisma ORM
- SQLite
- Express Session
- Connect Flash
- Method Override
- Express Validator

## Funcionalidades

- Cadastro de entregas
- Listagem de entregas
- Filtro de entregas por status
- Visualização dos detalhes de uma entrega
- Histórico de alterações
- Avanço do status da entrega
- Cancelamento de entregas
- Cadastro de motoristas
- Atribuição de motorista a uma entrega
- Validação de formulários
- Mensagens flash de sucesso e erro
- Padrão Post/Redirect/Get (PRG)
- Páginas de erro em HTML

## Estrutura

```text
src/
├── config/
├── controllers/
├── repositories/
├── routes/
├── services/
├── utils/
└── views/
    ├── layouts/
    ├── partials/
    ├── entregas/
    └── motoristas/

prisma/
├── schema.prisma
└── migrations/

public/
└── css/