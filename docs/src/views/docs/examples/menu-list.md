---
title: 'Relapse | Menu List'
layout: base
permalink: '/examples/menu-list.html'
prev:
  label: 'Nesting Example'
  uri: '/examples/nesting'
next:
  label: 'Introduction'
  uri: '/'
---


# Menu List Example

A collapsible accordion example using A11y flavoured [semantic](https://en.wikipedia.org/wiki/Semantic_HTML) markup elements. The accordion leverages `<details>` and `<summary>` tags. Using semantic elements requires you adhere the markup to expected hierarch and which incur additional nodes in the tree.

:::: grid col-12
::: tabs example

{% render 'examples/menu-list' %}

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
