const mongoose = require('mongoose');

const uri = 'mongodb+srv://test:test@clusterbeanbrew.gcxuo.mongodb.net/BeanAndBrew?retryWrites=true&w=majority';

console.log('Attempting to connect to MongoDB...');
console.log('URI:', uri);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    retryWrites: true,
    w: 'majority',
    dbName: 'BeanAndBrew'
})
.then(() => {
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
