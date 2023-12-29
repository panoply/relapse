---
title: 'Relapse | Introduction'
layout: base
permalink: '/'
prev:
  label: 'Introduction'
  uri: '/'
next:
  label: 'Install'
  uri: '/usage/install'
---

# 🪗 Relapse

An [A11y](https://www.a11yproject.com/) compliant, lightweight (**2.7**kb gzip) and dependency free toggle. Create dynamic collapsible accordions, menu lists, content blocks, and expanded folds with custom styling choices. Relapse seamlessly integrates with both semantic and sibling markup structures, ensures silky smooth transitions and flaunts an extensive user-friendly API, providing refined programmatic control.

{% render 'showcase' %}

---

### JS

Relapse can be initialized in various ways, as detailed in the [initialize](/usage/initialize) section. It is designed to work seamlessly upon invocation without requiring any options. The resulting instance will be either an array of `Relapse[]` or a singular `Relapse` scope, depending on the parameters provided.

```ts
import relapse from 'relapse';

relapse(); // Initialize on all elements with a data-relapse attribute
```

<br>

### HTML

Relapse supports **semantic** and **sibling** markup (html) structures. The choice between them depends on your preference and the type of collapsible component you are creating. The **sibling** structure is ideal for a minimal node-tree depth, while developers who prefer **semantic** ordering can leverage `<details>` and `<summary>` tags to take advantage of the browser's default behavior.

:::: grid col-12
::: tabs markup

```html
<section data-relapse="example">
  <!-- [0] -->
  <details open>
    <summary>Opens Fold #1</summary>
    <p>This is Fold #1 and will be opened by default</p>
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

:::
::: tabs sibling

```html
<div data-relapse="example">
  <!-- [0] -->
  <button type="button initialize">Opens Fold #1</button>
  <div>This is Fold #1 and will be opened by default</div>
  <!-- [1] -->
  <button type="button">Opens Fold #2</button>
  <div>This is Fold #2</div>
  <!-- [2] -->
  <button type="button">Opens Fold #3</button>
  <div>This is Fold #3</div>
</div>
```

:::
::::

<br>

### CSS

:::: grid col-12
::: tabs markup

<!--prettier-ignore-->
```css
.relapse {}
.relapse > details[open] > summary {}
.relapse > details > summary {}
.relapse > details > summary:focus {}
.relapse > details > summary:hover {}
.relapse > details > summary.opened {}
.relapse > details > summary.focused {}
.relapse > details > summary.disabled {}
.relapse > details > summary + p {}
.relapse > details > summary + p.expanded {}
```

:::
::: tabs sibling

<!--prettier-ignore-->
```css
.relapse {}
.relapse > button {}
.relapse > button:focus {}
.relapse > button:hover {}
.relapse > button.opened {}
.relapse > button.focused {}
.relapse > button.disabled {}
.relapse > button + div {}
.relapse > button + div.expanded {}
```

:::
::::
