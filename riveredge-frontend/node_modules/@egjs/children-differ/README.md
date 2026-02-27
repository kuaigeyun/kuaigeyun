
<p align="middle"><img src="https://raw.githubusercontent.com/naver/egjs-list-differ/master/demo/images/logo.png"/></p>
<h2 align="middle">@egjs/children-differ</h2>
<p align="middle"><a href="https://www.npmjs.com/package/@egjs/children-differ" target="_blank"><img src="https://img.shields.io/npm/v/@egjs/children-differ.svg?style=flat-square&color=007acc&label=version&logo=NPM" alt="version" /></a> <a href="https://travis-ci.org/naver/egjs-children-differ" target="_blank"><img alt="Travis (.org)" src="https://img.shields.io/travis/naver/egjs-children-differ.svg?style=flat-square&label=build&logo=travis%20ci" /></a> <a href="https://coveralls.io/github/naver/egjs-children-differ?branch=master&style=flat-square" target="_blank"><img alt="Coveralls github" src="https://img.shields.io/coveralls/github/naver/egjs-children-differ.svg?style=flat-square&label=%E2%9C%85%20coverage"></a> <a href="https://www.npmjs.com/package/@egjs/children-differ" target="_blank"><img src="https://img.shields.io/npm/dm/@egjs/children-differ.svg?style=flat-square&label=%E2%AC%87%20downloads&color=08CE5D" alt="npm downloads per month"></a>  <a href="https://github.com/naver/egjs-children-differ/blob/master/LICENSE" target="_blank"><img alt="GitHub" src="https://img.shields.io/github/license/naver/egjs-children-differ.svg?style=flat-square&label=%F0%9F%93%9C%20license&color=08CE5D"></a></p>


<p align="middle">➕➖🔄 A module that checks diff when child elements are added, removed, or changed.</p>


## ⚙️ Installation
```sh
$ npm i @egjs/children-differ
```

```html
<script src="//naver.github.io/egjs-children-differ/release/latest/dist/children-differ.pkgd.min.js"></script>
```


## 📖 Documentation
* See [**Documentation**](https://naver.github.io/egjs-children-differ/release/latest/doc/index.html) page.
* [Introducing ListDiffer to track changes in data and track changes](https://medium.com/naver-fe-platform/introducing-listdiffer-to-track-changes-in-data-27793f0c6f4a)([한국어](https://medium.com/naver-fe-platform/%EB%8D%B0%EC%9D%B4%ED%84%B0%EC%9D%98-%EB%B3%80%ED%99%94%EB%A5%BC-%EC%95%8C%EC%95%84%EB%82%B4%EA%B3%A0-%EB%B3%80%ED%99%94-%EA%B3%BC%EC%A0%95%EC%9D%84-%EC%B6%94%EC%A0%81-%ED%95%98%EB%8A%94-listdiffer-9c3f1d770542))
* [How to Make Cross Framework Component](https://medium.com/naver-fe-platform/how-to-make-cross-framework-component-ee76d76708b1)([한국어](https://medium.com/naver-fe-platform/cross-framework-component%EB%A5%BC-%EB%A7%8C%EB%93%9C%EB%8A%94-%EB%B0%A9%EB%B2%95-234b3fece353))


## 📦 Packages
|Package|Version|Description|
|:-----:|:-----:|:-----:|
|[**@egjs/react-children-differ**](https://github.com/naver/egjs-children-differ/blob/master/packages/react-children-differ/README.md)|<a href="https://www.npmjs.com/package/@egjs/react-children-differ" target="_blank"><img src="https://img.shields.io/npm/v/@egjs/react-children-differ.svg?style=flat-square&color=00d8ff&label=%F0%9F%94%96" alt="version" /></a>|<img width="15" src="https://naver.github.io/egjs-flicking/images/react.svg" valign="middle" alt="React" /> [React](https://reactjs.org/) port of @egjs/children-differ|
|[**@egjs/ngx-children-differ**](https://github.com/naver/egjs-children-differ/blob/master/packages/ngx-children-differ/README.md)|<a href="https://www.npmjs.com/package/@egjs/react-children-differ" target="_blank"><img src="https://img.shields.io/npm/v/@egjs/ngx-children-differ.svg?style=flat-square&color=dd0031&label=%F0%9F%94%96" alt="version" /></a>|<img width="15" src="https://naver.github.io/egjs-flicking/images/angular.svg" valign="middle" alt="Angular" /> [Angular](https://angular.io/) port of @egjs/children-differ|
|[**@egjs/vue-children-differ**](https://github.com/naver/egjs-children-differ/blob/master/packages/vue-children-differ/README.md)|<a href="https://www.npmjs.com/package/@egjs/vue-children-differ" target="_blank"><img src="https://img.shields.io/npm/v/@egjs/vue-children-differ.svg?style=flat-square&color=42b883&label=%F0%9F%94%96" alt="version" /></a>|<img width="15" src="https://naver.github.io/egjs-flicking/images/vue.svg" valign="middle" alt="Vue.js" /> [Vue.js](https://vuejs.org/v2/guide/index.html) port of @egjs/children-differ|

## 🏃How to use
Usage is similar to [**@egjs/list-differ**](https://github.com/naver/egjs-list-differ).
### checks diff
```html
<div id="container">
    <div>0</div>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
</div>
<script>

import ChildrenDiffer from "@egjs/children-differ";

// Value is key
const differ = new ChildrenDiffer(conatiner.children);


container.removeChild(container.children[5]);
container.removeChild(container.children[2]);

const result = differ.update(container.children);
// [2, 5]
console.log(result.removed);
</script>
```



## 🙌 Contributing
See [CONTRIBUTING.md](https://github.com/naver/egjs-children-differ/blob/master/CONTRIBUTING.md).

## 📝 Feedback
Please file an [Issue](https://github.com/naver/egjs-children-differ/issues).

## 📜 License
@egjs/list-differ is released under the [MIT license](https://github.com/naver/egjs-children-differ/blob/master/LICENSE).

```
Copyright (c) 2019-present NAVER Corp.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
