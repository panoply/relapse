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

method.config({})          // Update and resets the options
method.expand(0);           // Expands fold at index 0
method.expand('foo');       // Expands fold with id value of "foo"
method.collapse(1);         // Collapse fold at index 1
method.collapse('bar');     // Collapse fold with id value of "bar"
method.destroy();           // Destroy the relapse instance
method.reinit();            // Destroy and reinitialize instance
```

<br>

## Example

Click the buttons to open and close folds. This example is using the `expand()` and `collapse()` methods as we have demonstrated above. Below you can adjust some options for this instance.

<div spx-component="methods">

{% include 'api/methods' %}

---

### Updating Options

Below we are taking advantage of the `options()` method which will update the configuration settings of a specific Relapse instance. The example has omitted some option settings for the sake of the example.

> It's important to note that options such as `schema`, `unique` and `classes` are not available in post-instance states. This means you cannot augment these settings via the `options()` method.

<div class="row gx-2 gx-sm-3 jc-center jc-sm-start mt-4 mb-2">
<div class="col-12 col-md-4">

{% include 'api/options' %}

</div>
<div class="col-12 col-md-8" spx-node="methods.render"></div>
</div>

</div>
