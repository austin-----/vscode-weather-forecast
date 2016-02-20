// 
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => {

	// Defines a Mocha unit test
	test("Test Strip Code", () => {
        var rawText =  '├──────────────────────────────┼──────────────────────────────┼──────────────────────────���───┼──────────────────────────────┤';
        var expected = '├──────────────────────────────┼──────────────────────────────┼──────────────────────────────┼──────────────────────────────┤';
        var actual = myExtension.stripColorCode(rawText);
        assert.equal(actual, expected);
	});
    test("Test Strip Code 2", () => {
        var rawText = '[38;5;240;1m';
        var expected = '';
        var actual = myExtension.stripColorCode(rawText);
        assert.equal(actual, expected);
	});
    
});