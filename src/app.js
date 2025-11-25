const express = require('express')
const cors = require('cors')
const productsRouter = require('./routes/products')
const authRouter = require('./routes/auth')

const app = express()

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL || 'https://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions))
app.use(express.json())

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

app.get('/', (req, res) => {
    res.json({ message: 'API E-commerce funcionando' })
})

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' })
});

module.exports = app