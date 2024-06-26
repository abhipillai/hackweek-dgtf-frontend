const express = require('express');
const axios = require('axios');
const cors = require('cors');
const crypto = require('node:crypto');
const dotenv = require('dotenv');
const app = express();

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;

const API_KEY = process.env.API_KEY;

app.use(cors());

app.use(express.json());

app.get(`/api/payments/:paymentId`, async (req, res) => {
    try {
        const { paymentId } = req.params;
        const response = await axios.get(
            `${process.env.API_URL}/v2/payments/${paymentId}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.API_KEY}`,
                },    
            }
            );
        res.json(response.data);
      } catch (error) {
        console.error('Error fetching QR code:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
});

app.post('/api/payments', async (req, res) => {
  try {
    const response = await axios.post(
        `${process.env.API_URL}/v2/payments`,
        JSON.stringify({
            amount_money: {
                amount: parseInt(req.body.amount),
                currency: req.body.currency,
            },
            idempotency_key: crypto.randomUUID(),
            autocomplete: true,
            source_id: "ASYNC_TRANSACTION",
            async_transaction_creation_details: {
                type: "JAPAN_QR_CODE",
            },
        }),
        {
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },    
        }
        );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});