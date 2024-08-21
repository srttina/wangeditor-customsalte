import type { Element } from "slate";
import { h, type VNode } from "snabbdom";
import { DomEditor, SlateTransforms } from "@wangeditor/editor";
import type { IDomEditor } from "@wangeditor/editor-for-vue";
import type { videomentElement } from "./custom-types";

/**
 * 渲染元素到编辑器
 * @param elem 附件元素，
 * @param children 元素子节点，void 元素可忽略
 * @param editor 编辑器实例
 * @returns vnode 节点（通过 snabbdom.js 的 h 函数生成）
 */
function renderVideoment(
  elemNode: Element,
  children: VNode[] | null,
  editor: IDomEditor
): VNode {
  const {
    src = "",
    poster = "",
    // width = "auto",
    // height = "auto",
    videoId = "",
    altDes = ""
  } = elemNode as videomentElement;

  // 是否选中
  const selected = DomEditor.isNodeSelected(editor, elemNode);
  // const isDisabled = editor.isDisabled();
  const placeholderText = "点击输入视频注释";

  const videoVnode = h(
    "video",
    {
      props: {
        src: src,
        poster: poster,
        // width: width !== "auto" ? width : "auto",
        // height: height !== "auto" ? height : "auto",
        controls: true
      },
      attrs: {
        "data-id": videoId,
        "data-alt": altDes
      },
      style: {
        margin: "0 auto",
        height: "auto", // 设置高度为 auto
        objectFit: "contain" // 设置 object-fit 为 contain
      }
    },
    [
      h("source", {
        props: {
          src: src,
          type: "video/mp4"
        }
      })
    ]
  );
  const remarkVnode = h(
    "div",
    {
      props: {
        className: "altinput"
      },
      style: {
        margin: "0 auto",
        marginTop: "10px",
        height: "40px",
        border: "1px solid #ccc",
        padding: "0 5px",
        width: "300px",
        boxSizing: "border-box"
      },
      on: {
        click() {
          
        }
      }
    },
    [
      h("input", {
        props: {
          className: "videoremark",
          placeholder: placeholderText,
          type: "text",
          maxlength: 15,
          value: altDes
        },
        style: {
          width: "245px",
          height: "38px"
        },
        on: {
          click(e) {
            const inputElement = e.target as HTMLInputElement;
            if (inputElement) {
              inputElement.focus();
            }
          },
          change(e) {
            const target = e.target as HTMLInputElement;
            if (target.value.length > 15) {
              target.value = target.value.slice(0, 15);
            }
          },
          input(e) {
            const target = e.target as HTMLInputElement;
            const path = DomEditor.findPath(editor, elemNode);
            if (target.value.length > 15) {
              target.value = target.value.slice(0, 15);
            }
            SlateTransforms.setNodes(
              editor,
              {
                altDes: target.value
              },
              {
                at: path,
                mode: "highest" // 针对最高层级的节点
              }
            );
          }
        }
      }),
      h(
        "span",
        {
          props: {
            className: "remarklimit"
          },
          style: {
            color: "#ccc",
            fontSize: "12px"
          }
        },
        [`${altDes.length}/15`]
      )
    ]
  );

  const containerVnode = h(
    "div",
    {
      props: {
        contentEditable: false
      },
      on: {
        mousedown: e => {
          e.preventDefault();
        }
      }
    },
    [
      h(
        "div",
        {
          props: {
            className: "w-e-textarea-video-container"
          },
          attrs: {
            "data-selected": selected ? "true" : ""
          }
        },
        [videoVnode, remarkVnode]
      )
    ]
  );

  return containerVnode;
}

const renderVideoConf = {
  type: "customvideo", // 和 elemNode.type 一致
  renderElem: renderVideoment
};
export { renderVideoConf };
