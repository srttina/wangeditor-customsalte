import type { Element } from "slate";
import type { videomentElement } from "./custom-types";

function videoToHtml(elemNode: Element): string {
  try {
    const {
      src = "",
      poster = "",
      width = "auto",
      height = "auto",
      videoId = "",
      altDes = ""
    } = elemNode as videomentElement;
    let res =
      '<div data-w-e-type="customvideo" data-w-e-is-void data-w-e-is-inline >\n';
    res += `<video poster="${poster}" controls="true" width="${width}" height="${height}" data-id="${videoId}" data-alt="${altDes}"><source src="${src}" type="video/mp4"/></video>`;
    res += `<div class="desc" style="text-align: center;" >${altDes}</div>`;
    res += "\n</div>";
    return res;
  } catch (error) {
    console.error("An error occurred:", error);
    // 在这里处理错误，例如返回一个默认的 HTML 字符串
    return "<div>An error occurred while converting the video to HTML.</div>";
  }
}

export const videoToHtmlConf = {
  type: "customvideo",
  elemToHtml: videoToHtml
};
