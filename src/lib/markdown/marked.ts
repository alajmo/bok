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
  DebugReturns,
  LexerReturns,
  Links,
  MarkedOptions,
  SimpleRenderer,
  Token,
} from './interfaces.ts';

export declare class Marked {
  static options: MarkedOptions;
  protected static simpleRenderers: SimpleRenderer[];
  /**
   * Merges the default options with options that will be set.
   *
   * @param options Hash of options.
   */
  static setOptions(options: MarkedOptions): typeof Marked;
  /**
   * Setting simple block rule.
   */
  static setBlockRule(regexp: RegExp, renderer?: SimpleRenderer): typeof Marked;
  /**
   * Accepts Markdown text and returns text in HTML format.
   *
   * @param src String of markdown source to be compiled.
   * @param options Hash of options. They replace, but do not merge with the default options.
   * If you want the merging, you can to do this via `Marked.setOptions()`.
   */
  static parse(src: string, options?: MarkedOptions): string;
  /**
   * Accepts Markdown text and returns object with text in HTML format,
   * tokens and links from `BlockLexer.parser()`.
   *
   * @param src String of markdown source to be compiled.
   * @param options Hash of options. They replace, but do not merge with the default options.
   * If you want the merging, you can to do this via `Marked.setOptions()`.
   */
  static debug(src: string, options?: MarkedOptions): DebugReturns;
  protected static callBlockLexer(
    src?: string,
    options?: MarkedOptions,
  ): LexerReturns;
  protected static callParser(
    tokens: Token[],
    links: Links,
    options?: MarkedOptions,
  ): string;
  protected static callMe(err: Error): string;
}
