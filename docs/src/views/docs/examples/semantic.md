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
::: tabs example:semantic

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
::::
