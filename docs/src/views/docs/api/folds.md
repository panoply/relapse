---
title: 'Relapse | Folds'
layout: base
permalink: '/api/folds.html'
prev:
  label: 'Methods'
  uri: '/api/methods'
next:
  label: 'Events'
  uri: '/api/events'
---

## Folds

Folds expose additional methods for interfacing, you can target folds using a zero based index reference within a collapsible group or by an identifier value. Take the following code sample, wherein there are 3 different relapse toggle groups. There are 2 relapse components using the `data-relapse` attribute and 1 relapse component using a `selector` reference. The values which were passed to components using `data-relapse` attributes will become our reference for when we need to access the instance for programmatic control.

When multiple relapse elements exist in the DOM the **return** value of `relapse` is a `Relapse[]` list of instances starting at the first occurrence encountered. Elements which do not use `data-relapse` attribute annotation can be initialized in isolation by passing the **selector** to relapse.


:::: grid col-12
::: tabs markup

```html
<section data-relapse="foo">
<!-- [0] -->
  <details open>
    <summary>Opens Fold #1</summary>
    <p>This is Fold #1 and will be opened by default</p>
  </details>
  <!-- [1] -->
  <details>
    <summary>Opens Fold #2</summary>
    <p>This is Fold #2</p>
  </details>
  <!-- [2] -->
  <details>
    <summary>Opens Fold #3</summary>
    <p>This is Fold #3</p>
  </details>
</section>

<section data-relapse="bar">
  <!-- [0] -->
  <details open>
    <summary>Opens Fold #1</summary>
    <p>This is Fold #1 and will be opened by default</p>
  </details>
  <!-- [1] -->
  <details>
    <summary>Opens Fold #2</summary>
    <p>This is Fold #2</p>
  </details>
  <!-- [2] -->
  <details>
    <summary>Opens Fold #3</summary>
    <p>This is Fold #3</p>
  </details>
</section>
```

:::
::: tabs sibling

```html
<section data-relapse="foo">
  <!-- [0] -->
  <button type="button">Collapse 1</button>
  <div>I am collapse item number 1</div>
  <!-- [1] -->
  <button type="button">Collapse 2</button>
  <div>I am collapse item number 2</div>
  <!-- [2] -->
  <button type="button">Collapse 3</button>
  <div id="qux">
    I am collapse item number 3 with id of qux
  </div>
</section>

<section data-relapse="bar">
  <!-- [0] -->
  <button type="button">Collapse 1</button>
  <div>I am collapse item number 1</div>
  <!-- [1] -->
  <button type="button">Collapse 2</button>
  <div>I am collapse item number 2</div>
</section>

<section id="baz">
  <!-- [0] -->
  <button type="button">Collapse 1</button>
  <div>I am collapse item number 1</div>
  <!-- [1] -->
  <button type="button">Collapse 2</button>
  <div>I am collapse item number 2</div>
</section>
```

:::
::::


<br>

The below code snippet targets the relapse component using `data-relapse="foo"` in the above example. We are obtaining the fold which uses the id `qux` and describing each available reference and method. The `folds.get()` method is a sugar helper for querying relapse folds, it accepts either a string value which matches the fold element `id` or a zero based index value.

<!-- prettier-ignore -->
```js
import relapse from 'relapse';

// Initialize on all occurrences using data-relapse attributes
relapse();

// Return the relapse component using data-relapse="foo"
const foo =  relapse.get('foo');

// Return the fold in relapse foo component using id="qux"
const fold = foo.folds.get('qux');

fold.id         // The fold id, defaults to custom identifier if undefined
fold.button     // The button toggle element which controls the fold
fold.element    // The fold HTML Element
fold.index      // The zero based index of the fold in the toggle group
fold.expanded   // Boolean value informing whether fold is expanded
fold.height     // The max-height value of the fold, alias of scrollHeight
fold.disabled   // Boolean value indication a disable/enabled state
fold.open();    // Open the fold in the toggle group
fold.close();   // Close the fold in the toggle group.
fold.blur();    // Apply blur to the button in toggle group
fold.focus();   // Apply focus to the button in toggle group
fold.toggle();  // Open or Close the fold in the toggle group
fold.enable();  // Enable the fold to expand and collapse
fold.disable(); // Disable the fold from expand and collapse
fold.destroy(); // Remove the button and fold from toggle group
```

<br>

Following the above example, below we are targeting the **selector** based relapse component in our example. The last element with the `id` value of `baz` will be initialized in isolation, but it will still be accessible in global store (i.e: `window.relapse.get('baz')`). Because none of folds have an `id` attribute, we will target them using a zero based index.

<!-- prettier-ignore -->
```js
import relapse from 'relapse';

const { folds } = relapse('#baz');

folds[0].id         // The fold id, defaults to custom identifier if undefined
folds[0].button     // The button toggle element which controls the fold
folds[0].element    // The fold HTML Element
folds[0].index      // The zero based index of the fold in the toggle group
folds[0].expanded   // Boolean value informing whether fold is expanded
folds[0].height     // The max-height value of the fold, alias of scrollHeight
folds[0].disabled   // Boolean value indication a disable/enabled state
folds[0].open();    // Open the fold in the toggle group
folds[0].close();   // Close the fold in the toggle group.
folds[0].blur();    // Apply blur to the button in toggle group
folds[0].focus();   // Apply focus to the button in toggle group
folds[0].toggle();  // Open or Close the fold in the toggle group
folds[0].enable();  // Enable the fold to expand and collapse
folds[0].disable(); // Disable the fold from expand and collapse
folds[0].destroy(); // Remove the button and fold from toggle group
```
