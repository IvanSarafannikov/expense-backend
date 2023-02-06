# Expenses API

Read the requirements for the project [here](./Requirements.md)

The project implements two modules:

- authorization
- expenses

**Authorization** module allows:

- register new users
- log-in user
- log-out user
- refresh tokens
- change password
- get sessions
- update session
- delete session

Once the user changes the password, all sessions will be deleted.

**Expenses** module allows:

- create own expense category
- get own expense categories
- update own expense category
- delete own expense category
- create transaction
- get transactions
- update transaction
- delete transaction
- get ballance
- create base expense category (available only for admin)
- get base expense category (available only for admin)
- update base expense category (available only for admin)
- delete base expense category (available only for admin)

The `expense category` is specific to each user, which means that if I create my own expense category, only I can interact with it.

The `base expense category` is general list of categories that automatically generates once user register. This means that each user will have a list of default categories like:

- Others
- Food
- Transport
- Shopping

If a user deletes their own expense category, then all transactions related to this category will be moved to the `Other` expense category.

## Tech stack

- Nest.js
- Prisma - ORM
- PostgreSQL in Docker - database
- Class-validator - validation
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

Run migrations:

```sh
yarn migrate:dev
```

Start servicer:

```sh
yarn start
```

Run test:

```sh
yarn test
```
