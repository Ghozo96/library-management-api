# Setup
- Run `npm i`
- Make sure MySQL service is running locally (has to be MySQL not PostgreSQL)
- Add DATABASE_URL to env file
- cd into src
- Run `npx prisma push db` to create tables in database based on Prisma Schema
- Run `npx prisma generate` to generate Prisma Client
- Run `npm run dev` to run server

# Documentation
- Postman collection documents all inputs and outputs of all endpoints (under `postman` directory)