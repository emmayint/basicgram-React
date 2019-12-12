// some constants used across components
// TODO: Add all them port host constants here
module.exports = {
    GATEWAY_HOST: process.env.GATEWAY_HOST || 'http://localhost:4000',
    WEBSOCKET_HOST: process.env.WEBSOCKET_HOST || 'http://localhost:6000',
    AUTH_SERVER_HOST: process.env.AUTH_SERVER_HOST || 'http://localhost:3002',
    USER_SERVER_HOST: process.env.USER_SERVER_HOST || 'http://localhost:3003',
    BASICGRAM_HOST: process.env.BASICGRAM_HOST || 'http://localhost:5000',
    FRONT_END_HOST: process.env.FRONT_END_HOST || 'http://localhost:3000',
    MONGODB_URI: (process.env.MONGO_HOST && `${process.env.MONGO_HOST}/basicgram-database`) || 'mongodb://localhost:27017/basicgram-database',
    FEED_TOPIC: 'feed',
    COMMENT_TOPIC: 'comment',
    KAFKA_FEED_TOPIC: 'feed',
    KAFKA_COMMENT_TOPIC: 'comment',
    KAFKA_SERVER: 'localhost:9092'
};