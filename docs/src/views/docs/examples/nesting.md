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
::: tabs example:nesting

{% render 'examples/nesting' %}

:::
::: tabs html

<!-- prettier-ignore -->
```html
<section
  class="relapse"
  data-relapse="nesting"
  data-relapse-folding-duration="200">
  <details open>
    <summary>
      Collapse 0.1.0
    </summary>
    <div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Elementum sagittis vitae et leo duis ut.
        Ut tortor pretium viverra suspendisse potenti. Commodo sed egestas egestas fringilla
        phasellus faucibus.
      </p>
      <section
        class="relapse"
        data-relapse="nesting-one"
        data-relapse-folding-duration="150">
        <details open>
          <summary>
            Collapse 0.2.0
          </summary>
          <div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Elementum sagittis vitae et leo
              duis ut. Ut tortor pretium viverra suspendisse potenti.
            </p>
            <section
              class="relapse"
              data-relapse="nesting-two"
              data-relapse-multiple="true"
              data-relapse-fold-duration="300">
              <details open>
                <summary>
                  Collapse 0.3.0
                </summary>
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Elementum sagittis
                  vitae et leo duis ut. Ut tortor pretium viverra suspendisse potenti.
                  Commodo sed egestas egestas fringilla phasellus faucibus.
                </div>
              </details>
              <details>
                <summary>
                  Collapse 0.3.1
                </summary>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Elementum sagittis
                  vitae et leo duis ut. Ut tortor pretium viverra suspendisse potenti.
                </p>
              </details>
              <details>
                <summary>
                  Collapse 0.3.2
                </summary>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </details>
              <details open>
                <summary>
                  Collapse 0.3.3
                </summary>
                <div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum
                    sagittis vitae et leo duis ut.
                  </p>
                  <section
                    class="relapse"
                    data-relapse="nesting-three"
                    data-relapse-fold-duration="400">
                    <details open>
                      <summary>
                        Collapse 0.4.0
                      </summary>
                      <div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Elementum sagittis vitae et leo duis ut. Ut tortor pretium.
                      </div>
                    </details>
                    <details>
                      <summary>
                        Collapse 043.1
                      </summary>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Elementum sagittis vitae et leo duis ut. Ut tortor pretium
                        viverra suspendisse potenti.
                      </p>
                    </details>
                  </section>
                </div>
              </details>
            </section>
          </div>
        </details>
        <details>
          <summary>
            Collapse 0.2.1
          </summary>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Elementum sagittis vitae et leo
            duis ut. Ut tortor pretium viverra suspendisse potenti.
          </p>
        </details>
      </section>
    </div>
  </details>
  <details>
    <summary>
      Collapse 0.1.1
    </summary>
    <p>
      Commodo sed egestas egestas fringilla phasellus faucibus. Eu tincidunt tortor aliquam
      nulla facilisi cras fermentum. Nullam eget felis eget nunc lobortis mattis. Et netus et
      malesuada fames ac turpis egestas maecenas. Vitae turpis massa sed elementum tempus
      egestas. Eget mi proin sed libero enim sed faucibus turpis. Pharetra convallis posuere
      morbi leo urna molestie. Magna eget est lorem ipsum dolor. Convallis tellus id interdum
      velit laoreet id. At consectetur lorem donec massa sapien faucibus et molestie.
      Porttitor lacus luctus accumsan tortor posuere ac.
    </p>
  </details>
</section>
```

:::

::::
