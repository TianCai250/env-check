const vscode = require("vscode");

const fileCheckNames = [".env.prod", ".env.production"];
const fileCheckWords = "test";

function activate(context) {
  initHover();
  // 获取当前的活动文本编辑器
  let activeEditor = vscode.window.activeTextEditor;
  handleActiveEditor(context, activeEditor);
  // 监听活动文本编辑器的变化
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (!editor) {
      return;
    }
    // 获取当前活动的文本编辑器
    let activeEditor = vscode.window.activeTextEditor;
    handleActiveEditor(context, activeEditor);
  });
}

function handleActiveEditor(context, activeEditor) {
  if (!activeEditor) {
    return;
  }
  // 获取当前打开的文件名
  const fileName = activeEditor.document.fileName;
  // 在输出控制台打印文件名
  if (fileCheckNames.some((item) => fileName.toLowerCase().endsWith(item))) {
    initUnderline(context);
  }
}

function initUnderline(context) {
  // 创建一个装饰类型，用于模拟波浪线效果
  const lineDecorationType = vscode.window.createTextEditorDecorationType({
    isWholeLine: false, // 只应用于匹配的文本，而不是整行
    // textDecoration: "underline", 
    backgroundColor: '#f56c6c50', 
  });

  // 监听文档内容改变事件
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      updateDecorations(event.document, lineDecorationType);
    })
  );

  // 初始化时检查已打开的文档
  updateDecorations(
    vscode.window.activeTextEditor.document,
    lineDecorationType
  );
}

function initHover() {
  // 注册 Hover Provider，适用于所有语言
  vscode.languages.registerHoverProvider("*", {
    provideHover(document, position, token) {
      // 获取悬停位置的单词
      const wordRange = document.getWordRangeAtPosition(position);
      if (!wordRange) {
        return undefined;
      }
      // 从文档中获取单词
      const word = document.getText(wordRange);
      if (
        word.toLowerCase().indexOf(fileCheckWords) > -1 &&
        fileCheckNames.some((item) =>
          vscode.window.activeTextEditor.document.fileName
            .toLowerCase()
            .endsWith(item)
        )
      ) {
        // 创建 hover 内容
        let content = `请检查正式环境中是否引用了测试环境变量！`;
        const hoverContent = new vscode.MarkdownString(content);
        hoverContent.isTrusted = true; // 标记内容为受信任的，以启用 Markdown 渲染

        // 创建 Hover 对象并返回
        return new vscode.Hover(hoverContent, wordRange);
      }
      return;
    },
  });
}

function updateDecorations(document, decorationType) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  // 清除之前的装饰
  editor.setDecorations(decorationType, []);

  // 假设我们筛选所有包含"variable"的文本
  const regex = new RegExp(fileCheckWords, "g");
  let match;
  const decorations = [];
  // 遍历文档并找到所有匹配项
  while ((match = regex.exec(document.getText().toLowerCase()))) {
    // 创建一个范围来匹配找到的变量
    const range = new vscode.Range(
      document.positionAt(match.index),
      document.positionAt(match.index + match[0].length)
    );
    decorations.push({
      range,
      decorationType,
    });
  }
  // 应用装饰
  editor.setDecorations(decorationType, decorations);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
