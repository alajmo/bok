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
var interfaces_1 = require("./interfaces");
var marked_1 = require("./marked");
var BlockLexer = /** @class */ (function () {
    function BlockLexer(staticThis, options) {
        this.staticThis = staticThis;
        this.links = {};
        this.tokens = [];
        this.options = options || marked_1.Marked.options;
        this.setRules();
    }
    /**
     * Accepts Markdown text and returns object with tokens and links.
     *
     * @param src String of markdown source to be compiled.
     * @param options Hash of options.
     */
    BlockLexer.lex = function (src, options, top, isBlockQuote) {
        var lexer = new this(this, options);
        return lexer.getTokens(src, top, isBlockQuote);
    };
    BlockLexer.getRulesBase = function () {
        if (this.rulesBase) {
            return this.rulesBase;
        }
        var base = {
            newline: /^\n+/,
            code: /^( {4}[^\n]+\n*)+/,
            hr: /^( *[-*_]){3,} *(?:\n+|$)/,
            heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
            lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
            blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
            list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
            html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
            def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
            paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
            text: /^[^\n]+/,
            bullet: /(?:[*+-]|\d+\.)/,
            item: /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/
        };
        base.item = new extend_regexp_1.ExtendRegexp(base.item, 'gm').setGroup(/bull/g, base.bullet).getRegexp();
        base.list = new extend_regexp_1.ExtendRegexp(base.list)
            .setGroup(/bull/g, base.bullet)
            .setGroup('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
            .setGroup('def', '\\n+(?=' + base.def.source + ')')
            .getRegexp();
        var tag = '(?!(?:' +
            'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code' +
            '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo' +
            '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';
        base.html = new extend_regexp_1.ExtendRegexp(base.html)
            .setGroup('comment', /<!--[\s\S]*?-->/)
            .setGroup('closed', /<(tag)[\s\S]+?<\/\1>/)
            .setGroup('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
            .setGroup(/tag/g, tag)
            .getRegexp();
        base.paragraph = new extend_regexp_1.ExtendRegexp(base.paragraph)
            .setGroup('hr', base.hr)
            .setGroup('heading', base.heading)
            .setGroup('lheading', base.lheading)
            .setGroup('blockquote', base.blockquote)
            .setGroup('tag', '<' + tag)
            .setGroup('def', base.def)
            .getRegexp();
        return (this.rulesBase = base);
    };
    BlockLexer.getRulesGfm = function () {
        if (this.rulesGfm) {
            return this.rulesGfm;
        }
        var base = this.getRulesBase();
        var gfm = __assign(__assign({}, base), {
            fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
            paragraph: /^/,
            heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
        });
        var group1 = gfm.fences.source.replace('\\1', '\\2');
        var group2 = base.list.source.replace('\\1', '\\3');
        gfm.paragraph = new extend_regexp_1.ExtendRegexp(base.paragraph).setGroup('(?!', "(?!" + group1 + "|" + group2 + "|").getRegexp();
        return (this.rulesGfm = gfm);
    };
    BlockLexer.getRulesTable = function () {
        if (this.rulesTables) {
            return this.rulesTables;
        }
        return (this.rulesTables = __assign(__assign({}, this.getRulesGfm()), {
            nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
            table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
        }));
    };
    BlockLexer.prototype.setRules = function () {
        if (this.options.gfm) {
            if (this.options.tables) {
                this.rules = this.staticThis.getRulesTable();
            }
            else {
                this.rules = this.staticThis.getRulesGfm();
            }
        }
        else {
            this.rules = this.staticThis.getRulesBase();
        }
        this.hasRulesGfm = this.rules.fences !== undefined;
        this.hasRulesTables = this.rules.table !== undefined;
    };
    /**
     * Lexing.
     */
    BlockLexer.prototype.getTokens = function (src, top, isBlockQuote) {
        var nextPart = src;
        var execArr;
        mainLoop: while (nextPart) {
            // newline
            if ((execArr = this.rules.newline.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                if (execArr[0].length > 1) {
                    this.tokens.push({ type: interfaces_1.TokenType.space });
                }
            }
            // code
            if ((execArr = this.rules.code.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                var code = execArr[0].replace(/^ {4}/gm, '');
                this.tokens.push({
                    type: interfaces_1.TokenType.code,
                    text: !this.options.pedantic ? code.replace(/\n+$/, '') : code
                });
                continue;
            }
            // fences code (gfm)
            if (this.hasRulesGfm && (execArr = this.rules.fences.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                this.tokens.push({
                    type: interfaces_1.TokenType.code,
                    lang: execArr[2],
                    text: execArr[3] || ''
                });
                continue;
            }
            // heading
            if ((execArr = this.rules.heading.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                this.tokens.push({
                    type: interfaces_1.TokenType.heading,
                    depth: execArr[1].length,
                    text: execArr[2]
                });
                continue;
            }
            // table no leading pipe (gfm)
            if (top && this.hasRulesTables && (execArr = this.rules.nptable.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                var item = {
                    type: interfaces_1.TokenType.table,
                    header: execArr[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                    align: execArr[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                    cells: []
                };
                for (var i = 0; i < item.align.length; i++) {
                    if (/^ *-+: *$/.test(item.align[i])) {
                        item.align[i] = 'right';
                    }
                    else if (/^ *:-+: *$/.test(item.align[i])) {
                        item.align[i] = 'center';
                    }
                    else if (/^ *:-+ *$/.test(item.align[i])) {
                        item.align[i] = 'left';
                    }
                    else {
                        item.align[i] = null;
                    }
                }
                var td = execArr[3].replace(/\n$/, '').split('\n');
                for (var i = 0; i < td.length; i++) {
                    item.cells[i] = td[i].split(/ *\| */);
                }
                this.tokens.push(item);
                continue;
            }
            // lheading
            if ((execArr = this.rules.lheading.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                this.tokens.push({
                    type: interfaces_1.TokenType.heading,
                    depth: execArr[2] === '=' ? 1 : 2,
                    text: execArr[1]
                });
                continue;
            }
            // hr
            if ((execArr = this.rules.hr.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                this.tokens.push({ type: interfaces_1.TokenType.hr });
                continue;
            }
            // blockquote
            if ((execArr = this.rules.blockquote.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                this.tokens.push({ type: interfaces_1.TokenType.blockquoteStart });
                var str = execArr[0].replace(/^ *> ?/gm, '');
                // Pass `top` to keep the current
                // "toplevel" state. This is exactly
                // how markdown.pl works.
                this.getTokens(str);
                this.tokens.push({ type: interfaces_1.TokenType.blockquoteEnd });
                continue;
            }
            // list
            if ((execArr = this.rules.list.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                var bull = execArr[2];
                this.tokens.push({ type: interfaces_1.TokenType.listStart, ordered: bull.length > 1 });
                // Get each top-level item.
                var str = execArr[0].match(this.rules.item);
                var length_1 = str.length;
                var next = false;
                var space = void 0;
                var blockBullet = void 0;
                var loose = void 0;
                for (var i = 0; i < length_1; i++) {
                    var item = str[i];
                    // Remove the list item's bullet so it is seen as the next token.
                    space = item.length;
                    item = item.replace(/^ *([*+-]|\d+\.) +/, '');
                    // Outdent whatever the list item contains. Hacky.
                    if (item.indexOf('\n ') !== -1) {
                        space -= item.length;
                        item = !this.options.pedantic
                            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
                            : item.replace(/^ {1,4}/gm, '');
                    }
                    // Determine whether the next list item belongs here.
                    // Backpedal if it does not belong in this list.
                    if (this.options.smartLists && i !== length_1 - 1) {
                        blockBullet = this.staticThis.getRulesBase().bullet.exec(str[i + 1])[0];
                        if (bull !== blockBullet && !(bull.length > 1 && blockBullet.length > 1)) {
                            nextPart = str.slice(i + 1).join('\n') + nextPart;
                            i = length_1 - 1;
                        }
                    }
                    // Determine whether item is loose or not.
                    // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
                    // for discount behavior.
                    loose = next || /\n\n(?!\s*$)/.test(item);
                    if (i !== length_1 - 1) {
                        next = item.charAt(item.length - 1) === '\n';
                        if (!loose) {
                            loose = next;
                        }
                    }
                    this.tokens.push({ type: loose ? interfaces_1.TokenType.looseItemStart : interfaces_1.TokenType.listItemStart });
                    // Recurse.
                    this.getTokens(item, false, isBlockQuote);
                    this.tokens.push({ type: interfaces_1.TokenType.listItemEnd });
                }
                this.tokens.push({ type: interfaces_1.TokenType.listEnd });
                continue;
            }
            // html
            if ((execArr = this.rules.html.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                var attr = execArr[1];
                var isPre = attr === 'pre' || attr === 'script' || attr === 'style';
                this.tokens.push({
                    type: this.options.sanitize ? interfaces_1.TokenType.paragraph : interfaces_1.TokenType.html,
                    pre: !this.options.sanitizer && isPre,
                    text: execArr[0]
                });
                continue;
            }
            // def
            if (top && (execArr = this.rules.def.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                this.links[execArr[1].toLowerCase()] = {
                    href: execArr[2],
                    title: execArr[3]
                };
                continue;
            }
            // table (gfm)
            if (top && this.hasRulesTables && (execArr = this.rules.table.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                var item = {
                    type: interfaces_1.TokenType.table,
                    header: execArr[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                    align: execArr[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                    cells: []
                };
                for (var i = 0; i < item.align.length; i++) {
                    if (/^ *-+: *$/.test(item.align[i])) {
                        item.align[i] = 'right';
                    }
                    else if (/^ *:-+: *$/.test(item.align[i])) {
                        item.align[i] = 'center';
                    }
                    else if (/^ *:-+ *$/.test(item.align[i])) {
                        item.align[i] = 'left';
                    }
                    else {
                        item.align[i] = null;
                    }
                }
                var td = execArr[3].replace(/(?: *\| *)?\n$/, '').split('\n');
                for (var i = 0; i < td.length; i++) {
                    item.cells[i] = td[i].replace(/^ *\| *| *\| *$/g, '').split(/ *\| */);
                }
                this.tokens.push(item);
                continue;
            }
            // simple rules
            if (this.staticThis.simpleRules.length) {
                var simpleRules = this.staticThis.simpleRules;
                for (var i = 0; i < simpleRules.length; i++) {
                    if ((execArr = simpleRules[i].exec(nextPart))) {
                        nextPart = nextPart.substring(execArr[0].length);
                        var type = 'simpleRule' + (i + 1);
                        this.tokens.push({ type: type, execArr: execArr });
                        continue mainLoop;
                    }
                }
            }
            // top-level paragraph
            if (top && (execArr = this.rules.paragraph.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                if (execArr[1].slice(-1) === '\n') {
                    this.tokens.push({
                        type: interfaces_1.TokenType.paragraph,
                        text: execArr[1].slice(0, -1)
                    });
                }
                else {
                    this.tokens.push({
                        type: this.tokens.length > 0 ? interfaces_1.TokenType.paragraph : interfaces_1.TokenType.text,
                        text: execArr[1]
                    });
                }
                continue;
            }
            // text
            // Top-level should never reach here.
            if ((execArr = this.rules.text.exec(nextPart))) {
                nextPart = nextPart.substring(execArr[0].length);
                this.tokens.push({ type: interfaces_1.TokenType.text, text: execArr[0] });
                continue;
            }
            if (nextPart) {
                throw new Error('Infinite loop on byte: ' + nextPart.charCodeAt(0) + (", near text '" + nextPart.slice(0, 30) + "...'"));
            }
        }
        return { tokens: this.tokens, links: this.links };
    };
    BlockLexer.simpleRules = [];
    return BlockLexer;
}());
exports.BlockLexer = BlockLexer;
