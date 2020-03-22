"use strict";
/**
 * @license
 *
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 *
 * Copyright (c) 2018, Костя Третяк. (MIT Licensed)
 * https://github.com/ts-stack/markdown
 */
Object.defineProperty(exports, "__esModule", { value: true });
var inline_lexer_1 = require("./inline-lexer");
var interfaces_1 = require("./interfaces");
var marked_1 = require("./marked");
var renderer_1 = require("./renderer");
/**
 * Parsing & Compiling.
 */
var Parser = /** @class */ (function () {
    function Parser(options) {
        this.simpleRenderers = [];
        this.line = 0;
        this.tokens = [];
        this.token = null;
        this.options = options || marked_1.Marked.options;
        this.renderer = this.options.renderer || new renderer_1.Renderer(this.options);
    }
    Parser.parse = function (tokens, links, options) {
        var parser = new this(options);
        return parser.parse(links, tokens);
    };
    Parser.prototype.parse = function (links, tokens) {
        this.inlineLexer = new inline_lexer_1.InlineLexer(inline_lexer_1.InlineLexer, links, this.options, this.renderer);
        this.tokens = tokens.reverse();
        var out = '';
        while (this.next()) {
            out += this.tok();
        }
        return out;
    };
    Parser.prototype.debug = function (links, tokens) {
        this.inlineLexer = new inline_lexer_1.InlineLexer(inline_lexer_1.InlineLexer, links, this.options, this.renderer);
        this.tokens = tokens.reverse();
        var out = '';
        while (this.next()) {
            var outToken = this.tok();
            this.token.line = this.line += outToken.split('\n').length - 1;
            out += outToken;
        }
        return out;
    };
    Parser.prototype.next = function () {
        return (this.token = this.tokens.pop());
    };
    Parser.prototype.getNextElement = function () {
        return this.tokens[this.tokens.length - 1];
    };
    Parser.prototype.parseText = function () {
        var body = this.token.text;
        var nextElement;
        while ((nextElement = this.getNextElement()) && nextElement.type == interfaces_1.TokenType.text) {
            body += '\n' + this.next().text;
        }
        return this.inlineLexer.output(body);
    };
    Parser.prototype.tok = function () {
        switch (this.token.type) {
            case interfaces_1.TokenType.space: {
                return '';
            }
            case interfaces_1.TokenType.paragraph: {
                return this.renderer.paragraph(this.inlineLexer.output(this.token.text));
            }
            case interfaces_1.TokenType.text: {
                if (this.options.isNoP) {
                    return this.parseText();
                }
                else {
                    return this.renderer.paragraph(this.parseText());
                }
            }
            case interfaces_1.TokenType.heading: {
                return this.renderer.heading(this.inlineLexer.output(this.token.text), this.token.depth, this.token.text);
            }
            case interfaces_1.TokenType.listStart: {
                var body = '';
                var ordered = this.token.ordered;
                while (this.next().type != interfaces_1.TokenType.listEnd) {
                    body += this.tok();
                }
                return this.renderer.list(body, ordered);
            }
            case interfaces_1.TokenType.listItemStart: {
                var body = '';
                while (this.next().type != interfaces_1.TokenType.listItemEnd) {
                    body += this.token.type == interfaces_1.TokenType.text ? this.parseText() : this.tok();
                }
                return this.renderer.listitem(body);
            }
            case interfaces_1.TokenType.looseItemStart: {
                var body = '';
                while (this.next().type != interfaces_1.TokenType.listItemEnd) {
                    body += this.tok();
                }
                return this.renderer.listitem(body);
            }
            case interfaces_1.TokenType.code: {
                return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
            }
            case interfaces_1.TokenType.table: {
                var header = '';
                var body = '';
                var cell = void 0;
                // header
                cell = '';
                for (var i = 0; i < this.token.header.length; i++) {
                    var flags = { header: true, align: this.token.align[i] };
                    var out = this.inlineLexer.output(this.token.header[i]);
                    cell += this.renderer.tablecell(out, flags);
                }
                header += this.renderer.tablerow(cell);
                for (var _i = 0, _a = this.token.cells; _i < _a.length; _i++) {
                    var row = _a[_i];
                    cell = '';
                    for (var j = 0; j < row.length; j++) {
                        cell += this.renderer.tablecell(this.inlineLexer.output(row[j]), {
                            header: false,
                            align: this.token.align[j]
                        });
                    }
                    body += this.renderer.tablerow(cell);
                }
                return this.renderer.table(header, body);
            }
            case interfaces_1.TokenType.blockquoteStart: {
                var body = '';
                while (this.next().type != interfaces_1.TokenType.blockquoteEnd) {
                    body += this.tok();
                }
                return this.renderer.blockquote(body);
            }
            case interfaces_1.TokenType.hr: {
                return this.renderer.hr();
            }
            case interfaces_1.TokenType.html: {
                var html = !this.token.pre && !this.options.pedantic ? this.inlineLexer.output(this.token.text) : this.token.text;
                return this.renderer.html(html);
            }
            default: {
                if (this.simpleRenderers.length) {
                    for (var i = 0; i < this.simpleRenderers.length; i++) {
                        if (this.token.type == 'simpleRule' + (i + 1)) {
                            return this.simpleRenderers[i].call(this.renderer, this.token.execArr);
                        }
                    }
                }
                var errMsg = "Token with \"" + this.token.type + "\" type was not found.";
                if (this.options.silent) {
                    console.log(errMsg);
                }
                else {
                    throw new Error(errMsg);
                }
            }
        }
    };
    return Parser;
}());
exports.Parser = Parser;
