<div align="center">

# SVAR React Menu

[![npm](https://img.shields.io/npm/v/@svar-ui/react-menu.svg)](https://www.npmjs.com/package/@svar-ui/react-menu)
[![License](https://img.shields.io/github/license/svar-widgets/react-menu)](https://github.com/svar-widgets/react-menu/blob/main/license.txt)
[![npm downloads](https://img.shields.io/npm/dm/@svar-ui/react-menu.svg)](https://www.npmjs.com/package/@svar-ui/react-menu)

</div>

<div align="center">

[Documentation](https://docs.svar.dev/react/core/category/menu/) • [Demos](https://docs.svar.dev/react/core/samples-menu/#/action/willow)

</div>

**SVAR React Menu** is a flexible menu component for adding navigation and interaction menus to your React applications. The component is easy-to-customize, compatible with React 18 and 19, and complements [SVAR React Core](https://github.com/svar-widgets/react-core/) library.

<div align="center">

<img src="https://svar.dev/images/github/github-menu.png" alt="React Menu Component" style="width: 600px;">

</div>

SVAR React Menu can be used as:

- Action Menu: Provides a compact list of actions (e.g. edit, delete, share.) that appears when a user clicks on a UI element.
- Basic Menu: A simple, hierarchical menu that displays options for navigation or actions.
- Context Menu: A right-click (or long-press) menu offering context-specific options for a selected element.
- DropDown Menu: A dropdown attached to buttons or other clickable elements, expanding on click.
- Menu Bar: A horizontal top-level menu providing access to grouped commands, with support for dropdowns and sub-menus.

### :hammer_and_wrench: How to Use

To use the widget, simply import the package and include the component in to .jsx file:

```jsx
    import { Menu } from "@svar-ui/react-menu";
    import "@svar-ui/react-menu/all.css";

    function MyComponent(){
        const options = [
            { id: 'add-task', text: 'Add', icon: 'wxi wxi-plus', data: [
                { id: 'add-task:child', text: 'Child task' },
                { id: 'add-task:above', text: 'Task above' },
                { id: 'add-task:below', text: 'Task below' },
            ] },
            { type: 'separator' },
            { id: 'edit-task', text: 'Edit', icon: 'wxi wxi-edit' },
        ];

        return (<Menu options={options} />);
    }
```
