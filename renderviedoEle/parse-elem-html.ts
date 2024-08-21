// import { Descendant } from 'slate'
// import {SlateDescendant} from "@wangeditor/editor-for-vue";
import type { videomentElement } from "./custom-types";
import type { DOMElement } from "./utils/dom";


function parseHtml(elem: DOMElement): videomentElement {
  let videoElem = elem.querySelector("video");
  let sourceElem = videoElem.querySelector("source");
  let src = "";
  let poster = "";
  let width = "auto";
  let height = "auto";
  let videoId = "";
  let altDes = "";

  // <iframe> 形式
  // const $iframe = elem.querySelector('iframe')
  // if ($iframe.length > 0) {
  //   width = $iframe.attr('width') || 'auto'
  //   height = $iframe.attr('height') || 'auto'
  //   src = $iframe[0].outerHTML
  //   return genVideoElem(src, poster, width, height)
  // }

  width = videoElem.getAttribute("width") || "auto";
  height = videoElem.getAttribute("height") || "auto";
  poster = videoElem.getAttribute("poster") || "";
  videoId = videoElem.getAttribute("data-id") || "";
  altDes = videoElem.getAttribute("data-alt") || "";
  src = sourceElem.getAttribute("src") || "";

  const myResume: videomentElement = {
    type: "customvideo",
    src,
    poster,
    width,
    height,
    videoId,
    altDes,
    children: [{ text: "" }] // void 元素有一个空 text
  };
  return myResume;
}
export const parseHtmlConf = {
  selector: 'div[data-w-e-type="customvideo"]',
  parseElemHtml: parseHtml
};
