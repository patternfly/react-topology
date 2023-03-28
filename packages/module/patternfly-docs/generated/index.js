module.exports = {
  '/topology/topology-view/extensions': {
    id: "Topology view",
    title: "Topology view",
    toc: [{"text":"Basic Usage"},{"text":"Examples"},[{"text":"Baseline Topology"},{"text":"Custom Nodes"},{"text":"Custom Edges"},{"text":"Pan/Zoom"},{"text":"Selectable Topology"}]],
    examples: ["Baseline Topology","Custom Nodes","Custom Edges","Pan/Zoom","Selectable Topology"],
    section: "topology",
    subsection: "",
    source: "extensions",
    tabName: null,
    Component: () => import(/* webpackChunkName: "topology/topology-view/extensions/index" */ './topology/topology-view/extensions')
  }
};