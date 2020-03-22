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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var block_lexer_1 = require("./block-lexer");
var interfaces_1 = require("./interfaces");
var parser_1 = require("./parser");
var Marked = /** @class */ (function () {
    function Marked() {
    }
    /**
     * Merges the default options with options that will be set.
     *
     * @param options Hash of options.
     */
    Marked.setOptions = function (options) {
        Object.assign(this.options, options);
        return this;
    };
    /**
     * Setting simple block rule.
     */
    Marked.setBlockRule = function (regexp, renderer) {
        if (renderer === void 0) { renderer = function () { return ''; }; }
        block_lexer_1.BlockLexer.simpleRules.push(regexp);
        this.simpleRenderers.push(renderer);
        return this;
    };
    /**
     * Accepts Markdown text and returns text in HTML format.
     *
     * @param src String of markdown source to be compiled.
     * @param options Hash of options. They replace, but do not merge with the default options.
     * If you want the merging, you can to do this via `Marked.setOptions()`.
     */
    Marked.parse = function (src, options) {
        if (options === void 0) { options = this.options; }
        try {
            var _a = this.callBlockLexer(src, options), tokens = _a.tokens, links = _a.links;
            return this.callParser(tokens, links, options);
        }
        catch (e) {
            return this.callMe(e);
        }
    };
    /**
     * Accepts Markdown text and returns object with text in HTML format,
     * tokens and links from `BlockLexer.parser()`.
     *
     * @param src String of markdown source to be compiled.
     * @param options Hash of options. They replace, but do not merge with the default options.
     * If you want the merging, you can to do this via `Marked.setOptions()`.
     */
    Marked.debug = function (src, options) {
        if (options === void 0) { options = this.options; }
        var _a = this.callBlockLexer(src, options), tokens = _a.tokens, links = _a.links;
        var origin = tokens.slice();
        var parser = new parser_1.Parser(options);
        parser.simpleRenderers = this.simpleRenderers;
        var result = parser.debug(links, tokens);
        /**
         * Translates a token type into a readable form,
         * and moves `line` field to a first place in a token object.
         */
        origin = origin.map(function (token) {
            token.type = interfaces_1.TokenType[token.type] || token.type;
            var line = token.line;
            delete token.line;
            if (line) {
                return __assign({ line: line }, token);
            }
            else {
                return token;
            }
        });
        return { tokens: origin, links: links, result: result };
    };
    Marked.callBlockLexer = function (src, options) {
        if (src === void 0) { src = ''; }
        if (typeof src != 'string') {
            throw new Error("Expected that the 'src' parameter would have a 'string' type, got '" + typeof src + "'");
        }
        // Preprocessing.
        src = src
            .replace(/\r\n|\r/g, '\n')
            .replace(/\t/g, '    ')
            .replace(/\u00a0/g, ' ')
            .replace(/\u2424/g, '\n')
            .replace(/^ +$/gm, '');
        return block_lexer_1.BlockLexer.lex(src, options, true);
    };
    Marked.callParser = function (tokens, links, options) {
        if (this.simpleRenderers.length) {
            var parser = new parser_1.Parser(options);
            parser.simpleRenderers = this.simpleRenderers;
            return parser.parse(links, tokens);
        }
        else {
            return parser_1.Parser.parse(tokens, links, options);
        }
    };
    Marked.callMe = function (err) {
        err.message += '\nPlease report this to https://github.com/ts-stack/markdown';
        if (this.options.silent) {
            return '<p>An error occured:</p><pre>' + this.options.escape(err.message + '', true) + '</pre>';
        }
        throw err;
    };
    Marked.options = new interfaces_1.MarkedOptions();
    Marked.simpleRenderers = [];
    return Marked;
}());
exports.Marked = Marked;
