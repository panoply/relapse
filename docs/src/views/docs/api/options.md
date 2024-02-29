---
title: 'Relapse | Options'
layout: base
permalink: '/api/options.html'
prev:
  label: 'Instance'
  uri: '/api/instance'
next:
  label: 'Folds'
  uri: '/api/folds'
---

## Options

Relapse exposes only a small set of configuration options, all of which are optional. All options can be controlled via data attributes, prefixed with `data-relapse` or the `schema` reference provided. It is recommended that you first take a look at the [instances](/relapse/api/instance) section to better understand how configuration is applied.

<!-- prettier-ignore -->
```js
import relapse from 'relapse';

relapse('.selector', {
  persist: false,            // Whether or not a fold should always be expanded
  multiple: false,           // Whether or not multiple folds can be expanded
  unique: false,             // Whether or not instance is unique
  schema: 'data-relapse',    // Custom data attribute reference
  fold: {
    easing: 'ease-in-out',   // The animation easing to apply
    duration: 200,           // Duration of the fold content transition
  },
  fade: {
    duration: 120,           // Duration of the fold content transition
    transition: 'linear',    // The easing effect to apply when fading content
  },
  classes: {
    opened: 'opened',        // The class to use for opened button
    expanded: 'expanded',    // The class to use on expanded fold
    disabled: 'disabled'     // The class to use for disabled fold
  }
});
```

<br>

## Attributes

Attribute driven control is supported and when defined will overwrite initialization configuration. Attribute defined options can be provided on the selector element of Relapse nodes and should be prefixed with `data-relapse` or the `schema` reference provided. See the below **default** example:

<!-- prettier-ignore-->
```html
<div
  data-relapse="id"
  data-relapse-persist="false"
  data-relapse-multiple="false"
  data-relapse-unique="true"
  data-relapse-fold-duration="200"
  data-relapse-fold-easing="ease-in-out"
  data-relapse-fade-duration="120"
  data-relapse-fade-easing="linear"
  data-relapse-class-opened="opened"
  data-relapse-class-expanded="expanded"
  data-relapse-class-disabled="disabled"></div>
```

---

## persist

Whether or not to always ensure a fold within the toggle group is expanded.

{% include 'api/persist' %}

---

## multiple

Whether or not multiple folds within a toggle group can be expanded. When `false` only a single fold will be expanded

{% include 'api/multiple' %}

---

## schema

The data attribute annotation schema that relapse should use. By default, this is to `data-relapse`, this option will allow you to customize the attribute prefix key name that Relapse references in query selection operations.

:::: grid row
::: grid col-6

```js
import relapse from 'relapse';

// Initializes on all elements in the DOM
// containing the data-foo attribute.
relapse({
  schema: 'data-foo'
});
```

:::
::: grid col-6

<!--prettier-ignore-->
```html
<div
  data-foo="some-id"
  data-foo-multiple="true">
  <details>
  ...
  </details>
</div>
```

:::
::::

---

## unique

Whether or not the instance identifier should be treated as unique. This defaults to `true` and ensures that Relapse identifiers are unique and will throw if an instance already exists with the same name. When set to `false`, relapse will not throw if an instance with the identifier exists, but instead will it will skip re-assignment and teardown operations.

> This option is helpful in SPA's or when you need to persist an already invoked Relapse instance in the DOM.

---

## Fold

Folding animation control applied when expanding and collapsing folds. Relapse uses the [Web Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) and settings provided here will be passed to this API. Options will be used for all folds in the instance and can be controlled using data attribute.

##### duration

The animation speed in `ms` to be applied when expanding and collapsing folds, defaults to `200`.

##### easing

The animation easing transition. This defaults to `ease-in-out` and accepts cubic-bezier etc.

---

### Fade

Fading animation control applied to inner contents of folds when expanding and collapsing. Relapse uses the [Web Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) and settings provided here will be passed to this API.

##### duration

The animation fading speed in `ms` to be applied when the inner content of folds, defaults to `120`.

##### easing

The content fold easing effect. This defaults to `linear` and applies to the inner contents of folds when expanding and collapsing.

---

## classes

Define a set of custom classes for relapse to apply. See [styling](/relapse/usage/styling) for a complete overview.

##### opened

The class name added to **button** elements within a collapsible group when the fold is **expanded**.

##### expanded

The class name added to **fold** elements within a collapsible group when the fold is **expanded**.

##### disabled

The class name added to **button** elements within a collapsible groups when the fold is marked as `disabled`.
