import { path, log } from '../../deps.ts';
import { Site } from '../core/config.ts';

export { parseToc, TocRender };

function parseToc(site: Site): any {
  const content = Deno.readTextFileSync(site.files.file);
  const reader = TocReader(content);
  const lexer = TocLexer(reader);
  const { files, ast } = TocParser(lexer);

  return { files, ast };
}

function TocReader(chars: string) {
  let i = 0;

  function peek(nth: number = 0) {
    return chars[i + nth];
  }

  function consume(nth: number = 0) {
    const c = chars[i + nth];
    i = i + nth + 1;

    return c;
  }

  function isEOF() {
    return chars.length - 1 < i;
  }

  return Object.freeze({
    peek,
    consume,
    isEOF,
  });
}

enum TokenType {
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACE,
  RIGHT_BRACE,
  SPACE,
  INDENT,
  DASH,

  STRING,
  HASH,
  HORIZONTAL_RULE,

  EOF,
}

interface Token {
  type: TokenType;
  lexeme: string | null;
}

function TocLexer(reader: any) {
  let i = 0;
  const tokens: Token[] = [];

  run();

  function run() {
    while (!reader.isEOF()) {
      scanToken();
    }

    addToken(TokenType.EOF);
  }

  function scanToken() {
    const c = reader.consume();

    switch (c) {
      case '\n':
        break;
      case ' ':
        if (reader.peek() === ' ') {
          addToken(TokenType.INDENT);
          reader.consume();
        }
        break;
      case '[':
        addToken(TokenType.LEFT_BRACE);
        break;
      case ']':
        addToken(TokenType.RIGHT_BRACE);
        break;
      case '(':
        addToken(TokenType.LEFT_PAREN);
        break;
      case ')':
        addToken(TokenType.RIGHT_PAREN);
        break;
      case '#':
        header();
        break;
      case '-':
        if (reader.peek() === '-' && reader.peek(1) === '-') {
          reader.consume();
          reader.consume();
          addToken(TokenType.HORIZONTAL_RULE);
        } else {
          addToken(TokenType.DASH);
        }
        break;
      default:
        stringLiteral(c);
        break;
    }
  }

  function header() {
    let text = '';
    while (reader.peek() !== '\n' && !reader.isEOF()) {
      text += reader.consume();
    }

    text = text.trim();

    addToken(TokenType.HASH, text);
  }

  function stringLiteral(c: string) {
    let text = c;
    let unClosedParens = 0;
    let unClosedBraces = 0;

    while (reader.peek() !== '\n' && !reader.isEOF()) {
      const nth = reader.peek();

      if (nth === '(') {
        unClosedParens += 1;
      } else if (nth === ')' && unClosedParens === 0) {
        break;
      } else if (nth === ')') {
        unClosedParens -= 1;
      } else if (nth === '[') {
        unClosedBraces += 1;
      } else if (nth === ']' && unClosedBraces === 0) {
        break;
      } else if (nth === ']') {
        unClosedBraces -= 1;
      }

      // All BRACE and PARENS must be closed
      text += reader.consume();
    }

    addToken(TokenType.STRING, text);
  }

  function addToken(type: TokenType, lexeme: string | null = null) {
    tokens.push({ type, lexeme });
  }

  function peek(nth: number = 0) {
    return tokens[i + nth].type;
  }

  function consume(nth: number = 0) {
    const t = tokens[i + nth];
    i = i + nth + 1;

    return t;
  }

  function isEOF() {
    return tokens.length - 1 < i;
  }

  function printTokens() {
    tokens.map(k => {
      log.info(`type: ${TokenType[k.type]} lexeme: ${k.lexeme}`);
    });
  }

  function printTokenType() {
    tokens.map(k => {
      log.info(`${TokenType[k.type]}`);
    });
  }

  return Object.freeze({ peek, consume, isEOF, printTokens, printTokenType });
}

