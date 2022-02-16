import stompit from 'stompit';

import { logger } from './logging.js';

/**
 * Send a message to Apache Active MQ.
 * @param {string} message The message to send to apache active mq
 * @param {string} queue The name of the queue in apache active mq
 * @param {object} options The options to override default connect options to apache active mq
 */
const sendMessage = async (message, queue, options) => {
    // Use stomp protocol to connect to apache active mq per the options object.
    logger.debug('Attempting to connect to Apache Active MQ')
    stompit.connect(options, (err, client) => {

        // If there was an error, show that message in the console and stop.
        if (err) {
            logger.error('Error connecting to Apache Active MQ: ' + err.message);
            process.exit();
        }
        logger.debug('Successfully connected to Apache Active MQ')

        // Configure the send headers before sending the message to active mq
        const sendHeaders = {
            'destination': `/queue/${queue}`,
            'content-type': 'text/plain'
        };

        // Send the message that was passed in to Apache Active MQ with the frame 
        // object created below.
        const frame = client.send(sendHeaders);
        // Convert the post into a JSON string to send to the message queue
        // frame.write(JSON.stringify(message));
        frame.write(message);
        frame.end()
        logger.info('Successfully sent message to Apache Active MQ')

        logger.debug('Attempting to disconnect from Apache Active MQ')
        client.disconnect();
        logger.debug('Successfully disconnected from Apache Active MQ')
    });
}

/**
 * Subscribe to a queue in AMQ
 * @param {string} queue The name of the queue in apache active mq
 * @param {object} options The options to override default connect options to apache active mq
 * @param {function} hook The hook function to call when a message is received.
 */
const subscribe = async (queue, options, hook) => {
    // Use stomp protocol to connect to apache active mq per the options object.
    logger.debug('Attempting to connect to Apache Active MQ')
    stompit.connect(options, (err, client) => {

        // If there was an error, show that message in the console and stop.
        if (err) {
            logger.error('Error connecting to Apache Active MQ: ' + err.message);
            process.exit();
        }
        logger.debug('Successfully connected to Apache Active MQ')

        const subscribeHeaders = {
            'destination': `/queue/${queue}`,
            'ack': 'client-individual'
        }

        client.subscribe(subscribeHeaders, (err, message) => {
            // If there was an error, show that message in the console and stop.
            if (err) {
                logger.error(`Error subscribing to Apache Active MQ queue '${queue}: ${err.message}`);
                process.exit();
            }
            message.readString('utf-8', (err, body) => {
                if (err) {
                    logger.error(`Error reading message from Apache Active MQ queue '${queue}: ${err.message}`);
                    process.exit();
                }
                // Call the hook function to react to this new message
                hook(body)

                // Acknowledge message was received
                client.ack(message)
            })
        })
    })
}

export { sendMessage, subscribe }
