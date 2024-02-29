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

# Sibling Example

A collapsible accordion example using the [sibling markup](/relapse/usage/markup) structure. The accordion leverages `<button>` and `<section>` tags. The sibling structure takes advantage of the `hidden` attribute and the CSS `opened` class. Refer to the [styling](/relapse/usage/classes) section for additional information on Relapse classes.

<br>

:::: grid col-12
::: tabs example:sibling

{% render 'examples/sibling' %}

:::
::: tabs html

<!-- prettier-ignore -->
```html
<section
  class="relapse"
  data-relapse="sibling-relapse"
  data-relapse-speed="220"
  data-relapse-persist="false"
  data-relapse-multiple="false">
  <button type="button" class="relapse-button opened">
    Collapse 0
  </button>
  <section class="relapse-fold">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Elementum sagittis vitae et leo duis ut.
      Ut tortor pretium viverra suspendisse potenti.
    </p>
  </section>
  <button type="button" class="relapse-button">Collapse 1</button>
  <section class="relapse-fold" hidden>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Elementum sagittis vitae et leo duis ut.
      Ut tortor pretium viverra suspendisse potenti.
    </p>
  </section>
  <button type="button" class="relapse-button">Collapse 2</button>
  <section class="relapse-fold" hidden>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Elementum sagittis vitae et leo duis ut.
      Ut tortor pretium viverra suspendisse potenti.Lorem ipsum dolor sit amet, consectetur
      adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Elementum sagittis vitae et leo duis ut. Ut tortor pretium viverra suspendisse potenti.
    </p>
  </section>
 <button type="button" class="relapse-button">Collapse 3</button>
  <section class="relapse-fold" hidden>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Elementum sagittis vitae et leo duis ut.
      Ut tortor pretium viverra suspendisse potenti.Lorem ipsum dolor sit amet, consectetur
      adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Elementum sagittis vitae et leo duis ut. Ut tortor pretium viverra suspendisse potenti.
    </p>
  </section>
</section>
```

:::
::::
