<div align="center">
	
# SVAR React Gantt Chart

:globe_with_meridians: [Website](https://svar.dev/react/gantt/) • :bulb: [Getting Started](https://docs.svar.dev/react/gantt/getting_started/) • :eyes: [Demos](https://docs.svar.dev/react/gantt/samples/)

[![npm](https://img.shields.io/npm/v/@svar-ui/react-gantt.svg)](https://www.npmjs.com/package/@svar-ui/react-gantt)
[![License](https://img.shields.io/github/license/svar-widgets/react-gantt)](https://github.com/svar-widgets/react-gantt/blob/main/license.txt)
[![npm downloads](https://img.shields.io/npm/dm/@svar-ui/react-gantt.svg)](https://www.npmjs.com/package/@svar-ui/react-gantt)

</div>

[SVAR React Gantt](https://svar.dev/react/gantt/) is a customizable, high-performance React Gantt chart component that helps you visualize and manage project timelines. Its intuitive interface allows users to add, edit, and organize tasks and dependencies directly on the timeline via drag-and-drop or through a simple task edit form.

TypeScript support, React 19 compatibility, and clean UI make it a modern and reliable choice for building interactive Gantt charts.

<div align="center">
  <img src="https://cdn.svar.dev/public/gantt-chart-ui.png" alt="SVAR React Gantt Chart - Screenshot">
</div>

### ✨ Key Features

- Interactive drag-and-drop interface
- Intuitive and customizable task edit form
- Set task dependencies on the timeline or in a popup form
- Showing task progress on the taskbar
- Hierarchical view of sub tasks
- Configurable timeline (hours, days, weeks)
- Flexible time units: support for hours and minutes
- Custom time scales: define custom periods like sprints or stages
- Ability to use custom HTML in grid cells
- Sorting tasks in grid
- Toolbar and context menu
- Tooltips for taskbars
- Weekends/holidays highlights
- Zooming with scroll
- Hotkey support for common actions
- Fast performance with large data sets
- Localization
- Light and dark skins
- Full TypeScript support
- React 18 & 19 compatible

### 🚀 PRO Edition

SVAR React Gantt is available in open-source and PRO Editions. The PRO Edition offers additional features and automation logic:

- Work days calendar
- Auto-scheduling (forward mode and Finish-to-Start dependencies)
- Critical path
- Baselines
- Split tasks
- Vertical markers
- Unscheduled tasks
- Undo/redo

Visit the [pricing page](https://svar.dev/react/gantt/pricing/) for full feature comparison and licensing details.

[Check out the demos](https://docs.svar.dev/react/gantt/samples/) to see all SVAR React Gantt features in action.

### :hammer_and_wrench: How to Use

To start using **SVAR React Gantt**, simply import the package and include the desired component in your React file:

```jsx
import { Gantt } from "@svar-ui/react-gantt";
import "@svar-ui/react-gantt/all.css";

const tasks = [
  {
    id: 20,
    text: "New Task",
    start: new Date(2024, 5, 11),
    end: new Date(2024, 6, 12),
    duration: 1,
    progress: 2,
    type: "task",
    lazy: false,
  },
  {
    id: 47,
    text: "[1] Master project",
    start: new Date(2024, 5, 12),
    end: new Date(2024, 7, 12),
    duration: 8,
    progress: 0,
    parent: 0,
    type: "summary",
  },
];
const myComponent => (<Gantt tasks={tasks} />);
```

See the [getting started guide](https://docs.svar.dev/react/gantt/getting_started/) to learn how to configure data sources, customize columns, and enable editing.

### :speech_balloon: Need Help?

[Post an Issue](https://github.com/svar-widgets/react-gantt/issues/) or use our [community forum](https://forum.svar.dev).
