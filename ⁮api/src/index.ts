import express from 'express';

// (async () => {
// 	const app = express();
// })();

const main = () => {
	const port = 3002;

	const app = express();

	app.get('/', (req, res) => {
		res.send('Hello');
	});
	app.listen(port, () => {
		console.log(`Server running on port : ${port}`);
	});
};

main();
