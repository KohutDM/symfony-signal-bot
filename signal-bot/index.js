const http = require('http');

const SIGNAL_API_URL = 'signal-api';
const SIGNAL_API_PORT = 8080;
const YOUR_PHONE_NUMBER = '+380633499278';
const RECIPIENT_NUMBER = '+380688433139';

console.log(`SIGNAL_API_URL: ${SIGNAL_API_URL}`);

function sendSignalMessage() {
    const postData = JSON.stringify({
        message: 'Hello from Signal Bot via HTTP!',
        number: YOUR_PHONE_NUMBER,
        recipients: [RECIPIENT_NUMBER],
    });

    const options = {
        hostname: SIGNAL_API_URL,
        port: SIGNAL_API_PORT,
        path: '/v2/send',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
        },
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('Message sent successfully:', data);
        });
    });

    req.on('error', (error) => {
        console.error('Error sending message:', error.message);
    });

    req.write(postData);
    req.end();
}

// Виконувати команду кожні 30 секунд
setInterval(sendSignalMessage, 30000);

// Нескінченний цикл
setInterval(() => {
    console.log('Bot is running...');
}, 60000);
