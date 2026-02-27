<div align="center">

# SVAR React Toolbar

[![npm](https://img.shields.io/npm/v/@svar-ui/react-toolbar.svg)](https://www.npmjs.com/package/@svar-ui/react-toolbar)
[![License](https://img.shields.io/github/license/svar-widgets/react-toolbar)](https://github.com/svar-widgets/react-toolbar/blob/main/license.txt)
[![npm downloads](https://img.shields.io/npm/dm/@svar-ui/react-toolbar.svg)](https://www.npmjs.com/package/@svar-ui/react-toolbar)

</div>

<div align="center">

[Documentation](https://docs.svar.dev/react/core/toolbar/) • [Demos](https://docs.svar.dev/react/core/samples-toolbar/#/base/willow)

</div>

**SVAR React Toolbar** is a customizable React UI component that helps you build panels of buttons and icons, giving users quick access to key actions and tools in your app. It supports different button types, multi-line toolbars, collapsible button groups, and responsive layouts that adapt to different screen sizes. Compatible with React 18 and 19.

<div align="center">

<img src="https://svar.dev/images/github/github-toolbar.png" alt="Svelte Toolbar Component" style="width: 800px;">

</div>

### :hammer_and_wrench: How to Use

To use SVAR React Toolbar, simply import the package and include the component in to .jsx file:

```jsx
    import { Toolbar } from "@svar-ui/react-toolbar";
    import "@svar-ui/react-toolbar/all.css";

    function MyComponent(){
        const items = [
            { id: 'label', text: 'Toolbar with icon buttons' },
            { id: 'search', comp: 'button', icon: 'wxi-search' },
            { comp: 'spacer' },
            { id: 'edit', comp: 'button', icon: 'wxi-edit-outline'}
        ];

        return (<Toolbar items={items} />);
    }
```
