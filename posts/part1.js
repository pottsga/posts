#!/usr/bin/env node

import { get } from './services/network.js'
import { sendMessage } from './services/apache-active-mq.js';
import { logger } from './services/logging.js';

// The number of posts to fetch from the API endpoint and to send to Apache
// Active MQ per the project specification.
const NUMBER_OF_POSTS = 25

/**
 * Handle fetching a set of posts from the API endpoint.
 */
const handleFetchPostsAndSendToMQ = async () => {
    const postsApiEndpoint = 'https://jsonplaceholder.typicode.com/posts';

    // First, fetch the response from the remote API endpoint
    let posts = await get(postsApiEndpoint);
    posts = posts.slice(0, NUMBER_OF_POSTS); // get only the first n posts per spec. 

    // Handle if there are less than n posts
    if (posts.length < NUMBER_OF_POSTS) {
        logger.info(`Less than ${NUMBER_OF_POSTS} posts were retrieved from ${postsApiEndpoint}. Repeating posts until there are ${NUMBER_OF_POSTS} posts.`)
        // repeat any post until there are n posts in total per spec.

        // Grab the last post and use that to repeat.
        const lastPost = posts.at(-1);
        const difference = NUMBER_OF_POSTS - posts.length;
        logger.debug(`There are ${difference} fewer posts than the expected ${NUMBER_OF_POSTS}.`)

        // Append a post to the posts array to get the number of posts to the 
        // required length.
        for (let i = 0; i < difference; i++) {
            logger.debug(`Adding post.`)
            posts.push(lastPost);
        }
        logger.info(`Successfully repeated posts ${difference} times.`)
    }

    // The options to connect to Apache Active MQ with.
    const apacheActiveMQConnectOptions = {
        'host': process.env.APACHE_ACTIVE_MQ_HOST,
        'port': process.env.APACHE_ACTIVE_MQ_PORT,
    };

    // Iterate over the posts and asyncronously send them to Apache Active MQ.
    for (const post of posts) {
        sendMessage(
            JSON.stringify(post),
            // default to posts if there wasn't an environment variable in place
            process.env.APACHE_ACTIVE_MQ_QUEUE_NAME || 'posts',
            apacheActiveMQConnectOptions
        );
    }
}

// Call the function to fetch the posts and send them to Apache Active MQ.
handleFetchPostsAndSendToMQ();