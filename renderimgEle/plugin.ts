/**
 * @description attachment plugin
 * @author wangfupeng
 */

import { DomEditor, SlateTransforms } from "@wangeditor/editor";
import type { IDomEditor } from "@wangeditor/editor-for-vue";
// import { Editor } from "@wangeditor/editor-for-vue";
// import { Transforms,Point,Range,Path,Editor } from "slate";

function withImage<T extends IDomEditor>(editor: T): T {
  const { isVoid, normalizeNode } = editor;
  const newEditor = editor;

  // newEditor.isInline = elem => {
  //   const { type } = elem;
  //   if (type === "customimage") return true;
  //   return isInline(elem);
  // };
  //  重写 isVoid
  newEditor.isVoid = elem => {
    const { type } = elem;

    if (type === "customimage") {
      return true;
    }
    return isVoid(elem);
  };
  newEditor.normalizeNode = ([node, path]) => {
    const type = DomEditor.getNodeType(node);
    if (type !== "customimage") {
      // 未命中 thingImage ，执行默认的 normalizeNode
      return normalizeNode([node, path]);
    }
    const topLevelNodes = newEditor.children || [];
    const nextNode = topLevelNodes[path[0] + 1] || {};
    const nextNodeType = DomEditor.getNodeType(nextNode);
    if (
      nextNodeType !== "paragraph" &&
      nextNodeType !== "blockquote" &&
      !nextNodeType.startsWith("header")
    ) {
      // normalizeNode node 后面不是 p 或 header ，则插入一个空 p
      const p = { type: "paragraph", children: [{ text: "" }] };
      const insertPath = [path[0] + 1];
      SlateTransforms.insertNodes(newEditor, p, {
        at: insertPath
      });
    }
  };

  return newEditor;
}

export default withImage;
