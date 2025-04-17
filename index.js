require('dotenv').config();
const express = require('express');
const plivo = require('plivo');

const app = express();
const client = new plivo.Client(process.env.PLIVO_AUTH_ID, process.env.PLIVO_AUTH_TOKEN);

const numbers = ['+918122516923', '+919442792367']; 
const message = 'Hello there';

app.get('/', async (req, res) => {
    let results = [];

    for (const number of numbers) {
        try {
            const response = await client.messages.create({
                src: process.env.PLIVO_SENDER_ID,
                dst: number,
                text: message,
            });
            const successMsg = `message sent to ${number} (UUID: ${response.messageUuid})`;
            console.log(successMsg);
            results.push(successMsg);
        } catch (err) {
            const errorMsg = `failed to send to ${number}: ${err.message}`;
            console.error(errorMsg);
            results.push(errorMsg);
        }
    }

});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
