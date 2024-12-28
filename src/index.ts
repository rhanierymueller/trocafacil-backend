import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import itemRoutes from './routes/itemRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});