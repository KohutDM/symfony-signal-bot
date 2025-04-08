const http = require('http');
const axios = require('axios');
const SIGNAL_API_URL = 'signal-api';
const SIGNAL_API_PORT = 8080;
const YOUR_PHONE_NUMBER = '+380633499278';
const SYMFONY_URL = 'http://nginx:80/signal/message'; // URL Symfony

console.log(`SIGNAL_API_URL: ${SIGNAL_API_URL}`);

function sendSignalMessage(recipient, message) {
    console.log(recipient);
    const postData = JSON.stringify({
        message: message,
        number: YOUR_PHONE_NUMBER,
        recipients: [recipient],
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
            console.log('Message sent successfully. Status code:', res.statusCode, 'Data:', data);
        });
    });

    req.on('error', (error) => {
        console.error('Error sending message:', error.message);
    });

    req.write(postData);
    req.end();
}

function receiveSignalMessages() {
    const options = {
        hostname: SIGNAL_API_URL,
        port: SIGNAL_API_PORT,
        path: `/v1/receive/${YOUR_PHONE_NUMBER}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('Received data: ', data);
            try {
                const messages = JSON.parse(data);
                if (messages && messages.length > 0) {
                    messages.forEach((messageObject) => {
                        sendToSymfony(messageObject, messageObject.envelope.sourceNumber);
                    });
                }
            } catch (error) {
                console.error('Error parsing received messages:', error.message);
            }
        });
    });

    req.on('error', (error) => {
        console.error('Error receiving messages:', error.message);
    });

    req.end();
}

function sendToSymfony(messageObject, recipient) {
    axios.post(SYMFONY_URL, messageObject)
        .then(response => {
            console.log('Response from Symfony:', response.data);
            sendSignalMessage(recipient, response.data.response);
        })
        .catch(error => {
            console.error('Error sending data to Symfony:', error.message);
        });
}

setInterval(receiveSignalMessages, 1000);
