class TokenType {
	constructor(name, regex) {
		this.name = name;
		this.regex = regex;
	}
}

const tokenTypes = [
	new TokenType('number', /-?[0-9]+([.][0-9]+)?([eE][+-]?[0-9]+)?/),
	new TokenType('string', /"(([^"\\])|([\\]((["\\/bfnrt])|(u[0-9A-F]{4}))))*"/),
	new TokenType('boolean', /true|false/),
	new TokenType('null', /null/),
	new TokenType('open_brack', /\[/),
	new TokenType('close_brack', /\]/),
	new TokenType('open_brace', /\{/),
	new TokenType('close_brace', /\}/),
	new TokenType('comma', /,/),
	new TokenType('colon', /:/),
	new TokenType('whitespace', /\s+/)
];
exports.tokenTypes = tokenTypes;

class Token {
	constructor(value, type, index, length) {
		this.value = value;
		this.type = type;
		this.index = index;
		this.length = length;
	}
}
exports.Token = Token;

function matchTokenTypes(str, offset) {
	return tokenTypes.map((tokenType) => {
		const tokenTypeMatches = tokenType.regex.exec(str);
		const values = tokenTypeMatches ? 
			tokenTypeMatches.filter((match) => match !== undefined && match === str) :
			undefined;
		const index = tokenTypeMatches ? tokenTypeMatches.index + offset : -1;
		return { 
			values,
			type: tokenType.name,
			index
		};
	}).filter((match) => {
		return match.values !== undefined && match.values.length > 0;
	});
}

function lex(input) {
	if (typeof input !== 'string') {
		throw new Error('lex(): Invalid input');
	}
	//Do basic tokenization
	let tokens = [];
	let str = '';
	let offset = 0;
	for(let char of input.split('')) {
		str += char;
		const matches = matchTokenTypes(str, offset);
		if (matches && matches.length > 0) {
			tokens.push(new Token(matches[0].values[0], matches[0].type, matches[0].index, matches[0].values[0].length));
			offset += str.length;
			str = '';
		}
	}
	//Maximize token size
	for(let i = 0; i < tokens.length - 1; i++) {
		let tokenOn = tokens[i];
		let nextToken = tokens[i+1];
		if (tokenOn.type !== nextToken.type || (tokenOn.index + tokenOn.length) !== nextToken.index)
			continue;
		const mergedToken = new Token(tokenOn.value + nextToken.value,
			tokenOn.type, tokenOn.index, 
			tokenOn.length + nextToken.length);
		const matchAttempt = matchTokenTypes(mergedToken.value, tokenOn.index);
		//See if our merged token is still a valid token of the same type
		if (matchAttempt.length > 0 && matchAttempt[0].values[0] === mergedToken.value && matchAttempt[0].type === mergedToken.type) {
			tokens.splice(i, 2);
			tokens = tokens.slice(0, i).concat(mergedToken).concat(tokens.slice(i));
			i--;
		}
	};
	const totalTokenLength = tokens.reduce((total, token) => total + token.length, 0);
	if (totalTokenLength !== input.length) {
		throw new Error(
`lex(): tokens matched do not add up to the length of the input string.
	Expected length: ${input.length}, Actual length: ${totalTokenLength}`
			);
	}
	return tokens;
}
exports.lex = lex;