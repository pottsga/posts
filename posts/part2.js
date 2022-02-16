#!/usr/bin/env node

import { subscribe } from "./services/apache-active-mq.js";
import { writePostToDatabase } from './models/post.js';

/**
 * Handle subscribing to the posts queue in Apache AMQ, which in turn writes the
 * user to the database upon message receipt. This function will pass a hook to
 * the subscribe function that will be called upon message receipt.
 */
const handleSubscribeToAMQAndWriteToDatabase = async () => {
    const apacheActiveMQConnectOptions = {
        'host': process.env.APACHE_ACTIVE_MQ_HOST,
        'port': process.env.APACHE_ACTIVE_MQ_PORT,
        "connectHeaders": {
            "heart-beat": "5000,5000", // heart-beat of 5 seconds
        }
    };

    // Subscribe to the AMQ posts queue. This will listen for new messages constantly.
    // It will call the hook function passed, which in our case will write the post
    // to the database
    subscribe(
        process.env.APACHE_ACTIVE_MQ_QUEUE_NAME,
        apacheActiveMQConnectOptions,
        writePostToDatabase
    );
}

// Call the function to subscribe to post messages from Apache Active MQ
handleSubscribeToAMQAndWriteToDatabase();