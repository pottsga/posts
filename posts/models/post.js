import { DataTypes } from 'sequelize';
import { sequelize } from "../services/database.js";
import { logger } from '../services/logging.js';

// Describe the post table as per the project specifications. Only userId and 
// title are stored, so those are the only columns I am specifying.
const Post = sequelize.define('post', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false }
})

// Tell sequelize to create the model.
await sequelize.sync({ force: true })

/**
 * Write the post received from the subscription to Apache ActiveMQ 
 * to the database.
 * @param {string} body The message body received from Apache ActiveMQ
 */
const writePostToDatabase = (body) => {
    // Convert the string to JSON
    let post = JSON.parse(body);

    // Pull out the userId and title fields from the JSON
    let userId = post.userId;
    let title = post.title;

    logger.debug(`Attempting to create a Post record for {userId: ${userId}, title: ${title}}`)
    post = Post.build({
        userId: userId,
        title: title,
    });
    post.save()
    logger.info(`Created a post record for post {userId: ${userId}, title: ${title}}`)
}

export { Post, writePostToDatabase }