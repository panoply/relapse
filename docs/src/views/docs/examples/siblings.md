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

A simple accordion using relapse. The component applies custom CSS styling.

:::: grid col-12
::: tabs example

{% render 'examples/siblings' %}

:::
::: tabs html


```html
<section
  class="relapse w-100"
  data-relapse="initials"
  data-relapse-speed="250"
  data-relapse-persist="false"
  data-relapse-multiple="false">
  <button type="button" class="relapse-button initial">
    Collapse 0
  </button>
  <section class="relapse-fold">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore
      magnaaliqua. Elementum sagittis vitae et leo duis ut.
    </p>
  </section>
  <button type="button" class="relapse-button">
    Collapse 1
  </button>
  <section class="relapse-fold" aria-hidden="true">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore
      magnaaliqua. Elementum sagittis vitae et leo duis ut.
    </p>
  </section>
  <button type="button" class="relapse-button">
    Collapse 2
  </button>
  <section class="relapse-fold" aria-hidden="true">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore
      magnaaliqua. Elementum sagittis vitae et leo duis ut.
    </p>
  </section>
</section>
```

:::
::::
