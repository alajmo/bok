/**
 * @license
 *
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 *
 * Copyright (c) 2018, Костя Третяк. (MIT Licensed)
 * https://github.com/ts-stack/markdown
 */
import { LexerReturns, Links, MarkedOptions, RulesBlockBase, RulesBlockGfm, RulesBlockTables, Token } from './interfaces.ts';

export declare class BlockLexer<T extends typeof BlockLexer> {
    protected staticThis: typeof BlockLexer;
    static simpleRules: RegExp[];
    protected static rulesBase: RulesBlockBase;
    /**
     * GFM Block Grammar.
     */
    protected static rulesGfm: RulesBlockGfm;
    /**
     * GFM + Tables Block Grammar.
     */
    protected static rulesTables: RulesBlockTables;
    protected rules: RulesBlockBase | RulesBlockGfm | RulesBlockTables;
    protected options: MarkedOptions;
    protected links: Links;
    protected tokens: Token[];
    protected hasRulesGfm: boolean;
    protected hasRulesTables: boolean;
    constructor(staticThis: typeof BlockLexer, options?: object);
    /**
     * Accepts Markdown text and returns object with tokens and links.
     *
     * @param src String of markdown source to be compiled.
     * @param options Hash of options.
     */
    static lex(src: string, options?: MarkedOptions, top?: boolean, isBlockQuote?: boolean): LexerReturns;
    protected static getRulesBase(): RulesBlockBase;
    protected static getRulesGfm(): RulesBlockGfm;
    protected static getRulesTable(): RulesBlockTables;
    protected setRules(): void;
    /**
     * Lexing.
     */
    protected getTokens(src: string, top?: boolean, isBlockQuote?: boolean): LexerReturns;
}
