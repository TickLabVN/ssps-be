# Student Smart Printing Service 

[![formatter: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) ![CI](https://github.com/phucvinh57/fastify-template/actions/workflows/ci.yml/badge.svg) ![Deploy](https://github.com/phucvinh57/fastify-template/actions/workflows/release.yml/badge.svg)

## Prerequisites

- `docker` v20.10.22
- `docker-compose` v1.29.2
- `node` v18.13.0
- `npm` 8.19.3
- `cups` 2.4.1
- `cups-pdf` 3.0.1-14 (Virtual printer in case your computer is not connected to any actual printer)

## Commands

- `yarn bootstrap`: Set up development
- `yarn barrels`: Gather export objects from many files in a folder and re-export in `index.ts` file. See configs in `.barrelsby.json`.
- `yarn start`: Start application in dev mode
- `yarn db:migrate`: Apply new migration to current database
- `yarn db:reset`: Reset database and run seed
- `yarn db:deploy`: Deploy all migrations without confirmations (use in production)
- `yarn db:generate`: Just generate prisma client library
- `yarn db:studio`: Interact with database by a web UI
- `yarn lint`: Check linting
- `yarn format`: Format code
- `yarn start:docker`: Run `docker-compose.dev.yml` file to set up local database
- `yarn clean:docker`: Remove local database instance include its data.
- `yarn clean:git`: Clean local branches which were merged on remote

## Project structure

```py
📦prisma
 ┣ 📂migrations     # All SQL migration scripts go here
 ┣ 📜schema.prisma  # Database schema declaration
 ┗ 📜seed.ts        # Generate sample data script
📦src
 ┣ 📂configs        # Contain environment variables & other app configurations
 ┣ 📂constants      # Constants and enums go here
 ┣ 📂dtos           # Schema for input (from requests) & output (from responses)
 ┃ ┣ 📂in
 ┃ ┗ 📂out
 ┣ 📂handlers       # Handlers, which are responsible for handling core business logic
 ┣ 📂interfaces     # Interfaces
 ┣ 📂middlewares    # Middlewares such as logging or verifying tokens
 ┣ 📂plugins        # Plugin, in charge of organizing api routings & registering middleware
 ┣ 📂repositories   # Datasource configurations & connections. Could have more than one datasource.
 ┣ 📂services       # 3rd-party services or business logic services
 ┣ 📂types          # Types
 ┣ 📂utils          # Helping classes and functions
 ┣ 📜Server.ts      # Server setting & binding modules
 ┗ 📜index.ts       # Program entry
```


## Setup and Run Instructions

### Step 1: Set up Environment Variables
Create a .env file and fill it with the required environment variables. Ensure you replace placeholders like with the actual values.  
Note: Fill in `.env` file (use template from `.env.example`) before starts.  
For example:

``` .env
FASTIFY_PORT=3000
FASTIFY_TEST_PORT=3001

POSTGRES_USER=db_user
POSTGRES_PASSWORD=db_password
POSTGRES_DB=ssps_db
POSTGRES_PORT=5432
POSTGRES_TEST_PORT=5433
POSTGRES_URL=postgresql://db_user:db_password@localhost:5432/ssps_db

# ... (Other environment variables)
```

### Step 2: Run Bootstrap Command
Run the following command to set up the development environment:
```sh
yarn bootstrap
```
This command will likely install dependencies, set up configurations, and perform other necessary tasks.

### Step 3: Start the Application
Run the following command to start the application:
```sh
yarn start
```
This command will start your Node.js application. Ensure that ports 5432 and 8080 are available and not in use by other processes.