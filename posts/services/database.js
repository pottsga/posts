import Sequelize from 'sequelize';
import dotenv from 'dotenv'
dotenv.config();

import { logger } from './logging.js';

/**
 * Create a connection to the database using the DB_CONNECTION_STRING environment
 * variable.
 */
let sequelize = () => {
    try {
        logger.debug('Attempting to connect to database');
        // Attempt to establish a connection to the database using the connection
        // string passed in.
        const connectionString = process.env.DB_CONNECTION_STRING
        if (typeof (connectionString) === 'undefined') {
            throw 'DB_CONNECTION_STRING environment variable is undefined.'
        }

        const sequelizeObject = new Sequelize(connectionString)
        logger.debug('Successfully connected to database.')
        return sequelizeObject
    } catch (err) {
        logger.error('Error connecting to database: ' + err);
        process.exit();
    }

}

// Invoke the sequelize function so it can be exported as a variable
sequelize = sequelize()

export { sequelize }