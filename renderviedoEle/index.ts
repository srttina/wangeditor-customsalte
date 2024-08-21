/**
 * @description video module
 * @author wangfupeng
 */

import type { IModuleConf } from "@wangeditor/editor-for-vue";
import withVideo from "./plugin";
import { renderVideoConf } from "./renderelement";
import { videoToHtmlConf } from "./elem-to-html";
import { preParseHtmlConf } from "./pre-parse-html";
import { parseHtmlConf } from "./parse-elem-html";
// import { insertVideoMenuConf, uploadVideoMenuConf, editorVideSizeMenuConf } from './menu/index'

const customvideo: Partial<IModuleConf> = {
  renderElems: [renderVideoConf],
  elemsToHtml: [videoToHtmlConf],
  preParseHtml: [preParseHtmlConf],
  parseElemsHtml: [parseHtmlConf],
  editorPlugin: withVideo
};

export default customvideo;
