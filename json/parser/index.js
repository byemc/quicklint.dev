
class JSONParser {
    tokens = {
        structural: {
            openTokens: ['array', 'object', 'string'],
            array: {
                begin: "[",
                end: "]"
            },
            object: {
                begin: "{",
                end: "}"
            },
            string: {
                begin: '"',
                end: '"',
                escape: "\\"
            },
            string_alt: {       // Used for fixing common errors, but is also valid in JSON5
                begin: "'",
                end: "'",
            },
            separator: {
                name: ":",
                value: ","
            }
        },
        whitespace: {           // Array of values allowed around structural tokens
            space:   "\u0020",           // Space
            tab:     "\u0009",           // Tab
            feed:    "\u000A",           // CF / New Line
            return:  "\u000D",           // Carriage return
        },
        allowedLiterals: [
            "false", "true", "null"
        ]
    }

    expects(value) {
        switch (value) {
            case this.tokens.structural.object.begin:
                return this.tokens.structural.object.end;
            case this.tokens.structural.array.begin:
                return this.tokens.structural.array.end;
        }
    }

    parse(value, options = {}) {
        let output = {};

        options.allowSingleQuotes = options.allowSingleQuotes ? options.allowSingleQuotes : true;
        options.implicitlyCloseBrackets = options.implicitlyCloseBrackets ? options.implicitlyCloseBrackets : false;
        options.removeTrailingSeparator = options.removeTrailingSeparator ? options.removeTrailingSeparator : true;

        value = value.trim();

        switch (value.substring(0, 1)) {
            case this.tokens.structural.object.begin:
            case this.tokens.structural.array.begin:
                break;
            default:
                throw SyntaxError("Invalid JSON object.");
        }

        throw SyntaxError();

        var location = 0;
        var char = "";
        var stringOpened = false;
        var lastCharWasAnEscape = false;
        var readUntil = undefined;
        var openedBrackets = [];

        for (location = 0; location < value.length; location++) {
            char = value.substring(location, location + 1);

            switch (char) {
                case this.tokens.structural.object.begin:
                case this.tokens.structural.array.begin:
                    openedBrackets.push(this.expects(char));
                    break;
            }

            if (stringOpened) {
                if (char === this.tokens.structural.string.escape && !lastCharWasAnEscape) {
                    lastCharWasAnEscape = true;
                    continue;
                } else {
                    lastCharWasAnEscape = false;
                }
                switch (char) {
                    case this.tokens.structural.string_alt.end:
                        if (!options.allowSingleQuotes) break;
                    case this.tokens.structural.string.end:
                        if (lastCharWasAnEscape) {
                            lastCharWasAnEscape = false;
                            stringOpened = false;
                        }
                        break;
                }
            }
        }

        return value;
    }

    dumbFormatter(value, options = {}) {
        options.indent = options.indent ? options.indent : this.tokens.whitespace.tab;

        value = value.trim();

        var output = "";

        var level = 0;
        var location = 0;
        var char = "";
        var lastChar = "";

        for (location = 0; location < value.length; location++) {
            lastChar = char;
            char = value.substring(location, location + 1);

            switch (char) {
                case this.tokens.structural.object.begin:
                case this.tokens.structural.array.begin:
                    level = Math.max(level + 1, 0);
                    output += char;
                    output += lastChar === char ? "" : "\n";
                    for (let i = 0; i < level; i++) {
                        output += options.indent;
                    }
                    break;
                case this.tokens.structural.object.end:
                case this.tokens.structural.array.end:
                    level = Math.max(level - 1, 0);
                    output += lastChar === char ? "" : "\n";
                    for (let i = 0; i < level; i++) output += options.indent;
                    output += char;
                    break;
                case this.tokens.structural.separator.value:
                    output += char;
                case this.tokens.whitespace.feed:
                    if (lastChar === this.tokens.whitespace.feed)
                        break;
                    output += "\n";
                    level = Math.max(level, 0);
                    for (let i = 0; i < level; i++) output += options.indent;
                    break;
                default:
                    output += char;
                    break;
            }
        }

        return output;
    }

    minify(value, options = {}) {
        return this.parse(value, options);
    }

    beautify(value, options = {}) {
        options.fallbackOnDumbFormatterOnFail = options.fallbackOnDumbFormatterOnFail ? options.fallbackOnDumbFormatterOnFail : true;

        var output = "";
        var errors = [];

        try {
            output = this.parse(value, options);
        } catch (e) {
            if (options.fallbackOnDumbFormatterOnFail) {
                output = this.dumbFormatter(value, options);
                errors.push({
                    message: `Fallback formatter used: ${e}`,
                    color: "warning"
            });
            }
            else throw e;
        }

        return {output, errors};
    }
}

export default JSONParser;
