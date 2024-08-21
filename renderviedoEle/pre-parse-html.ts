/**
 * @description pre parse html
 * @author wangfupeng
 */

import $, { getTagName, type DOMElement } from "./utils/dom";

/**
 * pre-prase video ，兼容 V4
 * @param elem elem
 */
function preParse(elem: DOMElement): DOMElement {
  const $elem = $(elem);
  let $video = $elem;

  // const elemTagName = getTagName($elem)
  // if (elemTagName === 'p') {
  //   // v4 的 video 或 iframe 是被 p 包裹的
  //   const children = $elem.children()
  //   if (children.length === 1) {
  //     const firstChild = children[0]
  //     const firstChildTagName = firstChild.tagName.toLowerCase()
  //     if (['iframe', 'customvideo'].includes(firstChildTagName)) {
  //       // p 下面包含 iframe 或 video
  //       $video = $(firstChild)
  //     }
  //   }
  // }

  const videoTagName = getTagName($video);
  if (videoTagName !== "iframe" && videoTagName !== "customvideo")
    return $video[0];

  // 已经符合 V5 格式
  const $parent = $video.parent();
  if ($parent.attr("data-w-e-type") === "customvideo") return $video[0];

  const $container = $(
    `<div data-w-e-type="customvideo" data-w-e-is-void data-w-e-is-inline></div>`
  );
  $container.append($video);

  return $container[0];
}

export const preParseHtmlConf = {
  selector: "iframe,customvideo",
  preParseHtml: preParse
};
