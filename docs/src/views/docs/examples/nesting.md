---
title: 'Relapse | Nesting Example'
layout: base
permalink: '/examples/nesting.html'
prev:
  label: 'Siblings Example'
  uri: '/examples/siblings'
next:
  label: 'Menu List'
  uri: '/examples/menu-list'
---


# Nested Example

A collapsible accordion example using A11y flavoured [semantic](https://en.wikipedia.org/wiki/Semantic_HTML) markup elements. The accordion leverages `<details>` and `<summary>` tags. Using semantic elements requires you adhere the markup to expected hierarch and which incur additional nodes in the tree.

:::: grid col-12
::: tabs example

{% render 'examples/nesting' %}

:::
::: tabs html

```html
<section
  class="semantic"
  data-relapse="a11y"
  data-relapse-speed="225"
  data-relapse-persist="false"
  data-relapse-multiple="false">
  <!-- collapse[0] -->
  <details>
    <summary>Collapse 0</summary>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore
      magnaaliqua. Elementum sagittis vitae et leo duis ut.
    </p>
  </details>
  <!-- collapse[1] -->
  <details>
    <summary>Collapse 1</summary>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore
      magnaaliqua.
    </p>
  </details>
  <!-- collapse[2] -->
  <details>
    <summary>Collapse 2</summary>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </p>
  </details>
</section>
```

:::
::: tabs css

```css
.semantic {
  position: relative;
  display: block;
  border: 0.01rem solid gray;
  background-color: #16181c;
}
 .semantic details:first-of-type > summary {
  border-top: none;
}
 .semantic details:last-of-type > summary {
  border-bottom: none;
}
 .semantic details > summary.initial,
 .semantic details > summary.opened,
 .semantic details[open] > summary {
  background-color: #16181c;
}
 .semantic details > summary {
  list-style-type: none;
  width: 100%;
  padding: 10px;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 15px;
  border-top: 0.01rem solid gray;
  border-bottom: 0.01rem solid gray;
  cursor: pointer;
  user-select: none;
}
 .semantic details > summary + * {
  background-color: #0f1215;
  padding: 20px;
  margin: 0 !important;
}
 .semantic details > summary.focused {
  outline: none;
}
 .semantic details > summary:hover {
  background-color: #222c38;
}
 .semantic details > summary::before {
  content: '';
}
.semantic details > summary::-webkit-details-marker {
  display: none;
}
```
:::
::::
