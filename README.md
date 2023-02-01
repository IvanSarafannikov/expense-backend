# Expenses API

Read the requirements for the project [here](./Requirements.md)

## Tech stack

- Nest.js

## Development steps

- [x] initialize the project
- [x] add husky, commitlint, etc.
- [ ] define entities
  - [ ] User
  - [ ] Session
  - [ ] ExpenseCategory
  - [ ] Transaction
- [ ] create `Auth` modules
  - [ ] endpoints
    - [ ] POST register
    - [ ] POST login
    - [ ] GET logout
    - [ ] GET refresh
    - [ ] DELETE delete session
    - [ ] POST update session
    - [ ] POST change password
  - [ ] write Swagger docs
  - [ ] write e2e tests
- [ ] create `Expense` module
  - [ ] endpoints
    - [ ] POST transaction
    - [ ] PATCH transaction
    - [ ] DELETE transaction
    - [ ] GET transactions
    - [ ] GET ballance (get the current balance)
  - [ ] write Swagger docs
  - [ ] write e2e tests