function TocParser(lexer: any) {
  function hr() {
    return { type: 'hr', indent: 0 };
  }

  function header(text: string) {
    return { type: 'header', text, indent: 0 };
  }

  function link(title: string, ref: string = '') {
    return { type: 'link', title, ref, indent: 0 };
  }

  function list(children: any[] = []) {
    return { type: 'list', children };
  }

  function listItem(title: string, ref: string = '', indent: number): any {
    return {
      type: 'listItem',
      title,
      ref,
      indent,
    };
  }

  function createAST(statements: any): any {
    const listRefs: any = { 0: list() };
    statements.forEach((v: any, i: number, arr: any) => {
      if (i > 0 && arr[i - 1].indent > v.indent) {
        delete listRefs[arr[i - 1].indent];
      }

      if (listRefs.hasOwnProperty(v.indent)) {
        listRefs[v.indent].children.push(v);
      } else {
        listRefs[v.indent] = {
          type: 'list',
          children: [v],
        };

        listRefs[v.indent - 1].children.push(listRefs[v.indent]);
      }
    });

    return listRefs[0];
  }

  function parse() {
    const statements = [];
    while (!lexer.isEOF()) {
      const expr = expression();

      if (expr) {
        statements.push(expr);
      }
    }

    return {
      files: statements.filter(t => ['listItem', 'link'].includes(t.type)),
      ast: createAST(statements),
    };
  }

  /*
  expression -> hr | header | link | list

  hr     ->  ---
  header ->  # STRING
  link   ->  "[" STRING "]" "(" STRING? ")" | list
  list   ->  "INDENT"+ "-" link
  */
  function expression(numIndent = 0): any {
    const token = lexer.consume();

    switch (token.type) {
      case TokenType.HORIZONTAL_RULE:
        return hr();
      case TokenType.HASH:
        return header(token.lexeme);
      case TokenType.LEFT_BRACE:
        return parseLink();
      case TokenType.INDENT:
        return expression(numIndent + 1);
      case TokenType.DASH:
        return parseListItem(numIndent);
      default:
    }
  }

  function parseListItem(numIndent = 0): any {
    if (
      lexer.peek(0) === TokenType.LEFT_BRACE &&
      lexer.peek(1) === TokenType.STRING &&
      lexer.peek(2) === TokenType.RIGHT_BRACE
    ) {
      const title = lexer.consume(1);
      let ref = '';
      if (lexer.peek(2) === TokenType.STRING) {
        ref = lexer.consume(2);
      }

      lexer.consume(); // Consume right parens

      return listItem(title.lexeme, ref.lexeme, numIndent);
    }
  }

  function parseLink(): any {
    if (
      lexer.peek() === TokenType.STRING &&
      lexer.peek(1) === TokenType.RIGHT_BRACE
    ) {
      const title = lexer.consume();
      const ref = lexer.consume(2);
      lexer.consume();

      return link(title.lexeme, ref.lexeme);
    }
  }

  return parse();
}

function TocRender(site: Site, ast: any, currentFileName: string) {
  const activePage = formatUrl(currentFileName);

  function formatUrl(currentFileName) {
    let link = stripExtension(currentFileName);
    link = link.replace(site.paths.content, '');

    return link;
  }

  function stripExtension(url) {
    let link = path.relative(site.paths.content, url);
    link = path.join('/', path.dirname(url), path.basename(url, '.md'));

    if (site.uglyURLs) {
      link += '.html';
    }

    return link;
  }

  function hr() {
    return '<li class="spacer"></li>';
  }

  function header(e: any) {
    return `<li class="part-title">${e.text}</li>`;
  }

  function link(e: any): any {
    let ref = e.ref !== '' ? stripExtension(e.ref) : '';
    const linkClass = ref === activePage ? 'active' : '';

    // We treat index.md in root file differently
    if (ref === '/index') {
      ref = '/';
    }

    return ref
      ? `<li><a class="${linkClass}"  href="${ref}">${e.title}</a></li>`
      : `<li class="draft">${e.title}</li>`;
  }

  function listItem(e: any, order: number[]) {
    let ref = e.ref !== '' ? stripExtension(e.ref) : '';

    const linkClass = ref === activePage ? 'active' : '';

    // We treat index.md in root file differently
    if (ref === '/index') {
      ref = '/';
    }

    return ref
      ? `
      <li class="chapter-item">
        <strong>${[...order, ''].join('.')}</strong>
        &nbsp;
        <a class="${linkClass}"
           href="${ref}">${e.title}</a>
      </li>
    `
      : `
      <li class="chapter-item draft">
        <strong>${[...order, ''].join('.')}</strong>
        &nbsp;
        ${e.title}
      </li>
    `;
  }

  function list(e: any, order: number[]): any {
    return `
        <li>
          <ol class="section">
            ${e.children
              .map((node: any, i: number) =>
                node.type === 'list'
                  ? list(node, [...order, i + 1])
                  : listItem(node, [...order, i + 1]),
              )
              .join('')}
          </ol>
        </li>
      `;
  }

  let order = 0;
  return `<ol class="toc">${ast.children
    .map((e: any) => {
      switch (e.type) {
        case 'hr':
          return hr();
        case 'header':
          return header(e);
        case 'link':
          return link(e);
        case 'listItem':
          order += 1;
          return listItem(e, [order]);
        case 'list':
          return list(e, [order]);
        default:
      }
    })
    .join('')}</ol>`;
}
