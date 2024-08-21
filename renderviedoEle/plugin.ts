/**
 * @description attachment plugin
 * @author wangfupeng
 */

import { DomEditor, SlateTransforms } from "@wangeditor/editor";
import type { IDomEditor } from "@wangeditor/editor-for-vue";

import type { videomentElement } from "./custom-types";

function withVideo<T extends IDomEditor>(editor: T) {
  const { isVoid, normalizeNode } = editor;
  const newEditor = editor;

  // newEditor.isInline = (elem: videomentElement) => {
  //   const { type } = elem;
  //   if (type === "customvideo") return true;
  //   return isInline(elem);
  // };
  //  重写 isVoid
  newEditor.isVoid = (elem: videomentElement) => {
    const { type } = elem;

    if (type === "customvideo") {
      return true;
    }
    return isVoid(elem);
  };

  // 重写 normalizeNode
  newEditor.normalizeNode = ([node, path]) => {
    const type = DomEditor.getNodeType(node);
    if (type != "customvideo") {
      // // 执行默认的 normalizeNode ，重要！！！
      return normalizeNode([node, path]);
    }

    // ----------------- video 后面必须跟一个 p header blockquote -----------------

    const topLevelNodes = newEditor.children || [];
    const nextNode = topLevelNodes[path[0] + 1] || {};
    const nextNodeType = DomEditor.getNodeType(nextNode);
    if (
      nextNodeType !== "paragraph" &&
      nextNodeType !== "blockquote" &&
      !nextNodeType.startsWith("header")
    ) {
      // customvideo  node 后面不是 p 或 header ，则插入一个空 p
      const p = { type: "paragraph", children: [{ text: "" }] };
      const insertPath = [path[0] + 1];
      SlateTransforms.insertNodes(newEditor, p, {
        at: insertPath
      });
    }


  };

  return newEditor;
}

export default withVideo;
