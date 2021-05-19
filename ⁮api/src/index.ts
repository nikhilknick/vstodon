import 'reflect-metadata';
require('dotenv-safe').config();
import express from 'express';
import { createConnection } from 'typeorm';
import { __prod__ } from './constants';
import * as path from 'path';
import { User } from './entities/User';
import { Strategy as GitHubStrategy } from 'passport-github';
import passport from 'passport';

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

	// const user = await User.create({ name: 'bob' }).save();
	// console.log({ user });

	const port = 3002;

	const app = express();

	passport.serializeUser((user: any, done) => {
		done(null, user.accessToken);
	});
	app.use(passport.initialize());

	passport.use(
		new GitHubStrategy(
			{
				clientID: process.env.GITHUB_CLIENT_ID,
				clientSecret: process.env.GITHUB_CLIENT_SECRET,

				callbackURL: 'http://localhost:3002/auth/github/callback',
			},
			async (_, __, profile, cb) => {
				let user = await User.findOne({ where: { githubId: profile.id } });
				if (user) {
					user.name = profile.displayName;
					await user.save();
				} else {
					User.create({ name: profile.displayName }).save();
				}
				console.log(profile);
				cb(null, { accessToken: 'dsfdsfdsd' });
				// User.findOrCreate({ githubId: profile.id }, function (err, user) {
				// 	return cb(err, user);
				// });
			}
		)
	);

	app.get('/auth/github', passport.authenticate('github', { session: false }));

	app.get(
		'/auth/github/callback',
		passport.authenticate('github', { session: false }),
		function (_req, res) {
			// Successful authentication, redirect home.
			res.send('you logged in correctly');
			// res.redirect('/');
		}
	);

	app.get('/', (_req, res) => {
		res.send('Hello');
	});
	app.listen(port, () => {
		console.log(`Server running on port : ${port}`);
	});
};

main();
