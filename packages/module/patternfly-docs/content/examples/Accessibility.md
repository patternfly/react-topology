---
id: Accessibility
section: extensions
subsection: topology
sortValue: 999
---

## Pipelines layout

By default, `<TaskNode>` and `<DefaultTaskGroup>` are included in the keyboard tab order (`tabIndex` is `0`). Tab order follows the order of items in the `model`. An expanded group receives focus before the nodes inside it. To set a custom tab order, pass `tabIndex` on `<TaskNode>` or `<DefaultTaskGroup>`.

When you select nodes and groups with `withSelection` or `useSelection`, `raiseOnSelect` defaults to `true`. That option moves the selected item to the end of its siblings, which also moves it in the tab order. Each later selection places that item after the one you selected before it. To keep tab order stable, pass `{ raiseOnSelect: false }` to `withSelection` or `useSelection`.

To stop screen readers from announcing truncated labels twice, set `labelTooltipTrigger` to `mouseenter` on `<TaskNode>`. The tooltip then opens on hover only, so the truncated label is not added to the keyboard tab order.

