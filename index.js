const express = require('express');
const { MongoClient } = require('mongodb');

const mongoURL = 'mongodb://localhost:27017';
const dbName = 'users-app';

const client = new MongoClient(mongoURL, { useNewUrlParser: true });

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use('/api/users', require('./routes/api'));

app.listen(port, function() {
	console.log(`Server started on port: ${port}`);

	client.connect(function(err) {
		if (err) throw new Error(err);

		console.log('Connected to MongoDB');
		const db = client.db(dbName);

		app.locals.db = db;
	});
});

process.on('exit', function() {
	console.log('Server shutdown');
	client.close();
});
