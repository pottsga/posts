import axios from 'axios';

import { logger } from './logging.js';

/**
 * Perform a GET request on the passed in URL endpoint and return the response 
 * retrieved from that endpoint.
 * @param {string} url The remote API endpoint to perform a GET request on.
 * @returns {object} An object that represents the response fetched from the url passed in.
 */
const get = async (url) => {
    try {
        logger.debug(`Attempting to issue GET request to url ${url}`)
        // Fetch the response from the api endpoint
        const response = await axios.get(url);

        if (response.status !== 200) {
            throw 'Did not receive a 200 OK response from endpoint'
        }
        logger.debug(`Received 200 OK response from url ${url}`)

        logger.debug(`Successfully issued GET request to url ${url}`)

        // Return the data 
        return response.data;
    } catch (err) {
        logger.error(`Error executing GET request to url '${url}': ${err}`)
        process.exit();
    }
}

export { get }