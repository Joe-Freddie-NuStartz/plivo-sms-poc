require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const plivo = require('plivo');

const app = express();
const client = new plivo.Client(process.env.PLIVO_AUTH_ID, process.env.PLIVO_AUTH_TOKEN);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(`
        <h2>Send SMS to Multiple Numbers</h2>
        <form method="POST" action="/send">
            <label>Phone Numbers (comma separated):</label><br>
            <input type="text" name="to" placeholder="+911234567890, +910987654321" required /><br><br>
            <label>Message:</label><br>
            <textarea name="message" rows="4" cols="30" placeholder="hello world" required></textarea><br><br>
            <button type="submit">Send SMS</button>
        </form>
    `);
});

app.post('/send', async (req, res) => {
    const { to, message } = req.body;
    const numbers = to.split(',').map(num => num.trim()).filter(num => num.length > 0);
    let results = [];

    for (const number of numbers) {
        try {
            const response = await client.messages.create({
                src: process.env.PLIVO_SENDER_ID,
                dst: number,
                text: message,
            });
            results.push(`Message sent to ${number} (UUID: ${response.messageUuid})`);
        } catch (err) {
            results.push(`Failed to send to ${number}: ${err.message}`);
        }
    }

    res.send(`
        <h3>SMS Results:</h3>
        <ul>${results.map(r => `<li>${r}</li>`).join('')}</ul>
        <a href="/">Back</a>
    `);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
