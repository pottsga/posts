# Posts

## Description

A software implementation that fetches posts from a Public API (https://jsonplaceholder.typicode.com/posts),
parses them, and publishes them to an Apache Active MQ queue. Those messages are
later retrieved and inserted into a `sqlite` database in `posts/database.sqlite`.

## How to Run

Prerequisites to running this project are that you have Apache ActiveMQ installed
and running. You will specify the port and host in the .env file.

To run this project, you first need to `cd` into the `posts` directory, and install
all dependencies by running `npm install`. 

After that, you must set up your environment variables. You can do this by running the
following command and updating the variables within .env to ones specific to your
environment.

```bash
cp EXAMPLE.env .env
$EDITOR .env
```

Then, you can use the scripts configured 
in the `package.json` file by prefacing each script call with the `npm run` command.
For example, to run the `part1.js` script, run `npm run part1.js`.

- `npm run start` or `npm start`: Runs both the `part1.js` and `part2.js` scripts one after the other.  Effectively, this fetches API calls from the remote API endpoint and publishes 
them to Apache Active MQ. After it does that, it reads any messages in the `posts` queue in
Apache Active MQ and stores the `userID` and `title` values in a database table called `posts`.
- `part1.js`: This fetches API calls from the remote API endpoint and publishes 
them to Apache Active MQ.
- `part2.js`: This reads any messages in the `posts` queue in Apache Active MQ and stores the `userID` and `title` values in a database table called `posts`. This script will continue to listen for new messages until you stop the process from running.

