<div align="center">
	
# SVAR React DataGrid | Data Table

[Website](https://svar.dev/react/datagrid/) • [Getting Started](https://docs.svar.dev/react/grid/getting_started/) • [Demos](https://docs.svar.dev/react/grid/samples/)

[![npm](https://img.shields.io/npm/v/@svar-ui/react-grid.svg)](https://www.npmjs.com/package/@svar-ui/react-grid)
[![License](https://img.shields.io/github/license/svar-widgets/react-grid)](https://github.com/svar-widgets/react-grid/blob/main/license.txt)
[![npm downloads](https://img.shields.io/npm/dm/@svar-ui/react-grid.svg)](https://www.npmjs.com/package/@svar-ui/react-grid)

</div>

[SVAR React DataGrid](https://svar.dev/react/datagrid/) is a ready-to-use component that helps you integrate powerful, feature-rich and lightning-fast data tables into React apps. It efficiently handles large datasets and supports virtual scrolling, in-cell editing, sorting, filtering, TypeScript, and full customization to fit complex projects.

<div align="center">
  <img src="https://svar.dev/images/github/github-grid.png" alt="SVAR React DataGrid - Examples" width="700">
</div>

### :sparkles: Key Features

-   High performance (virtual scrolling and dynamic loading)
-   In-cell editing with different cell editors (datepicker, combo, select, rich select, etc.)
-   Custom HTML for cells
-   Sorting by multiple columns
-   Filtering
-   Paging
-   Accessibility: compatibility with [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) standard
-   Frozen columns
-   Expandable/collapsible columns
-   Row reordering with drag-and-drop
-   Customizable tooltips for grid cells
-   Context menu
-   External editor for grid data
-   Tree-like structure
-   Print support
-   Keyboard navigation
-   RestDataProvider for easy backend data binding
-   Dark and light skins
-   Easy customization with CSS
-   TypeScript support
-   React 18 and 19 compatibility

### :hammer_and_wrench: How to Use

To start using **SVAR React DataGrid** component, simply import the package and include the desired component in your React file:

```jsx
import { Grid } from "@svar-ui/react-grid";
import "@svar-ui/react-grid/all.css";

const columns = [
    { id: 'id', width: 50 },
    {
      id: 'city',
      width: 100,
      header: 'City',
      footer: 'City',
    },
    {
      id: 'firstName',
      header: 'First Name',
      footer: 'First Name',
      width: 150,
    },
];

const data = [
    {
        id: 1,
        city: "London",
        firstName: "Alex"
    }
];

const myComponent => (<Grid columns={column} data={data} />);
```

See the [getting started guide](https://docs.svar.dev/react/grid/getting_started/) to quickly set up and begin using SVAR React DataGrid component in your React projects.

### :speech_balloon: Need Help?

[Post an Issue](https://github.com/svar-widgets/react-grid/issues/) or use our [community forum](https://forum.svar.dev).
