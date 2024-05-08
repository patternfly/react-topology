module.exports = {
  '/topology/toolbar/extensions': {
    id: "Toolbar",
    title: "Toolbar",
    toc: [[{"text":"Topology with a toolbar"}]],
    section: "topology",
    subsection: "",
    source: "extensions",
    tabName: null,
    sortValue: 32,
    Component: () => import(/* webpackChunkName: "topology/toolbar/extensions/index" */ './topology/toolbar/extensions')
  },
  '/topology/sidebar/extensions': {
    id: "Sidebar",
    title: "Sidebar",
    toc: [[{"text":"Topology with a side bar"}]],
    section: "topology",
    subsection: "",
    source: "extensions",
    tabName: null,
    sortValue: 33,
    Component: () => import(/* webpackChunkName: "topology/sidebar/extensions/index" */ './topology/sidebar/extensions')
  },
  '/topology/selection/extensions': {
    id: "Selection",
    title: "Selection",
    toc: [[{"text":"Using selection"}]],
    section: "topology",
    subsection: "",
    source: "extensions",
    tabName: null,
    sortValue: 21,
    Component: () => import(/* webpackChunkName: "topology/selection/extensions/index" */ './topology/selection/extensions')
  },
  '/topology/pipelines/extensions': {
    id: "Pipelines",
    title: "Pipelines",
    toc: [[{"text":"Getting Started with Topology Pipelines"}],{"text":"Functions"},[{"text":"getSpacerNodes"},{"text":"getEdgesFromNodes"}]],
    section: "topology",
    subsection: "",
    source: "extensions",
    tabName: null,
    sortValue: 71,
    Component: () => import(/* webpackChunkName: "topology/pipelines/extensions/index" */ './topology/pipelines/extensions')
  },
  '/topology/panzoom/extensions': {
    id: "Pan/Zoom",
    title: "Pan/Zoom",
    toc: [[{"text":"Providing pan and zoom on the graph"}]],
    section: "topology",
    subsection: "",
    source: "extensions",
    tabName: null,
    sortValue: 22,
    Component: () => import(/* webpackChunkName: "topology/panzoom/extensions/index" */ './topology/panzoom/extensions')
  },
  '/topology/layouts/extensions': {
    id: "Layouts",
    title: "Layouts",
    toc: [[{"text":"Layouts"},{"text":"Examples"}]],
    section: "topology",
    subsection: "",
    source: "extensions",
    tabName: null,
    Component: () => import(/* webpackChunkName: "topology/layouts/extensions/index" */ './topology/layouts/extensions')
  },
  '/topology/getting-started/extensions': {
    id: "Getting started",
    title: "Getting started",
    toc: [[{"text":"Getting started with react-topology"}]],
    section: "topology",
    subsection: "",
    source: "extensions",
    tabName: null,
    sortValue: 1,
    Component: () => import(/* webpackChunkName: "topology/getting-started/extensions/index" */ './topology/getting-started/extensions')
  },
  '/topology/drag-and-drop/extensions': {
    id: "Drag and Drop",
    title: "Drag and Drop",
    toc: [[{"text":"Drag and Drop"}],{"text":"Functions"},[{"text":"withDragNode"},{"text":"withSourceDrag"},{"text":"withTargetDrag"},{"text":"withDndDrop"}]],
    section: "topology",
    subsection: "",
    source: "extensions",
    tabName: null,
    sortValue: 24,
    Component: () => import(/* webpackChunkName: "topology/drag-and-drop/extensions/index" */ './topology/drag-and-drop/extensions')
  },
  '/topology/custom-nodes/extensions': {
    id: "Custom Nodes",
    title: "Custom Nodes",
    toc: [[{"text":"Using custom nodes"}]],
    section: "topology",
    subsection: "",
    source: "extensions",
    tabName: null,
    sortValue: 11,
    Component: () => import(/* webpackChunkName: "topology/custom-nodes/extensions/index" */ './topology/custom-nodes/extensions')
  },
  '/topology/custom-edges/extensions': {
    id: "Custom Edges",
    title: "Custom Edges",
    toc: [[{"text":"Using custom edges"}]],
    section: "topology",
    subsection: "",
    source: "extensions",
    tabName: null,
    sortValue: 12,
    Component: () => import(/* webpackChunkName: "topology/custom-edges/extensions/index" */ './topology/custom-edges/extensions')
  },
  '/topology/control-bar/extensions': {
    id: "Control Bar",
    title: "Control Bar",
    toc: [[{"text":"Topology with a control bar"}]],
    section: "topology",
    subsection: "",
    source: "extensions",
    tabName: null,
    sortValue: 31,
    Component: () => import(/* webpackChunkName: "topology/control-bar/extensions/index" */ './topology/control-bar/extensions')
  },
  '/topology/context-menu/extensions': {
    id: "Context Menu",
    title: "Context Menu",
    toc: [[{"text":"Topology with context menus"}]],
    section: "topology",
    subsection: "",
    source: "extensions",
    tabName: null,
    sortValue: 23,
    Component: () => import(/* webpackChunkName: "topology/context-menu/extensions/index" */ './topology/context-menu/extensions')
  },
  '/topology/anchors/extensions': {
    id: "Anchors",
    title: "Anchors",
    toc: [[{"text":"Using custom anchors"}]],
    section: "topology",
    subsection: "",
    source: "extensions",
    tabName: null,
    sortValue: 13,
    Component: () => import(/* webpackChunkName: "topology/anchors/extensions/index" */ './topology/anchors/extensions')
  }
};