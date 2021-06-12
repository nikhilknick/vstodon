import { TokenManager } from './TokenManager';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { authenticate } from './authenticate';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('context', context);

	TokenManager.globalState = context.globalState;
	console.log('token value is',TokenManager.getToken())

	const sidebarProvider = new SidebarProvider(context.extensionUri);

	const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
	item.text = '$(beaker)  Add Todo';
	item.command = 'vstodon.addTodo';
	item.show();

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('vstodon-sidebar', sidebarProvider)
	);

	let disposable = vscode.commands.registerCommand('vstodon.helloWorld', () => {
		HelloWorldPanel.createOrShow(context.extensionUri);
	});

	let secondDisposable = vscode.commands.registerCommand('vstodon.askQuestion', async () => {
		const answer = await vscode.window.showInformationMessage('How was your day?', 'good', 'bad');

		if (answer === 'bad') {
			vscode.window.showInformationMessage('Sorry to hear that!');
		} else {
			console.log(answer);
		}
	});

	let refresh = vscode.commands.registerCommand('vstodon.refresh', async () => {
		// HelloWorldPanel.kill();
		// HelloWorldPanel.createOrShow(context.extensionUri);
		await vscode.commands.executeCommand('workbench.action.closeSidebar');
		await vscode.commands.executeCommand('workbench.view.extension.vstodon-sidebar-view');

		//Dev Tools
		setTimeout(() => {
			vscode.commands.executeCommand('workbench.action.webview.openDeveloperTools');
		}, 500);
	});

	let addTodo = vscode.commands.registerCommand('vstodon.addTodo', () => {
		// console.log('todo added');
		const { activeTextEditor } = vscode.window;
		if (!activeTextEditor) {
			vscode.window.showInformationMessage('No Text editor');
		}
		const text = activeTextEditor?.document.getText(activeTextEditor.selection);

		vscode.window.showInformationMessage('text:' + text);

		sidebarProvider._view?.webview.postMessage({
			type: 'new-todo',
			value: text,
		});
	});

	context.subscriptions.push(
		vscode.commands.registerCommand('vstodon.authenticate', () => {
			try {
				authenticate();
			} catch (err) {
				console.log(err);
			}
		})
	);

	context.subscriptions.push(disposable);
	context.subscriptions.push(secondDisposable);
	context.subscriptions.push(refresh);
	context.subscriptions.push(addTodo);
}

// this method is called when your extension is deactivated
export function deactivate() {}
