import express from 'express';
import dotenv from 'dotenv'

const app = express()

dotenv.config()

const port = process.env.PORT || 5000;

console.log(process.env.MONGO_URL)

app.listen(port,()=>console.log(`Server started at ${port}`))