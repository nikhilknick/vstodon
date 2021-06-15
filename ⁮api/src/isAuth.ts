import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

export const isAuth: RequestHandler<{}, any, any, {}> = (req, _, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		throw new Error('Not Authenticated');
	}
	const token = authHeader.split(' ')[1];
	if (!token) {
		throw new Error('Not Authenticated');
	}

	try {
		const payload: any = jwt.verify(token, process.env.JSON_TOKEN_SECRET);
		req.userId = payload.userId;
		next();
		return;
	} catch {}

	throw new Error('Not Authenticated');
};
