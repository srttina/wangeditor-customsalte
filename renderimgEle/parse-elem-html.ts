import type { ImageElement } from "./custom-types";
import $, { type DOMElement, getStyleValue } from "./utils/dom";
function parseHtml(elem: DOMElement): ImageElement {
  // const $elem = $(elem);
  const $elem = $(elem.querySelector("img"));
  let href = $elem.attr("data-href") || "";
  href = decodeURIComponent(href); // 兼容 V4
  return {
    type: "customimage",
    src: $elem.attr("src") || "",
    alt: $elem.attr("alt") || "",
    altDes: $elem.attr("data-desc") || "",
    href,
    style: {
      width: getStyleValue($elem, "width"),
      height: getStyleValue($elem, "height")
    },
    children: [{ text: "" }] // void node 有一个空白 text
  };
}
export const parseHtmlConf = {
  // selector: "customimage:not([data-w-e-type])", // data-w-e-type 属性，留给自定义元素，保证扩展性
  selector: 'div[data-w-e-type="customimage"]',
  parseElemHtml: parseHtml
};
