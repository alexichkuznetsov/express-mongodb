const { Router } = require('express');
const { ObjectID } = require('mongodb');
const router = Router();

router.get('/', function(req, res) {
	const { db } = req.app.locals;
	const { page } = req.query || 0;
	const limit = 10;

	db.collection('users')
		.find({})
		.skip(page * limit)
		.limit(limit)
		.toArray()
		.then(result => res.status(200).json({ users: result }))
		.catch(err => {
			console.log(err);
			res.status(400).json({ msg: 'Something went wrong' });
		});
});

router.get('/:id', function(req, res) {
	const { id } = req.params;
	const { db } = req.app.locals;

	db.collection('users')
		.findOne({ _id: ObjectID(id) })
		.then(result => {
			if (result === null) {
				res.status(404).json({ msg: 'User not found' });
			} else {
				res.status(200).json({ ...result });
			}
		})
		.catch(err => {
			console.log(err);
			res.status(400).json({ msg: 'Something went wrong' });
		});
});

router.post('/', function(req, res) {
	const { name, email, age, hobbies } = req.body;
	const { db } = req.app.locals;

	const user = { name, email, age, hobbies };

	db.collection('users')
		.insertOne(user)
		.then(result => res.status(201).json({ ...result.ops[0] }))
		.catch(err => console.log(err));
});

router.put('/:id', function(req, res) {
	const { id } = req.params;
	const { db } = req.app.locals;

	db.collection('users')
		.findOne({ _id: ObjectID(id) })
		.then(result => {
			if (result === null) {
				res.status(404).json({ msg: 'User not found' });
			} else {
				let { name, email, age, hobbies } = req.body;

				name = name || result.name;
				email = email || result.email;
				age = age || result.age;
				hobbies = hobbies || result.hobbies;

				db.collection('users')
					.updateOne(
						{ _id: ObjectID(id) },
						{ $set: { name, email, age, hobbies } }
					)
					.then(updRes => res.status(200).json({ msg: 'User updated' }))
					.catch(updErr => {
						console.log(updErr);
						res
							.status(400)
							.json({ msg: 'Something went wrong during update operation' });
					});
			}
		})
		.catch(err => {
			console.log(err);
			res.status(400).json({ msg: 'Something went wrong' });
		});
});

router.delete('/:id', function(req, res) {
	const { id } = req.params;
	const { db } = req.app.locals;

	db.collection('users')
		.deleteOne({ _id: ObjectID(id) })
		.then(result => res.status(202).json({ msg: 'User deleted' }))
		.catch(err => {
			console.log(err);
			res.status(400).json({ msg: 'Something went wrong' });
		});
});

module.exports = router;
