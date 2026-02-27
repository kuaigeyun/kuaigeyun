/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * Copyright (c) 2015 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import Component, * as modules from "./index";

for (const name in modules) {
  (Component as any)[name] = (modules as any)[name];
}

declare const module: any;
module.exports = Component;
export default Component;
export * from "./index";
