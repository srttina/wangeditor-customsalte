/**
 * @description img module
 * @author wangfupeng
 */

import type { IModuleConf } from "@wangeditor/editor-for-vue";
import withImage from "./plugin";
import { renderImageConf } from "./renderelement";
import { imageToHtmlConf } from "./elem-to-html";
import { preParseHtmlConf } from "./pre-parse-html";
import { parseHtmlConf } from "./parse-elem-html";

const customimage: Partial<IModuleConf> = {
  renderElems: [renderImageConf],
  elemsToHtml: [imageToHtmlConf],
  parseElemsHtml: [parseHtmlConf],
  preParseHtml: [preParseHtmlConf],
  editorPlugin: withImage
};

export default customimage;
