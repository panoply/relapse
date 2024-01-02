---
title: 'Relapse | Siblings Example'
layout: base
permalink: '/examples/siblings.html'
prev:
  label: 'Semantic Example'
  uri: '/examples/semantic'
next:
  label: 'Nesting Example'
  uri: '/examples/nesting'
---

# Siblings Example

A collapsible accordion example using the [sibling](/relapse/usage/markup) markup structure. The accordion leverages `<button>` and `<section>` tags.

:::: grid col-12
::: tabs example

{% render 'examples/siblings' %}

:::
::: tabs html

```html
<section
  class="sibling-relapse w-100"
  data-relapse="sibling-relapse"
  data-relapse-speed="220"
  data-relapse-persist="false"
  data-relapse-multiple="false"
>
  <button type="button" class="sibling-button opened" aria-expanded="true">Collapse 0</button>
  <section class="sibling-fold">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Elementum sagittis vitae et leo duis ut. Ut tortor pretium
      viverra suspendisse potenti.
    </p>
  </section>
  <button type="button" class="sibling-button">Collapse 1</button>
  <section class="sibling-fold" aria-hidden="true">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada
      proin. Ac tortor dignissim convallis aenean et tortor at risus. Nec feugiat nisl pretium fusce
      id velit ut.
    </p>
  </section>
  <button type="button" class="sibling-button">Collapse 2</button>
  <section class="sibling-fold" aria-hidden="true">
    <p>
      Commodo sed egestas egestas fringilla phasellus faucibus. Eu tincidunt tortor aliquam nulla
      facilisi cras fermentum. Nullam eget felis eget nunc lobortis mattis.
    </p>
  </section>
</section>
```

:::
::::
