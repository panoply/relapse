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

## Intro

An [A11y](https://www.a11yproject.com/) compliant, full-featured lightweight (**3**kb gzip) dependency free toggle utility. Create dynamic collapsible accordions, menu lists, content blocks, and expanded folds with custom styling choices. Relapse supports various markup structures, ensures silky smooth transitions and flaunts an extensive user-friendly API with refined programmatic control.

{% render 'showcase' %}

---

### Markup

Relapse supports **semantic** and **sibling** markup (HTML) structures. The choice between them depends on your preference and the type of collapsible component you are creating.

:::: grid col-12
::: tabs markup

```html
<section id="example">
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
<div id="example">
  <!-- [0] -->
  <button type="button">Opens Fold #1</button>
  <section>
    <div>This is Fold #1 and will be opened by default</div>
  </section>
  <!-- [1] -->
  <button type="button">Opens Fold #2</button>
  <section>
    <div hidden>This is Fold #2</div>
  </section>
  <!-- [2] -->
  <button type="button">Opens Fold #3</button>
  <section>
    <div hidden>This is Fold #3</div>
  </section>
</div>
```

:::
::::

<br>

### Script

Relapse can be initialized in various ways, as detailed in the [instance](/relapse/api/instance) section. It is designed to work seamlessly upon invocation without requiring any options.

```js
import Relapse from 'relapse';

const element = document.querySelector('#example');
const relapse = Relapse(element, {
  persist: false,
  multiple: false
  // etc etc
});
```

<br>

### Style

Relapse manages animations and transitions, this allows you to customize the appearance of your components according to your preferences. The below CSS styles serves as a starting point for tailoring the visual aspects of Relapse components. For a more comprehensive example and detailed guidance on styling, refer to the [styling](/relapse/usage/styling) section.

:::: grid col-12
::: tabs markup

<!--prettier-ignore-->
```css
.relapse {}
.relapse > details[open] > summary {}
.relapse > details > summary {}
.relapse > details > summary:focus {}
.relapse > details > summary:hover {}
.relapse > details > summary + div {}

/* Relapse State Classes */

.relapse > details > summary.opened {}
.relapse > details > summary.disabled {}
.relapse > details > summary + div.expanded {}
```

:::
::: tabs sibling

<!--prettier-ignore-->
```css
.relapse {}
.relapse > button {}
.relapse > button:focus {}
.relapse > button:hover {}
.relapse > button + div {}

/* Relapse State Classes */

.relapse > button.opened {}
.relapse > button.disabled {}
.relapse > button + div.expanded {}
```

:::
::::
