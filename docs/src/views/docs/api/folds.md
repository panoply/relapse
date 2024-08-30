---
title: 'Relapse | Folds'
layout: base
permalink: '/api/folds.html'
prev:
  label: 'Options'
  uri: '/api/options'
next:
  label: 'Methods'
  uri: '/api/methods'
---

## Folds

Folds are the elements which will be expanded and collapsed within toggle groups. Each fold is considered an instance and expose additional methods for interfacing. You can target folds using a zero based index reference within a collapsible group or by an identifier value provided on the markup element using an `id=""` attribute.

Take the following code sample, we have are 3 different relapse toggle groups. There are **2** relapse components using the `data-relapse` attribute (`foo` and `bar`) and **1** relapse component using a `selector` reference (`baz`).

{% render 'styling/tab-begin' %}

```html
<section data-relapse="foo">
  <!-- [0] -->
  <details open>
    <summary>Opens Fold #1</summary>
    <p>This is Fold 1, index 0 and is opened by default</p>
  </details>
  <!-- [1] -->
  <details>
    <summary>Opens Fold #2</summary>
    <div>This is fold 2, index 1</div>
  </details>
  <!-- [2] -->
  <details>
    <summary>Opens Fold #3</summary>
    <div>This is fold 3, index 2</div>
  </details>
</section>

<section data-relapse="bar">
  <!-- [0] -->
  <details open>
    <summary>Opens Fold #1</summary>
    <p>This is Fold 1, index 0 and is opened by default</p>
  </details>
  <!-- [1] -->
  <details id="qux">
    <summary>Opens Fold #2</summary>
    <div>This is fold 2, index 1 using id of qux</div>
  </details>
</section>

<section id="baz">
  <!-- [0] -->
  <details>
    <summary>Opens Fold #1</summary>
    <div>This is fold 1, index 0</div>
  </details>
  <!-- [1] -->
  <details>
    <summary>Opens Fold #2</summary>
    <div>This is fold 2, index 1</div>
  </details>
</section>
```

{% render 'styling/tab-column' %}

```html
<section data-relapse="foo">
  <!-- [0] -->
  <button type="button">Collapse 1</button>
  <div>This is Fold 1, index 0</div>
  <!-- [2] -->
  <button type="button">Collapse 1</button>
  <div>This is fold 2, index 1</div>
  <!-- [1] -->
  <button type="button">Collapse 2</button>
  <div>This is fold 3, index 2</div>
</section>

<section data-relapse="bar">
  <!-- [0] -->
  <button type="button">Collapse 1</button>
  <div>This is Fold 1, index 0</div>
  <!-- [1] -->
  <button type="button">Collapse 2</button>
  <div id="qux">This is fold 2, index 1 using id of qux</div>
</section>

<section id="baz">
  <!-- [0] -->
  <button type="button">Collapse 1</button>
  <div>This is Fold 1, index 0</div>
  <!-- [1] -->
  <button type="button">Collapse 2</button>
  <div>This is Fold 2, index 1</div>
</section>
```

{% render 'styling/tab-ender' %}

<br>

The below code snippet targets the relapse component using `data-relapse="foo"` in the above example. We are obtaining the fold which uses the id `qux` and describe each available reference and method available. The `folds.get()` method is a sugar helper for querying relapse folds, it accepts either a `string` value which matches the fold element `id` or a zero based `integer` index value.

<!-- prettier-ignore -->
```js
import relapse from 'relapse';

// Initialize on all occurrences using data-relapse attributes
relapse();

// Return the relapse component using data-relapse="foo"
const foo = relapse.get('foo');

// Return the fold in relapse foo component using id="qux"
const fold = foo.folds.get('qux');

fold.id              // The fold id (foo) defaults to custom identifier when undefined
fold.button          // The <summary> element in semantic structures or <button> in sibling
fold.wrapper         // The <details> element in semantic structures or <div> in sibling
fold.element         // The <p> element in semantic structures of <div> in sibling
fold.index           // The zero based index of the fold in the toggle group, i.e: 1
fold.expanded        // Boolean value informing whether fold is expanded
fold.height          // The current height value of the fold, offsetHeight or scrollHeight
fold.disabled        // Boolean value indicating whether fold is in disable/enabled state
fold.locked          // Whether the fold is locked. Folds will lock if initialized as disabled.
fold.open();         // Open the fold in the toggle group
fold.close();        // Close the fold in the toggle group.
fold.blur();         // Apply blur to the button in toggle group
fold.focus();        // Apply focus to the button in toggle group
fold.toggle();       // Open or close the fold in the toggle group
fold.enable();       // Enable the fold to expand and collapse, opposite of disable
fold.disable();      // Disable the fold from expand and collapse
fold.destroy();      // Remove the button and fold from toggle group
```

<br>

Following the above example, below we are targeting the **selector** based relapse component in our example. The last element with the `id` value of `baz` will be initialized in isolation, but it will still be accessible in global store (i.e: `window.relapse.get('baz')`). Because none of folds have an `id` attribute, we will target them using a zero based index.

<!-- prettier-ignore -->
```js
import relapse from 'relapse';

const { folds } = relapse('#baz');

fold[0].id          // Fold id at index 0
fold[1].button      // Fold button at index 1
fold[2].wrapper     // Fold wrapper at index 2
fold[0].element     // Fold element at index 0
fold[1].index       // Fold index at index 0
fold[2].expanded    // Fold expanded status at index 2
fold[0].height      // Fold offsetHeight at index 0
fold[1].disabled    // Fold disabled status at index 1
fold[2].locked      // Fold locked status at index 2
fold[0].open();     // Fold open at index 0
fold[1].close();    // Fold close at index 1
fold[2].blur();     // Fold blur at index 2
fold[0].focus();    // Fold focus at index 0
fold[1].toggle();   // Fold toggle at index 1
fold[2].enable();   // Fold enable at index 2
fold[0].disable();  // Fold disable at index 0
fold[1].destroy();  // Fold destroy at index 1
```
