---
title: 'Relapse | Introduction'
layout: base
permalink: '/index.html'
---

# 🪗 Relapse

An [A11y](https://www.a11yproject.com/) compliant, lightweight (2kb gzip) dependency free toggle utility for creating dynamic
collapsible accordions, menu-lists, content blocks and expanded folds. Relapse respects your custom styling, works with minimum markup, ensures silky smooth transitions using inlined CSS and flaunts an extensive user-friendly API for refined programmatic control.

{% render 'examples/showcase' %}

---

#### Single Instance

Relapse can be initialized 2 different ways, depending on what you require. Parameter entries determines the invocation method to apply. Passing an element selector to `replace()` as the first parameter will return a single instance which is ideal for cases where you require Relapse to invoke on a specific element.

```js
import relapse from 'relapse';

// OPTION 1 - Passing a selector and use default options
relapse('.selector');

// OPTION 2 - Passing a element and use default options
relapse(document.querySelector('.element'));

// OPTION 3 - Passing a selector with options
relapse('.selector', {
  persist: false,
  multiple: false,
  speed: 225,
  schema: 'data-relapse',
  classes: {
    initial: 'initial',
    opened: 'opened',
    focused: 'focused',
    expanded: 'expanded',
    disabled: 'disabled'
  }
});
```

<br>

#### Multiple Instances

In cases where there are multiple Relapse occurrences existing in the DOM, you may prefer to initialize using data attribute annotation. Elements that contain a `data-relapse` attribute or and attribute matching the `schema` option can be automatically activated by omitting the selector parameter. An array list of instances are returned when no selector argument is passed, for example:

```js
import relapse from 'relapse';

// OPTION 1 - Active on all elements using data-relapse attribute
relapse();

// OPTION 2 - Active on all element using data-toggle attribute
relapse({ schema: 'data-toggle' });

// OPTION 3 - Active on all elements using data-relapse with options
relapse({
  persist: false,
  multiple: false,
  speed: 225,
  schema: 'data-relapse',
  classes: {
    initial: 'initial',
    opened: 'opened',
    focused: 'focused',
    expanded: 'expanded',
    disabled: 'disabled'
  }
});
```
