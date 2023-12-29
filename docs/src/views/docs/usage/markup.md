---
title: 'Relapse | Markup'
layout: base
permalink: '/usage/markup.html'
prev:
  label: 'Introduction'
  uri: '/'
next:
  label: 'Styling / CSS'
  uri: '/usage/styling'
---

## Markup / HTML

Relapse provides support for two distinct markup structures, **Sibling** (or basic) and **Semantic**. Your choice of structure depends on your preferences and the specific requirements of your project. The **Sibling** structure is ideal for those aiming for a minimal node-tree depth, whereas the **Semantic** is the preferred and be suited for developers who prioritize semantic ordering and wish to take advantage of the browser's default behavior. The **Semantic** structure incorporates the use of `<details>` and `<summary>` tags. This allows for a more structured and meaningful representation of collapsible elements.

---

## Semantic Structure

When utilizing Relapse with semantic markup, you'll be adopting a `<details>` and `<summary>` structure. Unlike the sibling structure, this approach mandates a nested organization, where each collapsible element follows the ordering of **details** → **summary** → **fold**.

In this structure, each `<details>` node becomes a sibling, forming a coherent and hierarchical representation of the collapsible content. This nesting ensures adherence to semantic ordering, enabling a more structured and meaningful arrangement of elements in your document.

```html
<section data-relapse="a11y">
  <!-- [0] -->
  <details>
    <summary>Opens Fold #1</summary>
    <p>This is Fold #1</p>
  </details>
  <!-- [1] -->
  <details>
    <summary>Opens Fold #2</summary>
    <p>This is Fold #2</p>
  </details>
  <!-- [2] -->
  <details>
    <summary>Opens Fold #3</summary>
    <p>This is Fold #3</p>
  </details>
</section>
```

---

## Sibling Structure

When employing Relapse within a minimal node tree, it necessitates a specific markup structure. This structure comprises an outer (wrapper) element alongside button element(s) and fold element(s). The key requirement is that the **button** and **fold** elements must be meticulously arranged as siblings.

By adhering to this arrangement, you ensure a streamlined and concise representation of your collapsible components within a minimal node tree, but it comes at the cost of additional depths. Sibling structures will almost always require a child node within folds, this is due to the way the browser calculates `offsetHeight` so when possible, it is best to leverage the Semantic structure.

```html
<div data-relapse="example">
  <!-- [0] -->
  <button type="button">Opens Fold #1</button>
  <div>This is Fold #1</div>
  <!-- [1] -->
  <button type="button">Opens Fold #2</button>
  <div>This is Fold #2</div>
  <!-- [2] -->
  <button type="button">Opens Fold #3</button>
  <div>This is Fold #3</div>
</div>
```
