# Expenses API

Read the requirements for the project [here](./Requirements.md)

## Tech stack

- Nest.js
- Prisma - ORM
- PostgreSQL in Docker
- Class-validator - for validation
- Jest - testing

Development environment:

- Husky - git hooks
- commitlint - commit message validation
- lint-staged - lint in staged
- ESLint
- Prettier
- EditorConfig

## Local run

Install packages:

```sh
yarn install
```

Start Docker:

```sh
docker compose up -d
```

> or user your own database, but then you will need to update .env file

Start servicer:

```sh
yarn start
```

Run test:

```sh
yarn test
```

## Development steps

- [x] initialize the project
- [x] add husky, commitlint, etc.
- [x] define entities
  - [x] User
  - [x] Session
  - [x] ExpenseCategory
  - [x] Transaction
- [x] setup Prisma
- [x] add Postgres in Docker
- [x] setup Swagger
- [x] create `Auth` modules
  - [x] endpoints
    - [x] POST register
    - [x] POST login
    - [x] GET logout
    - [x] GET refresh
    - [x] GET sessions
    - [x] DELETE delete session
    - [x] POST update session
    - [x] POST change password
  - [x] write Swagger docs
  - [x] write e2e tests
- [ ] create `Expense` module
  - [ ] endpoints
    - [ ] POST transaction
    - [ ] PATCH transaction
    - [ ] DELETE transaction
    - [ ] GET transactions
    - [ ] GET ballance (get the current balance)
  - [ ] write Swagger docs
  - [ ] write e2e tests
- [ ] deploy
