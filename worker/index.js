const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000 // in case you lose connection, try to connect again after 1 second
});

const sub = redisClient.duplicate();

function fib(index) {
    if (index < 2) {
        return 1;
    } 
    return fib(index - 1) + fib(index - 2); 
    // recursive and slow (not ideal)
    // but we're doing it to show the need of the worker and redis
}


sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');