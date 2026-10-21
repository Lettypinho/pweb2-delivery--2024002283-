# Delivery Tracker — Prisma + SQLite

Projeto da disciplina de Programação Web II — IFAL/Maceió.

A aplicação Delivery Tracker utiliza arquitetura em camadas, Repository Pattern, injeção de dependência e persistência de dados com Prisma ORM e SQLite.

## Tecnologias

- Node.js
- Express
- Prisma ORM
- SQLite

## Estrutura

```text
src/
├── config/          # configuração do Prisma Client
├── controllers/     # camada HTTP
├── services/        # regras de negócio
├── repositories/    # acesso aos dados
├── routes/          # composição e injeção de dependências
└── utils/

prisma/
├── schema.prisma
└── migrations/
```

## Configuração

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` baseado no `.env.example`:

```env
DATABASE_URL="file:./dev.db"
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Aplique as migrations:

```bash
npx prisma migrate deploy
```

## Executando

```bash
npm start
```

A API ficará disponível em:

```text
http://localhost:3000
```

Health check:

```text
GET /api/health
```

Resposta:

```json
{
  "status": "ok"
}
```

## Testes

Com a aplicação em execução, em outro terminal:

```bash
npm run check
```

O autograder verifica 122 pontos de conformidade da API.

## Persistência

Os dados de entregas, motoristas e históricos são armazenados em SQLite por meio do Prisma ORM.

O arquivo local do banco de dados não é versionado no Git. A estrutura do banco é versionada através de:

```text
prisma/schema.prisma
prisma/migrations/
```

Assim, em um novo ambiente, o banco pode ser criado com:

```bash
npx prisma generate
npx prisma migrate deploy
```

## API

### Entregas

```text
POST  /api/entregas
GET   /api/entregas
GET   /api/entregas/:id
GET   /api/entregas/:id/historico
PATCH /api/entregas/:id/avancar
PATCH /api/entregas/:id/cancelar
PATCH /api/entregas/:id/atribuir
```

### Motoristas

```text
POST /api/motoristas
GET  /api/motoristas
GET  /api/motoristas/:id
GET  /api/motoristas/:id/entregas
```

## Regras principais

- Uma entrega inicia com status `CRIADA`.
- O fluxo normal é `CRIADA → EM_TRANSITO → ENTREGUE`.
- Uma entrega também pode ser cancelada quando permitido pelas regras de negócio.
- O histórico das alterações da entrega é persistido no banco.
- O CPF do motorista é único.
- Apenas motoristas ativos podem ser atribuídos às entregas conforme as regras da aplicação.
- Os dados permanecem disponíveis após reiniciar a aplicação.