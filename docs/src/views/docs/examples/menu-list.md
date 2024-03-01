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

A sibling structured nested menu list. This example showcases how one might go about leveraging Relapse to create a collapsible menu sidebar. The example is leveraging sibling structured markup and applied nested relapse data attribute annotations when initializing. The flems example provides some basic CSS styling for how you'd theme the menu list.

<br>

:::: grid col-12
::: tabs example:menu-list

{% render 'examples/menu-list' %}

:::
::: tabs html

<!-- prettier-ignore-->
```html
<section
  class="relapse-menu"
  data-relapse="menu"
  data-relapse-persist="false"
  data-relapse-multiple="true">
  <button
    type="button"
    class="menu-group">
    Category 1
  </button>
  <ul class="menu-list" hidden>
    <li>
      <a href="#">Link 1</a>
    </li>
    <li
      data-relapse="submenu"
      data-relapse-persist="false"
      data-relapse-multiple="true">
      <button
        type="button"
        class="submenu-group fc-white">
        Link Menu
      </button>
      <ul class="menu-list">
        <li>
          <a href="#">Link 2</a>
        </li>
        <li>
          <a href="#">Link 3</a>
        </li>
      </ul>
    </li>
    <li class="menu-item">
      <a href="#">Link 1</a>
    </li>
    <li class="menu-item">
      <a href="#">Link 2</a>
    </li>
  </ul>
  <button
    type="button"
    class="menu-group">
    Category 2
  </button>
  <ul class="menu-list" hidden>
    <li>
      <a href="#">Link 1</a>
    </li>
    <li>
      <a href="#">Link 2</a>
    </li>
    <li>
      <a href="#">Link 3</a>
    </li>
  </ul>
  <button
    type="button"
    class="menu-group">
    Category 3
  </button>
  <ul class="menu-list" hidden>
    <li>
      <a href="#">Link 1</a>
    </li>
    <li>
      <a href="#">Link 2</a>
    </li>
    <li>
      <a href="#">Link 3</a>
    </li>
    <li
      class="submenu"
      data-relapse="menu2"
      data-relapse-persist="false"
      data-relapse-multiple="true">
      <button
        type="button"
        class="submenu-group">
        Link Menu
      </button>
      <ul class="menu-list">
        <li>
          <a href="#">Link 1</a>
        </li>
        <li>
          <a href="#">Link 2</a>
        </li>
        <li>
          <a href="#">Link 3</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#">Link 4</a>
    </li>
    <li>
      <a href="#">Link 5</a>
    </li>
  </ul>
</section>
```
