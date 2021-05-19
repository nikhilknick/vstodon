import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { __prod__ } from './constants';
// import { join } from 'path';
import * as path from 'path';
import { User } from './entities/User';

// (async () => {
// 	const app = express();
// })();

const main = async () => {
	await createConnection({
		type: 'postgres',
		database: 'vstodon',
		// entities: [join(__dirname), './entities/*.*'],
		entities: [path.resolve(__dirname, './entities/*.*')],
		username: 'postgres',
		password: '123456',
		logging: !__prod__,
		synchronize: !__prod__,
	});

	const user = await User.create({ name: 'bob' }).save();
	console.log({ user });

	const port = 3002;

	const app = express();

	app.get('/', (_req, res) => {
		res.send('Hello');
	});
	app.listen(port, () => {
		console.log(`Server running on port : ${port}`);
	});
};

main();
