import * as vscode from 'vscode';

const KEY = 'vstodontoken';

export class TokenManager {
	static globalState: vscode.Memento;

	static setToken(token: string) {
        //update return promise
		return this.globalState.update(KEY, token);
	}

	static getToken(): string | undefined {
        //get is syncronous
		return this.globalState.get(KEY);
	}
}
