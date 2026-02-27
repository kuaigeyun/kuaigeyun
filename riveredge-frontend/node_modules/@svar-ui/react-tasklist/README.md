<div align="center">

# SVAR React Tasklist

[![npm](https://img.shields.io/npm/v/@svar-ui/react-tasklist.svg)](https://www.npmjs.com/package/@svar-ui/react-tasklist)
[![License](https://img.shields.io/github/license/svar-widgets/react-tasklist)](https://github.com/svar-widgets/react-tasklist/blob/main/license.txt)
[![npm downloads](https://img.shields.io/npm/dm/@svar-ui/react-tasklist.svg)](https://www.npmjs.com/package/@svar-ui/react-tasklist)

</div>

<div align="center">

[Documentation](https://docs.svar.dev/react/core/tasklist/) • [Demos](https://docs.svar.dev/react/core/samples-tasklist/#/base/willow)

</div>

**SVAR React Tasklist** is a lightweight React component that helps you add simple, interactive to-do lists to your applications. It's compatible with React 18 and 19, and is a part of the [SVAR React Core](https://github.com/svar-widgets/react-core) widgets family.

With Tasklist, users can easily add, edit, delete, and mark tasks as completed. The component works fully on the client side and integrates smoothly with any backend or external data source (like REST APIs) to load and save tasks. It also provides flexible event handling, letting you track and respond to task additions, updates, or deletions.

<div align="center">

<img src="https://svar.dev/images/github/github-tasklist.png" alt="SVAR React TaskList" style="width: 700px;">

</div>

### :hammer_and_wrench: How to Use

To use the task list, simply import the package and include the component in to .jsx file:

```jsx
    import { Tasklist } from "@svar-ui/react-tasklist";
    import "@svar-ui/react-tasklist/all.css";

    function MyComponent(){
        const data =  [
            { id: 7, content: 'Optimize performance', status: 1 },
            { id: 8, content: 'Work with API requests', status: 0}
        ];

        return (<Tasklist value={data} />);
    }
```
