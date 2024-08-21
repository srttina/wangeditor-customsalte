/**
 * @description pre parse html
 * @author wangfupeng
 */

import $, { type DOMElement } from "./utils/dom";

/**
 * pre-prase video ，兼容 V4
 * @param elem elem
 */
function preParse(elem: DOMElement): DOMElement {
  const $elem = $(elem);
  let $image = $elem;
  console.log(3445, $image);
  // 已经符合 V5 格式
  const $parent = $image.parent();
  if ($parent.attr("data-w-e-type") === "customimage") return $image[0];

  const $container = $(
    `<div data-w-e-type="customimage" data-w-e-is-void></div>`
  );
  $container.append($image);

  return $container[0];
}

export const preParseHtmlConf = {
  selector: "customimage",
  preParseHtml: preParse
};
