'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as http from 'http';

export function stripColorCode(content: string) : string {
    var regex = /\033\[[0-9;]*m/g;
    //return content;
    return content.replace(regex, '').replace('\ufffd\ufffd\ufffd', '─');
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-weather-forecase" is now active!');

    vscode.workspace.registerTextDocumentContentProvider('weather', {provideTextDocumentContent(uri: vscode.Uri): Thenable<string> {
        return new Promise((resolve, reject) => {
            try {
                http.get({
                    'host': 'wttr.in',
                    'path': uri.path.replace(/ /g, '_'),
                    'headers': {
                        'User-Agent': 'curl/7.43.0'
                    }
                }, function(response) {
                    // Continuously update stream with data
                    var body = '';
                    response.on('data', function(d) {
                        body += d;
                    });
                    response.on('end', function() {
                        var result = 'Via http://wttr.in' + uri.path + '\r\n\r\n';
                        result += stripColorCode(body);
                        resolve(result);
                    });
                    response.on('error', function(error) {
                        reject(error); 
                    });
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }});
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('weather.forecast', () => {
        vscode.window.showInputBox({
            prompt: 'Input City Name (empty if for current location)',
            placeHolder: 'E.g.: "Seattle,WA", "Paris", "Tokyo,Japan"'
        }).then((city) => {
            vscode.workspace.openTextDocument(vscode.Uri.parse('weather://weather/' + city)).then((document) => {    
                vscode.window.showTextDocument(document); 
            }, (error) => {
                vscode.window.showErrorMessage(error);
            });
        });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}