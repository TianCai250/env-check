var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(src_exports);
var import_vscode = __toESM(require("vscode"));
var fileCheckNames = [".env.prod", ".env.production"];
var fileCheckWords = "test";
function activate(context) {
  initHover();
  let activeEditor = import_vscode.default.window.activeTextEditor;
  handleActiveEditor(context, activeEditor);
  import_vscode.default.window.onDidChangeActiveTextEditor((editor) => {
    if (!editor) {
      return;
    }
    let activeEditor2 = import_vscode.default.window.activeTextEditor;
    handleActiveEditor(context, activeEditor2);
  });
}
function handleActiveEditor(context, activeEditor) {
  if (!activeEditor) {
    return;
  }
  const fileName = activeEditor.document.fileName;
  if (fileCheckNames.some((item) => fileName.toLowerCase().endsWith(item))) {
    initUnderline(context);
  }
}
function initUnderline(context) {
  const lineDecorationType = import_vscode.default.window.createTextEditorDecorationType({
    isWholeLine: false,
    // 只应用于匹配的文本，而不是整行
    // textDecoration: "underline",
    backgroundColor: "#f56c6c50"
  });
  context.subscriptions.push(
    import_vscode.default.workspace.onDidChangeTextDocument((event) => {
      if (fileCheckNames.some(
        (item) => import_vscode.default.window.activeTextEditor.document.fileName.toLowerCase().endsWith(item)
      )) {
        updateDecorations(event.document, lineDecorationType);
      }
    })
  );
  updateDecorations(import_vscode.default.window.activeTextEditor.document, lineDecorationType);
}
function initHover() {
  import_vscode.default.languages.registerHoverProvider("*", {
    provideHover(document, position, token) {
      const wordRange = document.getWordRangeAtPosition(position);
      if (!wordRange) {
        return void 0;
      }
      const word = document.getText(wordRange);
      if (word.toLowerCase().indexOf(fileCheckWords) > -1 && fileCheckNames.some(
        (item) => import_vscode.default.window.activeTextEditor.document.fileName.toLowerCase().endsWith(item)
      )) {
        let content = `\u8BF7\u68C0\u67E5\u6B63\u5F0F\u73AF\u5883\u4E2D\u662F\u5426\u5F15\u7528\u4E86\u6D4B\u8BD5\u73AF\u5883\u53D8\u91CF\uFF01`;
        const hoverContent = new import_vscode.default.MarkdownString(content);
        hoverContent.isTrusted = true;
        return new import_vscode.default.Hover(hoverContent, wordRange);
      }
      return;
    }
  });
}
function updateDecorations(document, decorationType) {
  const editor = import_vscode.default.window.activeTextEditor;
  if (!editor) {
    return;
  }
  editor.setDecorations(decorationType, []);
  const regex = new RegExp(fileCheckWords, "g");
  let match;
  const decorations = [];
  while (match = regex.exec(document.getText().toLowerCase())) {
    const range = new import_vscode.default.Range(
      document.positionAt(match.index),
      document.positionAt(match.index + match[0].length)
    );
    decorations.push(range);
  }
  editor.setDecorations(decorationType, decorations);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
