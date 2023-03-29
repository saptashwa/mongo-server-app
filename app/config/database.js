const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

exports.start = () => {
  const mongooseConnectionString = getMongooseConnectionString();
  mongoose.connect(mongooseConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

getMongooseConnectionString = () => {
  return `${process.env.DATABASE_TYPE}+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MANGO_SCHEMA_NAME}`
}