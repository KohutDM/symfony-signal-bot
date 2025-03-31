const http = require('http');

const SIGNAL_API_URL = 'signal-api';
const SIGNAL_API_PORT = 8080;
const YOUR_PHONE_NUMBER = '+380633499278';

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
            'Accept': 'application/json',
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
                        if (messageObject.envelope.dataMessage
                            && messageObject.envelope.dataMessage.message
                            && messageObject.envelope.dataMessage.message.toLowerCase().includes('hello')) {
                            sendSignalMessage(
                                messageObject.envelope.sourceNumber,
                                'Hi! I`m glad to hear you, ' + messageObject.envelope.sourceName
                            );
                        }
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

setInterval(receiveSignalMessages, 10000);

setInterval(() => {
    console.log('Bot is running...');
}, 60000);
