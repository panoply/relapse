---
title: 'Relapse | Semantic Example'
layout: base
permalink: '/examples/semantic.html'
prev:
  label: 'Events'
  uri: '/api/events'
next:
  label: 'Siblings Example'
  uri: '/examples/siblings'
---

# Semantic Example

A collapsible accordion example using the [semantic](https://en.wikipedia.org/wiki/Semantic_HTML) markup structure. The accordion leverages `<details>` and `<summary>` tags. Using semantic elements requires you adhere the markup to expected hierarch and which incur additional nodes in the tree.

:::: grid col-12
::: tabs example

{% render 'examples/semantic' %}

:::
::: tabs html

<!-- prettier-ignore-->
```html
<section
  class="semantic-relapse w-100"
  data-relapse="semantic-example"
  data-relapse-duration="220"
  data-relapse-persist="false"
  data-relapse-multiple="false">
  <details open>
    <summary>Collapse 0</summary>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Elementum sagittis vitae et leo duis ut.
    </p>
  </details>
  <details>
    <summary>Collapse 1</summary>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Elementum sagittis vitae et leo duis ut.
    </p>
  </details>
  <details>
    <summary>Collapse 2</summary>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Elementum sagittis vitae et leo duis ut.
    </p>
  </details>
</section>
```

:::
::: tabs css

<!-- ```css
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
``` -->

:::
::::
