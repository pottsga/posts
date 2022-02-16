# Posts

A software implementation that fetches posts from a Public API (https://jsonplaceholder.typicode.com/posts),
parses them, and publishes them to an Apache Active MQ queue. Those messages are
later retrieved and inserted into a database.

