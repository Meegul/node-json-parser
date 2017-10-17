const lexer = require('../src/lexer');
const assert = require('assert');
describe('Lexer', function() {
	describe('#lex(): numbers', function() {
		it('should tokenize a number', function() {
			const input = '1';
			const output = lexer.lex(input);
			assert.equal(output[0].value, input);
			assert.equal(output[0].type, 'number');
			assert.equal(output[0].index, 0);
			assert.equal(output[0].length, input.length);
		});
		it('should tokenize a long number', function() {
			const input = '123456791012131415';
			const output = lexer.lex(input);
			assert.equal(output[0].value, input);
			assert.equal(output[0].type, 'number');
			assert.equal(output[0].index, 0);
			assert.equal(output[0].length, input.length);
		});
		it('should tokenize a number with exponents', function() {
			const input = '123e10';
			const output = lexer.lex(input);
			assert.equal(output[0].value, input);
			assert.equal(output[0].type, 'number');
			assert.equal(output[0].index, 0);
			assert.equal(output[0].length, input.length);
		});
		it('should tokenize a number with exponents with - in front of the exponent', function() {
			const input = '123e-10';
			const output = lexer.lex(input);
			assert.equal(output[0].value, input);
			assert.equal(output[0].type, 'number');
			assert.equal(output[0].index, 0);
			assert.equal(output[0].length, input.length);
		});
		it('should tokenize a number with exponents with + in front of the exponent', function() {
			const input = '123e+10';
			const output = lexer.lex(input);
			assert.equal(output[0].value, input);
			assert.equal(output[0].type, 'number');
			assert.equal(output[0].index, 0);
			assert.equal(output[0].length, input.length);
		});
		it('should tokenize a number with a decimal', function() {
			const input = '123.456';
			const output = lexer.lex(input);
			assert.equal(output[0].value, input);
			assert.equal(output[0].type, 'number');
			assert.equal(output[0].index, 0);
			assert.equal(output[0].length, input.length);
		});
		it('should tokenize a negative number', function() {
			const input = '-123';
			const output = lexer.lex(input);
			assert.equal(output[0].value, input);
			assert.equal(output[0].type, 'number');
			assert.equal(output[0].index, 0);
			assert.equal(output[0].length, input.length);
		});
		it('should tokenize a negative number with decimals', function() {
			const input = '-123.456';
			const output = lexer.lex(input);
			assert.equal(output[0].value, input);
			assert.equal(output[0].type, 'number');
			assert.equal(output[0].index, 0);
			assert.equal(output[0].length, input.length);
		});
		it('should tokenize a negative number with exponents', function() {
			const input = '-123e10';
			const output = lexer.lex(input);
			assert.equal(output[0].value, input);
			assert.equal(output[0].type, 'number');
			assert.equal(output[0].index, 0);
			assert.equal(output[0].length, input.length);
		});
		it('should tokenize a negative number with decimals and exponents', function() {
			const input = '-123.456e10';
			const output = lexer.lex(input);
			assert.equal(output[0].value, input);
			assert.equal(output[0].type, 'number');
			assert.equal(output[0].index, 0);
			assert.equal(output[0].length, input.length);
		});
		it('should not tokenize a number with two 0s in front', function(done) {
			const input = '00.123';
			try {
				const output = lexer.lex(input);
			} catch (e) {
				done();
			}
			done('tokenized when it shouldn\'t have.');
		});
		it('should not tokenize a number consisting of only two 0s before a decimal', function(done) {
			const input = '00.123';
			try {
				const output = lexer.lex(input);
			} catch (e) {
				done();
			}
			done('tokenized when it shouldn\'t have.');
		});
		it('should not tokenize a number with a 0 in front not followed by a decimal', function(done) {
			const input = '0123';
			try {
				const output = lexer.lex(input);
			} catch (e) {
				done();
			}
			done('tokenized when it shouldn\'t have.');
		});
		it('should not tokenize a number with a decimal and no digits after it', function(done) {
			const input = '123.';
			try {
				const output = lexer.lex(input);
			} catch (e) {
				done();
			}
			done('tokenized when it shouldn\'t have.');
		});
	});
});