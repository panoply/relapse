---
title: 'Relapse | Options'
layout: base
permalink: '/api/options.html'
prev:
  label: 'Instances'
  uri: '/usage/instances'
next:
  label: 'Methods'
  uri: '/api/methods'
---

## Options

Relapse exposes only a small set of configuration options. When you need custom control for a specific element, you can provide a `selector` parameter (e.g: `relapse('.selector')`) which will instruct relapse to invoke in isolation and return a single instance. Calling relapse without a selector parameter (e.g: `relapse()`) will return an array list of instances.

<!-- prettier-ignore -->
```js
import relapse from 'relapse';

relapse('.selector', {
  persist: false,            // Whether or not a fold should always be expanded
  multiple: false,           // Whether or not multiple folds can be expanded
  unique: false,             // Whether or not instance is unique
  schema: 'data-relapse',    // Custom data attribute reference
  folding: {
    easing: 'ease-in-out',   // The animation easing to apply
    duration: 120,           // Duration of the fold content transition
    hint: true               // Whether or not to apply rendering hint
  },
  fading: {
    duration: 120,           // Duration of the fold content transition
    transition: 'linear',    // The easing effect to apply when fading content
    hint: true               // Whether or not to apply rendering hint
  },
  classes: {
    opened: 'opened',        // The class to use for opened button
    focused: 'focused',      // The class to use on button focus
    expanded: 'expanded',    // The class to use on expanded fold
    disabled: 'disabled'     // The class to use for disabled fold
  }
});
```

<br>

### `persist`

Whether or not to always ensure a fold within the toggle group is expanded.

### `multiple`

Whether or not multiple folds within a toggle group can be expanded. When `false` only a single fold will be expanded

### `duration`

Set the expand and collapse transition speed in **ms**. Passing a negative value (e.g: `-1`) or `NaN` will limit the inline CSS.

### `easing`

Set the animation easing transition. Defaults to `ease-in-out` and accepts cubic-bezier etc.

### `schema`

Change the data attribute annotation to a custom name. Changes to this apply to attribute customizations.

### `fading`

Fading animation control applied to inner contents of folds when expanding and collapsing.

```js
{
  duration: 120,
  transition: 'linear'
}
```

### `classes`

Define a set of custom classes for relapse to apply. See [styling](/styling) for a complete overview

```js
{
  initial: 'initial',
  opened: 'opened',
  focused: 'focused',
  expanded: 'expanded',
  disabled: 'disabled'
}
```
