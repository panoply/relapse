---
title: 'Relapse | Usage'
layout: base
permalink: '/usage.html'
---

## Usage

Calling `relapse()` with options omitted will initialize on all elements in the DOM annotated with a `data-relapse` attribute. Relapse requires that you call the default export to initialize.

```js
import relapse from 'relapse';

// initializes on all elements with data-relapse attribute
relapse();

// initialize on a specific element matching the selector
relapse('.selector');
```

<br>

Relapse works within a minimal node tree. The required markup structure consists of an outer (wrapper) element, button element/s and fold element/s. The button and fold elements must be arranged as siblings.

```html
<div data-relapse="example">
  <!-- [0] -->
  <button type="button">Opens Fold #1</button>
  <div>This is Fold #1</div>
  <!-- [1] -->
  <button type="button">Opens Fold #2</button>
  <div>This is Fold #2</div>
  <!-- [2] -->
  <button type="button">Opens Fold #3</button>
  <div>This is Fold #3</div>
</div>
```

> Fold elements within the toggle group must **not** apply padding or margin. Relapse uses `max-height` for expand calculations and spacing applied will result in folds not being flush.

---

## Options

Relapse exposes only a small set of configuration options. When you need custom control for a specific element, you can provide a `selector` parameter (e.g: `relapse('.selector')`) which will instruct relapse to invoke in isolation and return a single instance. Calling relapse without a selector parameter (e.g: `relapse()`) will return an array list of instances.

```js
import relapse from 'relapse';

relapse('.selector', {
  persist: false, // Whether or not a fold should always be expanded
  multiple: false, // Whether or not multiple folds can be expanded
  duration: 225, // Animation speed transition is ms
  schema: 'data-relapse', // Custom data attribute reference
  classes: {
    initial: 'initial', // The class to use for initial expands
    opened: 'opened', // The class to use for opened button
    focused: 'focused', // The class to use on button focus
    expanded: 'expanded', // The class to use on expanded fold
    disabled: 'disabled' // The class to use for disabled fold
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

### `schema`

Change the data attribute annotation to a custom name. Changes to this apply to attribute customizations.

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

---

## Instance

Relapse will maintain active instances in global scope. Each relapse instance is accessible via `window.relapse` which uses a `Map` store where keys reference the `data-relapse` value contained on elements. If you've omitted a **value** from the `data-relapse` attribute or you are initializing an instance in isolation (i.e: via selector), then relapse will use the `id=""` value as a key identifier in the global store. If neither an `id` or `data-relapse` value are defined, a UUID is generated.

<!-- prettier-ignore -->
```js
import relapse from 'relapse';

const toggle = relapse('.selector');

toggle.expand()        // Accepts a fold index of id to expand
toggle.collapse()      // Accepts a fold index of id to collapse
toggle.destroy()       // Accepts a fold index of id to destroy
toggle.on(event, cb);  // Event listeners which emit on folds
toggle.id              // Returns the relapse id
toggle.element         // Returns the relapse element
toggle.parent          // Nested relapse occurrence element
toggle.active          // Zero based index of current active fold
toggle.events          // An object or event listeners
toggle.config          // The configuration settings
toggle.folds[]         // An array list of fold instances
```

---

## Events

Events will be dispatched at different points when an expanding and collapsing folds within the toggle group. Event parameters will include the toggled fold and `this` scope will pass in the Relapse instance.

<!-- prettier-ignore -->
```js
import relapse from 'relapse';

const event = relapse('.selector');

// toggle button has been focused.
event.on('focus', function (fold) {});

// toggle button has been clicked
event.on('toggle', function (fold) {});

// fold has been opened
event.on('expand', function (fold) {});

// fold has been closed
event.on('collapse', function (fold) {});

// relapse instance has been destroyed.
event.on('destroy', function (fold) {});
```

---

### Methods

A Relapse instances also expose some basic methods for programmatic control.

```typescript
import relapse from 'relapse';

const method = relapse('.selector');

// Expands a fold
method.expand(fold: number | string);

// Collapse a fold
method.collapse(fold: number | string);

// Destroy
method.destroy();
```

---

## Folds

Folds expose additional methods for interfacing, you can target folds using a zero based index reference within a collapsible group or by an identifier value. Take the following code sample, wherein there are 3 different relapse toggle groups. There are 2 relapse components using the `data-relapse` attribute and 1 relapse component using a `selector` reference. The values which were passed to components using `data-relapse` attributes will become our reference for when we need to access the instance for programmatic control.

When multiple relapse elements exist in the DOM the **return** value of `relapse` is a `Relapse[]` list of instances starting at the first occurrence encountered. Elements which do not use `data-relapse` attribute annotation can be initialized in isolation by passing the **selector** to relapse.

<!-- prettier-ignore -->
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
