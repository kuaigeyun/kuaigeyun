<div align="center">

# SVAR React Filter | Query Builder

</div>

<div align="center">

[Website](https://svar.dev/react/filter/) • [Getting Started](https://docs.svar.dev/react/filter/getting_started/) • [Demos](https://docs.svar.dev/react/filter/samples/)

</div>

<div align="center">

[![npm](https://img.shields.io/npm/v/@svar-ui/react-filter.svg)](https://www.npmjs.com/package/@svar-ui/react-filter)
[![License](https://img.shields.io/github/license/svar-widgets/react-filter)](https://github.com/svar-widgets/react-filter/blob/main/license.txt)
[![npm downloads](https://img.shields.io/npm/dm/@svar-ui/react-filter.svg)](https://www.npmjs.com/package/@svar-ui/react-filter)

</div>

[SVAR React Filter](https://svar.dev/react/filter/) is a library of three React components that help you add flexible filtering features to your apps: from simple filter bars to advanced query builders. It provides an intuitive UI for creating and editing filtering rules, grouping filters, defining conditions, and choosing the logic (AND/OR).

<div align="center">
	
<img src="https://svar.dev/images/github/github_filter.png" alt="SVAR Filter - React Query Builder Component" style="width: 700px;">

</div>

### :jigsaw: Included Components

SVAR React Filter library includes the following components:

**FilterBuilder** is the main component that provides an interactive interface for building complex queries and filtering large datasets.

**FilterEditor** allows you to create a filtering rule for a single field, and can be used as a standalone component.

**FilterBar** is a simplified filter bar UI with inputs and select controls. It allows building filtering rules for several fields and combining them with logical operators. Can be used above data tables or dashboards.

### :sparkles: Key features:

- Complex filter queries: multi-field rules, groups of filters, nested filters, AND/OR logic.
- Multiple data types: text, number, and date filtering with type-specific operators.
- Configurable layouts: vertical, horizontal, or minimal filter bar layouts.
- Localization: labels and date formats can be customized to match users' locale.
- Dynamic loading: filter options can be loaded on demand when a new filter is added.
- JSON output: the component outputs structured JSON that can be transformed into SQL or other query formats.
- Intuitive, straightforward API: easily set and retrieve values, customize filters, and track changes.
- Full TypeScript support and compatibility with React 18 and 19.

[Check out the demos](https://docs.svar.dev/react/filter/samples/) to see all SVAR React Filter features in action.

### :hammer_and_wrench: How to Use

To start using the components from the **Filter** package, simply import the package and include the desired component in your React file:

```jsx
import { FilterBuilder } from "@svar-ui/react-filter";
import "@svar-ui/react-filter/all.css";

const fields = [
    {
        id: "first_name",
        label: "First Name",
        type: "text",
    },
    {
        id: "last_name",
        label: "Last Name",
        type: "text",
    },
];
const myComponent => (<FilterBuilder fields={fields} />);
```

See the [getting started guide](https://docs.svar.dev/react/filter/getting_started/) to quickly set up and begin using SVAR Filter components in your React projects.

### :speech_balloon: Need Help?

[Post an Issue](https://github.com/svar-widgets/react-filter/issues/) or use our [community forum](https://forum.svar.dev).
