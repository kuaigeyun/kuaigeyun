

Implement EventEmitter on object or component.

* [API Documentation](https://daybrush.com/event-emitter/release/latest/doc/)

## ⚙️ Installation
```sh
$ npm i @scena/event-emitter
```

```html
<script src="https://daybrush.com/event-emitter/release/latest/dist/event-emitter.min.js"></script>
```


## 🚀 How to use
```ts
import EventEmitter from "@scena/event-emitter";

const emitter = new EventEmitter();

// add listener
emitter.on("a", e => {

});

// trigger event
emitter.emit("a", {
    a: 1,
    b: 2,
});

// remove events
emitter.off("a", callback);

emitter.off("a");

emitter.off();
```

## 👏 Contributing

If you have any questions or requests or want to contribute to `event-emitter`, please write the [issue](https://github.com/daybrush/event-emitter/issues) or give me a Pull Request freely.

## 🐞 Bug Report

If you find a bug, please report to us opening a new [Issue](https://github.com/daybrush/event-emitter/issues) on GitHub.


## 📝 License

This project is [MIT](https://github.com/daybrush/event-emitter/blob/master/LICENSE) licensed.

```
MIT License

Copyright (c) 2020 Daybrush

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
``
