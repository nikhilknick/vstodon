import { TokenManager } from './TokenManager';
import { apiBaseUrl } from './constants';
import * as vscode from 'vscode';
import * as polka from 'polka';

export const authenticate = (fn: () => void) => {
	const app = polka();

	app.get(`/auth/:token`, async (req, res) => {
		const { token } = req.params;
		if (!token) {
			res.end(`<h1>Something went wrong</h1>`);
			return;
		}

		await TokenManager.setToken(token);
		fn();

		console.log(token);
		res.end(`<h1>Auth was successful, you can close this window</h1>`);

		//We are not requesting any more request to the api, thus close this
		(app as any).server.close();
	});

	app.listen(54321, (err: any) => {
		if (err) {
			vscode.window.showErrorMessage(err.message);
		} else {
			//Tell vscode to open a url
			vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`${apiBaseUrl}/auth/github`));
		}
	});
};
