export { parseFrontMatter };

function parseFrontMatter(data: any) {
  const splitted = data.split("\n");
  const paramLineNumber = splitted.indexOf("---");

  let ft: any = { params: {}, content: "" };
  for (let i = 0; i < paramLineNumber; i++) {
    let key = "";
    let value = "";
    let isKey = true;
    let isValue = false;

    for (let j = 0; j < splitted[i].length; j++) {
      if (splitted[i][j] === "\n") {
        break;
      }

      if (splitted[i][j] === ":" && isKey) {
        isKey = false;
        isValue = true;
        continue;
      }

      if (isKey) {
        key += splitted[i][j];
      }

      if (isValue) {
        value += splitted[i][j];
      }
    }

    ft.params[key] = value.trim();
  }

  ft.content = splitted.slice(paramLineNumber + 1, splitted.length).join("\n");

  return ft;
}
