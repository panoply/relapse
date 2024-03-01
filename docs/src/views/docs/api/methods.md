---
title: 'Relapse | Methods'
layout: base
permalink: '/api/methods.html'
prev:
  label: 'Folds'
  uri: '/api/folds'
next:
  label: 'Events'
  uri: '/api/events'
---

## Methods

A Relapse instance also expose some basic methods for programmatic control.

<!--prettier-ignore-->
```js
import relapse from 'relapse';

const method = relapse('.selector');

method.expand(0);           // Expands fold at index 0
method.expand('foo');       // Expands fold with id value of "foo"
method.collapse(1);         // Collapse fold at index 1
method.collapse('bar');     // Collapse fold with id value of "bar"
method.destroy();           // Destroy the relapse instance
method.reinit();            // Destroy and reinitialize instance
```

<br>

## Example

Click the buttons to open and close folds. This example is using the `expand()` and `collapse()` methods as we have demonstrated above. We have enabled `multiple` and set `persist` to `false` on this instance of Relapse so all folds can be expanded and collapsed.

{% include 'api/methods' %}
