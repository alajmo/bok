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
var extend_regexp_1 = require("./extend-regexp");
var marked_1 = require("./marked");
var renderer_1 = require("./renderer");
/**
 * Inline Lexer & Compiler.
 */
var InlineLexer = /** @class */ (function () {
    function InlineLexer(staticThis, links, options, renderer) {
        if (options === void 0) { options = marked_1.Marked.options; }
        this.staticThis = staticThis;
        this.links = links;
        this.options = options;
        this.renderer = renderer || this.options.renderer || new renderer_1.Renderer(this.options);
        if (!this.links) {
            throw new Error("InlineLexer requires 'links' parameter.");
        }
        this.setRules();
    }
    /**
     * Static Lexing/Compiling Method.
     */
    InlineLexer.output = function (src, links, options) {
        var inlineLexer = new this(this, links, options);
        return inlineLexer.output(src);
    };
    InlineLexer.getRulesBase = function () {
        if (this.rulesBase) {
            return this.rulesBase;
        }
        /**
         * Inline-Level Grammar.
         */
        var base = {
            escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
            autolink: /^<([^ <>]+(@|:\/)[^ <>]+)>/,
            tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^<'">])*?>/,
            link: /^!?\[(inside)\]\(href\)/,
            reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
            nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
            strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
            em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
            code: /^(`+)([\s\S]*?[^`])\1(?!`)/,
            br: /^ {2,}\n(?!\s*$)/,
            text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/,
            _inside: /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/,
            _href: /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/
        };
        base.link = new extend_regexp_1.ExtendRegexp(base.link)
            .setGroup('inside', base._inside)
            .setGroup('href', base._href)
            .getRegexp();
        base.reflink = new extend_regexp_1.ExtendRegexp(base.reflink).setGroup('inside', base._inside).getRegexp();
        return (this.rulesBase = base);
    };
    InlineLexer.getRulesPedantic = function () {
        if (this.rulesPedantic) {
            return this.rulesPedantic;
        }
        return (this.rulesPedantic = __assign(__assign({}, this.getRulesBase()), {
            strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
            em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
        }));
    };
    InlineLexer.getRulesGfm = function () {
        if (this.rulesGfm) {
            return this.rulesGfm;
        }
        var base = this.getRulesBase();
        var escape = new extend_regexp_1.ExtendRegexp(base.escape).setGroup('])', '~|])').getRegexp();
        var text = new extend_regexp_1.ExtendRegexp(base.text)
            .setGroup(']|', '~]|')
            .setGroup('|', '|https?://|')
            .getRegexp();
        return (this.rulesGfm = __assign(__assign({}, base), {
            escape: escape,
            url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
            del: /^~~(?=\S)([\s\S]*?\S)~~/,
            text: text
        }));
    };
    InlineLexer.getRulesBreaks = function () {
        if (this.rulesBreaks) {
            return this.rulesBreaks;
        }
        var inline = this.getRulesGfm();
        var gfm = this.getRulesGfm();
        return (this.rulesBreaks = __assign(__assign({}, gfm), {
            br: new extend_regexp_1.ExtendRegexp(inline.br).setGroup('{2,}', '*').getRegexp(),
            text: new extend_regexp_1.ExtendRegexp(gfm.text).setGroup('{2,}', '*').getRegexp()
        }));
    };
    InlineLexer.prototype.setRules = function () {
        if (this.options.gfm) {
            if (this.options.breaks) {
                this.rules = this.staticThis.getRulesBreaks();
            }
            else {
                this.rules = this.staticThis.getRulesGfm();
            }
        }
        else if (this.options.pedantic) {
            this.rules = this.staticThis.getRulesPedantic();
        }
        else {
            this.rules = this.staticThis.getRulesBase();
        }
        this.hasRulesGfm = this.rules.url !== undefined;
    };
    /**
     * Lexing/Compiling.
     */
    InlineLexer.prototype.output = function (nextPart) {
        nextPart = nextPart;
        var execArr;
        var out = '';
        while (nextPart) {
            // escape
            if ((execArr = this.rules.escape.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                out += execArr[1];
                continue;
            }
            // autolink
            if ((execArr = this.rules.autolink.exec(nextPart))) {
                var text = void 0;
                var href = void 0;
                nextPart = nextPart.substring(execArr[0].length);
                if (execArr[2] === '@') {
                    text = this.options.escape(execArr[1].charAt(6) === ':' ? this.mangle(execArr[1].substring(7)) : this.mangle(execArr[1]));
                    href = this.mangle('mailto:') + text;
                }
                else {
                    text = this.options.escape(execArr[1]);
                    href = text;
                }
                out += this.renderer.link(href, null, text);
                continue;
            }
            // url (gfm)
            if (!this.inLink && this.hasRulesGfm && (execArr = this.rules.url.exec(nextPart))) {
                var text = void 0;
                var href = void 0;
                nextPart = nextPart.substring(execArr[0].length);
                text = this.options.escape(execArr[1]);
                href = text;
                out += this.renderer.link(href, null, text);
                continue;
            }
            // tag
            if ((execArr = this.rules.tag.exec(nextPart))) {
                if (!this.inLink && /^<a /i.test(execArr[0])) {
                    this.inLink = true;
                }
                else if (this.inLink && /^<\/a>/i.test(execArr[0])) {
                    this.inLink = false;
                }
                nextPart = nextPart.substring(execArr[0].length);
                out += this.options.sanitize
                    ? this.options.sanitizer
                        ? this.options.sanitizer(execArr[0])
                        : this.options.escape(execArr[0])
                    : execArr[0];
                continue;
            }
            // link
            if ((execArr = this.rules.link.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                this.inLink = true;
                out += this.outputLink(execArr, {
                    href: execArr[2],
                    title: execArr[3]
                });
                this.inLink = false;
                continue;
            }
            // reflink, nolink
            if ((execArr = this.rules.reflink.exec(nextPart)) || (execArr = this.rules.nolink.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                var keyLink = (execArr[2] || execArr[1]).replace(/\s+/g, ' ');
                var link = this.links[keyLink.toLowerCase()];
                if (!link || !link.href) {
                    out += execArr[0].charAt(0);
                    nextPart = execArr[0].substring(1) + nextPart;
                    continue;
                }
                this.inLink = true;
                out += this.outputLink(execArr, link);
                this.inLink = false;
                continue;
            }
            // strong
            if ((execArr = this.rules.strong.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                out += this.renderer.strong(this.output(execArr[2] || execArr[1]));
                continue;
            }
            // em
            if ((execArr = this.rules.em.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                out += this.renderer.em(this.output(execArr[2] || execArr[1]));
                continue;
            }
            // code
            if ((execArr = this.rules.code.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                out += this.renderer.codespan(this.options.escape(execArr[2].trim(), true));
                continue;
            }
            // br
            if ((execArr = this.rules.br.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                out += this.renderer.br();
                continue;
            }
            // del (gfm)
            if (this.hasRulesGfm && (execArr = this.rules.del.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                out += this.renderer.del(this.output(execArr[1]));
                continue;
            }
            // text
            if ((execArr = this.rules.text.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                out += this.renderer.text(this.options.escape(this.smartypants(execArr[0])));
                continue;
            }
            if (nextPart) {
                throw new Error('Infinite loop on byte: ' + nextPart.charCodeAt(0));
            }
        }
        return out;
    };
    /**
     * Compile Link.
     */
    InlineLexer.prototype.outputLink = function (execArr, link) {
        var href = this.options.escape(link.href);
        var title = link.title ? this.options.escape(link.title) : null;
        return execArr[0].charAt(0) !== '!'
            ? this.renderer.link(href, title, this.output(execArr[1]))
            : this.renderer.image(href, title, this.options.escape(execArr[1]));
    };
    /**
     * Smartypants Transformations.
     */
    InlineLexer.prototype.smartypants = function (text) {
        if (!this.options.smartypants) {
            return text;
        }
        return (text
            // em-dashes
            .replace(/---/g, '\u2014')
            // en-dashes
            .replace(/--/g, '\u2013')
            // opening singles
            .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
            // closing singles & apostrophes
            .replace(/'/g, '\u2019')
            // opening doubles
            .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
            // closing doubles
            .replace(/"/g, '\u201d')
            // ellipses
            .replace(/\.{3}/g, '\u2026'));
    };
    /**
     * Mangle Links.
     */
    InlineLexer.prototype.mangle = function (text) {
        if (!this.options.mangle) {
            return text;
        }
        var out = '';
        var length = text.length;
        for (var i = 0; i < length; i++) {
            var str = void 0;
            if (Math.random() > 0.5) {
                str = 'x' + text.charCodeAt(i).toString(16);
            }
            out += '&#' + str + ';';
        }
        return out;
    };
    return InlineLexer;
}());
exports.InlineLexer = InlineLexer;
