import throttle from "lodash.throttle";
import { type Element as SlateElement, Transforms } from "slate";
import { h, type VNode } from "snabbdom";
import { DomEditor, SlateTransforms } from "@wangeditor/editor";
import type { IDomEditor } from "@wangeditor/editor-for-vue";
import type { ImageElement } from "./custom-types";
import $, { type Dom7Array } from "./utils/dom";

interface IImageSize {
  width?: string;
  height?: string;
}
function genContainerId(editor: IDomEditor, elemNode: SlateElement) {
  const { id } = DomEditor.findKey(editor, elemNode); // node 唯一 id
  return `w-e-image-container-${id}`;
}

const placeholderText = "点击输入图片注释";
/**
 * 未选中时，渲染 image container
 */
function renderContainer(
  editor: IDomEditor,
  elemNode: SlateElement,
  imageVnode: VNode,
  imageInfo: IImageSize
): VNode {
  const { width, height } = imageInfo;
  const style: any = {};
  if (width) style.width = width;
  if (height) style.height = height;

  const { altDes = "" } = elemNode as ImageElement;
  const containerId = genContainerId(editor, elemNode);

  const imgcontainerVnode = h(
    "div",
    {
      props: {
        id: containerId,
        className: "w-e-image-container"
      },
      style: style
    },
    [
      imageVnode,
      h(
        "div",
        {
          props: {
            className: "altinput"
          },
          style: {
            margin: "10px auto",
            height: "40px",
            border: "1px solid #ccc",
            padding: "0 5px",
            width: "300px",
            boxSizing: "border-box"
          },
          on: {
            click(e) {
              e.stopPropagation();
            }
          }
        },
        [
          h("input", {
            props: {
              className: "videoremark",
              placeholder: placeholderText,
              type: "text",
              value: altDes
            },
            style: {
              width: "245px",
              height: "38px"
            },
            on: {
              
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
      )
    ]
  );

 
  return imgcontainerVnode;
}

/**
 * 选中状态下，渲染 image container（渲染拖拽容器，修改图片尺寸）
 */
function renderResizeContainer(
  editor: IDomEditor,
  elemNode: SlateElement,
  imageVnode: VNode,
  imageInfo: IImageSize
) {
  const $body = $("body");
  const containerId = genContainerId(editor, elemNode);
  const { width, height } = imageInfo;

  let originalX = 0;
  let originalWith = 0;
  let originalHeight = 0;
  let revers = false; // 是否反转。如向右拖拽 right-top 需增加宽度（非反转），但向右拖拽 left-top 则需要减少宽度（反转）
  let $container: Dom7Array | null = null;

  const { altDes = "" } = elemNode as ImageElement;

  function getContainerElem(): Dom7Array {
    const $container = $(`#${containerId}`);
    if ($container.length === 0)
      throw new Error("Cannot find image container elem");
    return $container;
  }
  /**
   * 初始化。监听事件，记录原始数据
   */
  function init(clientX: number) {
    $container = getContainerElem();
    // 记录当前 x 坐标值
    originalX = clientX;
    // 记录 img 原始宽高
    const $img = $container.find("img");
    if ($img.length === 0) throw new Error("Cannot find image elem");
    originalWith = $img.width();
    originalHeight = $img.height();

    // 监听 mousemove
    $body.on("mousemove", onMousemove);

    // 监听 mouseup
    $body.on("mouseup", onMouseup);
    // 隐藏 hoverbar
    const hoverbar = DomEditor.getHoverbar(editor);
    if (hoverbar) hoverbar.hideAndClean();
  }
  // mouseover callback （节流）
  const onMousemove = throttle((e: Event) => {
    e.preventDefault();

    const { clientX } = e as MouseEvent;
    const gap = revers ? originalX - clientX : clientX - originalX; // 考虑是否反转
    const newWidth = originalWith + gap;
    const newHeight = originalHeight * (newWidth / originalWith); // 根据 width ，按比例计算 height

    // 实时修改 img 宽高 -【注意】这里只修改 DOM ，mouseup 时再统一不修改 node
    if ($container == null) return;
    if (newWidth <= 15 || newHeight <= 15) return; // 最小就是 15px

    $container.css("width", `${newWidth}px`);
    $container.css("height", `${newHeight}px`);
  }, 100);

  function onMouseup() {
    // 取消监听 mousemove
    $body.off("mousemove", onMousemove);

    if ($container == null) return;
    const newWidth = $container.width().toFixed(2);
    const newHeight = $container.height().toFixed(2);

    // 修改 node
    const props: Partial<ImageElement> = {
      style: {
        ...(elemNode as ImageElement).style,
        width: `${newWidth}px`,
        height: `${newHeight}px`
      }
    };
    Transforms.setNodes(editor, props, {
      at: DomEditor.findPath(editor, elemNode)
    });

    // 取消监听 mouseup
    $body.off("mouseup", onMouseup);
  }
  const style: any = {};
  if (width) style.width = width;
  if (height) style.height = height;
  // style.boxShadow = "0 0 0 2px #B4D5FF"; // 自定义 selected 样式，因为有拖拽触手
  style.border = "2px solid #B4D5FF";

  const insertimg = h(
    "div",
    {
      props: {
        id: containerId,
        className: "w-e-image-container w-e-selected-image-container"
      },
      style: style,
      on: {
        mousedown: (e: MouseEvent) => {
          const $target = $(e.target as Element);
          if (!$target.hasClass("w-e-image-dragger")) {
            // target 不是 .w-e-image-dragger 拖拽触手，则忽略
            return;
          }
          e.preventDefault();

          if ($target.hasClass("left-top") || $target.hasClass("left-bottom")) {
            revers = true; // 反转。向右拖拽，减少宽度
          }
          init(e.clientX); // 初始化
        }
      }
    },
    [
      imageVnode,
      h(
        "div",
        {
          props: {
            className: "altinput"
          },
          style: {
            margin: "10px auto",
            height: "40px",
            border: "1px solid #ccc",
            padding: "0 5px",
            width: "300px",
            boxSizing: "border-box"
          },
          on: {
            click(e) {
              e.stopPropagation();
            }
          }
        },
        [
          h("input", {
            props: {
              className: "videoremark",
              placeholder: placeholderText,
              type: "text",
              // maxlength: 15,
              value: altDes
            },
            style: {
              width: "245px",
              height: "38px"
            },
            on: {
              click(e) {
                e.stopPropagation();
                const inputElement = e.target as HTMLInputElement;
                if (inputElement) {
                  inputElement.focus();
                }
                // input获取焦点，设置父级不可编辑 重要！！！
                const containerElement = inputElement.closest(
                  ".w-e-image-container"
                ) as HTMLElement;
                containerElement.contentEditable = "false";
              },
              blur(e) {
                const inputElement = e.target as HTMLInputElement;
                const containerElement = inputElement.closest(
                  ".w-e-image-container"
                ) as HTMLElement;
                containerElement.contentEditable = "true";
              },
              input(e) {
                e.stopPropagation();
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
      )
     
    ]
  );

  return insertimg;
}
function renderImage(
  elemNode: SlateElement,
  children: VNode[] | null,
  editor: IDomEditor
): VNode {
  const {
    src,
    alt = "",
    href = "",
    style = {},
    altDes = ""
  } = elemNode as ImageElement;
  const { width = "", height = "" } = style;
  const selected = DomEditor.isNodeSelected(editor, elemNode); // 图片是否选中

  const imageStyle: any = {};
  if (width) imageStyle.width = "100%";
  if (height) imageStyle.height = "100%";

  // 【注意】void node 中，renderElem 不用处理 children 。core 会统一处理。
  const vnode = h("img", {
    props: {
      src: src,
      alt: alt
    },
    style: style,
    attrs: {
      "data-href": href,
      "data-desc": altDes
    }
  });

  const isDisabled = editor.isDisabled();

  if (selected && !isDisabled) {
    // 选中，未禁用 - 渲染 resize container
    return renderResizeContainer(editor, elemNode, vnode, { width, height });
  }

  // 其他，渲染普通 image container
  return renderContainer(editor, elemNode, vnode, { width, height });
}

const renderImageConf = {
  type: "customimage", // 和 elemNode.type 一致
  renderElem: renderImage
};

export { renderImageConf };
