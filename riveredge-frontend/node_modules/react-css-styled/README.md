# react-css-styled 👋 [![npm version](https://badge.fury.io/js/react-css-styled.svg)](https://badge.fury.io/js/react-css-styled)

This component is a lightweight, simple line style component.

## Installation

```sh
npm install react-css-styled
```
## How to use

```jsx
import styled from "react-css-styled";

const Styler = styled("div", `
{
  border-radius: 50%;
}
* {
  width: 100%;
  height: 100%;
}
:host div {
  position: relative;
}
`);

render() {
  return (<Styler className="">
    <div></div>
  </Styler>);
}
```
## Development

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## License

```
MIT License

Copyright (c) 2019 Daybrush
```