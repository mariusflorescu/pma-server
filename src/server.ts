import "reflect-metadata";
import express from 'express';
import morgan from 'morgan'
import { createConnection } from "typeorm";
import dotenv from 'dotenv'

dotenv.config()

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/',(_,res) => res.send('Hello form server'));

app.listen(5000, async () => {
    console.log(`Server running on localhost:${process.env.PORT}`);

    try {
        await createConnection()
        console.log('Database connected successfully');
    } catch (err) {
        console.log(err);
    }
})
