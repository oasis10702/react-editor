// Import React dependencies.
import React, {  useMemo, useState, useCallback } from "react";
import { createEditor, Transforms, Editor, Text } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import "./App.css";

const App = () => {
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ]);
  const editor = useMemo(() => withReact(createEditor()), []);

  // 基于传递的 props 定义一个渲染函数。
  // 我们在这里使用 useCallback 在随后的渲染中记住这个函数。
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // 通过 useCallback 定义一个可以记忆的渲染叶子节点的函数
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div className="App">
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      >
        <Editable
          renderElement={renderElement}
             // 传递渲染叶子节点函数
        renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            if (!event.ctrlKey) {
              return;
            }

            switch (event.key) {
              // 当按下 "`" ，保留我们代码块存在的逻辑
              case "`": {
                event.preventDefault();
                const [match] = Editor.nodes(editor, {
                  match: (n) => n.type === "code",
                });
                Transforms.setNodes(
                  editor,
                  { type: match ? "paragraph" : "code" },
                  { match: (n) => Editor.isBlock(editor, n) }
                );
                break;
              }

              // 当按下 "B" ，加粗所选择的文本
              case "b": {
                event.preventDefault();
                Transforms.setNodes(
                  editor,
                  { bold: true },
                  // 应用到文本节点上，
                  // 如果所选内容仅仅是全部文本的一部分，则拆分它们。
                  { match: (n) => Text.isText(n), split: true }
                );
                break;
              }
              default:
                break;
            }
          }}
        />
      </Slate>
    </div>
  );
};

// 为 code 节点定义一个 React 组件渲染器
const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};

// Define a React component to render leaves with bold text.
const Leaf = (props) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};

export default App;
