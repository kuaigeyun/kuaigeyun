/*
egjs-children-differ
Copyright (c) 2019-present NAVER Corp.
MIT license
*/
export const findKeyCallback = typeof Map === "function"
  ? undefined
  : (() => {
    let childrenCount = 0;

    return (el: Element) => (el as any).__DIFF_KEY__ || ((el as any).__DIFF_KEY__ = ++childrenCount);
  })();
