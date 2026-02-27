<div align="center">

# SVAR React Editor | Edit Form

[![npm](https://img.shields.io/npm/v/@svar-ui/react-editor.svg)](https://www.npmjs.com/package/@svar-ui/react-editor)
[![License](https://img.shields.io/github/license/svar-widgets/react-editor)](https://github.com/svar-widgets/react-editor/blob/main/license.txt)
[![npm downloads](https://img.shields.io/npm/dm/@svar-ui/react-editor.svg)](https://www.npmjs.com/package/@svar-ui/react-editor)

</div>

<div align="center">

[Documentation](https://docs.svar.dev/react/editor/getting_started/) • [Demos](https://docs.svar.dev/react/editor/samples/)

</div>

[SVAR React Editor](https://svar.dev/react/editor/) is a flexible component for creating custom edit forms for structured data. It helps you compose edit panels using various form controls.

Whether embedded inline, shown as a sidebar, or opened as a modal dialog, the Editor offers an intuitive way to manage data in CMS dashboards, info cards, user profiles, or can be attached to any UI element that needs editing functionality.

<div align="center">
	
<img src="https://svar.dev/images/github/github-editor.png" alt="SVAR React Editor - Custom Edit Form" style="width: 600px;">

</div>

### :sparkles: Key features:

- Can be used as inline form, sidebar panel, or modal dialog;
- Form fields: text input, textarea, checkbox, radio button, date picker, and other [SVAR React Core](https://github.com/svar-widgets/react-core) controls;
- Extendable with custom controls;
- Configurable toolbar (top or bottom);
- Form fields can be displayed in batches (with one visible at a time);
- Tabbed sections;
- Collapsible or accordion-style sections,
- Prefilled values support;
- Editable or read-only modes;
- Handle real-time updates and custom save actions;
- Data validation (required fields, numbers, text);
- Localization support (labels, tooltips, messages);
- Light & dark themes;
- Custom styling via CSS;
- TypeScript support;
- React 18 and 19 compatibility.

### :hammer_and_wrench: How to Use

To start using components from the **Editor** package, simply import the package and include the desired component in your react file:

```jsx
import { Editor } from "@svar-ui/react-editor";
import "@svar-ui/react-editor/all.css";

const items = [
   { comp: 'text', key: 'name', label: 'Name', column: 'left' },
   { comp: 'checkbox', key: 'admin', label: 'Is Admin' },
   { comp: 'text', key: 'email', label: 'Email' },
   {
   comp: 'textarea',
   key: 'descr',
   label: 'Description',
   column: 'left',
   },
];

const myComponent => (<Editor items={items} />);
```

See the [getting started guide](https://docs.svar.dev/react/editor/getting_started/) to quickly set up and begin using SVAR Editor component in your React projects.

### :speech_balloon: Need Help?

[Post an Issue](https://github.com/svar-widgets/react-editor/issues/) or use our [community forum](https://forum.svar.dev).
