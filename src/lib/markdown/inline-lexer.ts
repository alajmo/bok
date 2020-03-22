/**
 * @license
 *
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 *
 * Copyright (c) 2018, Костя Третяк. (MIT Licensed)
 * https://github.com/ts-stack/markdown
 */
import {
  Link,
  Links,
  MarkedOptions,
  RulesInlineBase,
  RulesInlineBreaks,
  RulesInlineCallback,
  RulesInlineGfm,
  RulesInlinePedantic,
} from './interfaces.ts';
import { Renderer } from './renderer.ts';

/**
 * Inline Lexer & Compiler.
 */
export declare class InlineLexer {
  protected staticThis: typeof InlineLexer;
  protected links: Links;
  protected options: MarkedOptions;
  protected static rulesBase: RulesInlineBase;
  /**
   * Pedantic Inline Grammar.
   */
  protected static rulesPedantic: RulesInlinePedantic;
  /**
   * GFM Inline Grammar
   */
  protected static rulesGfm: RulesInlineGfm;
  /**
   * GFM + Line Breaks Inline Grammar.
   */
  protected static rulesBreaks: RulesInlineBreaks;
  protected rules:
    | RulesInlineBase
    | RulesInlinePedantic
    | RulesInlineGfm
    | RulesInlineBreaks;
  protected renderer: Renderer;
  protected inLink: boolean;
  protected hasRulesGfm: boolean;
  protected ruleCallbacks: RulesInlineCallback[];
  constructor(
    staticThis: typeof InlineLexer,
    links: Links,
    options?: MarkedOptions,
    renderer?: Renderer,
  );
  /**
   * Static Lexing/Compiling Method.
   */
  static output(src: string, links: Links, options: MarkedOptions): string;
  protected static getRulesBase(): RulesInlineBase;
  protected static getRulesPedantic(): RulesInlinePedantic;
  protected static getRulesGfm(): RulesInlineGfm;
  protected static getRulesBreaks(): RulesInlineBreaks;
  protected setRules(): void;
  /**
   * Lexing/Compiling.
   */
  output(nextPart: string): string;
  /**
   * Compile Link.
   */
  protected outputLink(execArr: RegExpExecArray, link: Link): string;
  /**
   * Smartypants Transformations.
   */
  protected smartypants(text: string): string;
  /**
   * Mangle Links.
   */
  protected mangle(text: string): string;
}
