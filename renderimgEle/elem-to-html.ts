import type { Element } from "slate";
import type { ImageElement } from "./custom-types";

function imageToHtml(elemNode: Element): string {
  const {
    src,
    alt = "",
    href = "",
    style = {},
    altDes = ""
  } = elemNode as ImageElement;
  const { width = "", height = "" } = style;

  let styleStr = "";
  if (width) styleStr += `width: ${width};`;
  if (height) styleStr += `height: ${height};`;
  return `<div data-w-e-type="customimage" data-w-e-is-void data-w-e-is-inline ><img src="${src}" alt="${alt}" data-href="${href}" data-desc="${altDes}"  style="${styleStr}"/><div class="desc" style="text-align: center;" >${altDes}</div></div>`;
}
export const imageToHtmlConf = {
  type: "customimage",
  elemToHtml: imageToHtml
};
