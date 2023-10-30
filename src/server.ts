import dotenv from 'dotenv';

import app from './app'

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT ?? 3000

const server = app.listen(SERVER_PORT, () => {
    console.log("Server is running on port", SERVER_PORT)
})

export default server;