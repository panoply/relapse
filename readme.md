# Relapse

An [A11y](https://www.a11yproject.com/) compliant, lightweight (1.9kb gzip) dependency free toggle utility for collapsible accordions. Written in TypeScript and distributed in ES6 this tiny little module flaunts an extensive API for usage in modern web projects,

Visit Documentation: https://panoply.github.io/relapse/public

### Key Features

- Minimal markup (2 element node tree)
- Silky smooth transitions
- Drop-in solution with no complexities
- Accessibility support
- Functional and pure, no classes or prototype
- Event dispatching with global context access

### Installation

The module is shipped for ESM consumption in the Browser.

```bash
pnpm add relapse
```

# Usage

The module uses a default export:

```js
import relapse from 'relapse';

relapse({
  persist: true,
  multiple: false,
  schema: 'data-accordion',
  classes: {
    initial: 'initial',
    opened: 'opened',
    focused: 'focused',
    expanded: 'expanded',
    disabled: 'disabled'
  }
});
```

# Markup

The node tree is minimal in relapse and markup must adhere to the below structures. By default, no padding or margin is applied to the fold elements. Each `.relapse-fold` class represents an element that will be expanded and collapsed.

### Basic structure

<!-- prettier-ignore -->
```html
<div data-relapse="some-id">

  <!-- PANEL 1 -->

  <button type="button">Opens Fold #1</button>
  <div class="relapse-fold">
    This is Fold #1
  </div>

  <!-- PANEL 2 -->

   <button type="button">Opens Fold #2</button>
  <div class="relapse-fold">
    This is Fold #2
  </div>

  <!-- PANEL 3 -->

  <button type="button">Opens Fold #3</button>
  <div class="relapse-fold">
    This is Fold #3
  </div>

</div>
```

### Nested Structure

Relapse supports nested folds

<!-- prettier-ignore -->
```html
<div data-relapse="parent">

  <!-- PANEL 1 -->

  <button type="button" class="relapse-btn">Opens Fold #1</button>
  <div class="relapse-fold">


    <p>This is Fold #1</p>

    <div data-relapse="nested">

      <button type="button" class="relapse-btn">Opens Fold #1.1</button>
      <div class="relapse-fold">

        <p>This is Fold #1.1</p>

        <div data-relapse="nested">

          <button type="button" class="relapse-btn">Opens Fold #1.2</button>
          <div class="relapse-fold">
            <p>This is Fold #1.2</p>
          </div>

        </div>
      </div>
    </div>

  </div>
</div>
```

# Styling

The module leverages CSS for transform effects (i.e: open/close).

### Classes

Relapse uses 5 specific class names on folds which will infer the current state of a fold. You can use these classes to add things like opened/closed icons and background colors.

### `initial`

Applied to the toggle button element to open a fold at runtime.

### `opened`

Applied to the toggle button element when a fold is expanded.

### `focused`

Applied to the toggle button element when it has been focused

### `expanded`

Applied to the fold element when it is expanded

### `disabled`

Applied to the toggle button element when it is disabled.

# Options

Relapse provides the following surface level option configurations.

### `persist`

Persist will ensure a fold is always expanded, traditional accordion style.

**Default:** `true`

### `multiple`

Allows for multiple folds to be expanded.

**Default:** `false`

### `schema`

Customize the attribute annotation data attribute.

**Default:** `data-accordion`

### `classes`

Customize the class names that relapse applies

**Default:**

```ts
{
  initial: 'initial',
  opened: 'opened',
  focused: 'focused',
  expanded: 'expanded',
  disabled: 'disabled'
}
```

# Attribute Options

You may also prefer to pass options via data attributes. Relapse support attribute configurations from within the DOM.

- data-relapse
- data-relapse-duration
- data-relapse-persist
- data-relapse-multiple

# Instance

Relapse will maintain active instances in global scope. Each accordion is accessible via `window.relapse` which uses a `Map` store who's keys will reference the element `id` of each accordion. When no `id` is defined one is generated with a UUID value.

> The Typings will inform upon the methods and values available to each instance.

```ts
interface Accordion {
  on: (event: string, callback: (this: Accordion, fold?: Fold) => void) => void;
  off: (event: string, callback: Function) => void);
  expand: (fold: number | string) => void);
  collapse: (fold: number | string) => void);
  destroy: (fold?: number | string, remove?: boolean) => void;
  id: string;
  element: HTMLElement;
  active: number;
  events: {
    [name: string]: Array<(this: Accordion, fold?: Fold) => void>
  };
  config: {
    persist: boolean;
    multiple: boolean;
    classes: {
      opened: string;
      expanded: string;
      focused: string;
      disabled: string;
    }
  };
  folds: Array<{
    id: string;
    button: HTMLButtonElement | HTMLElement;
    content: HTMLElement;
    number: number;
    expanded: boolean;
    focused: boolean;
    disabled: boolean;
    focus: () => void;
    grow: () => void;
    blur: () => void;
    enable: () => void;
    disable: () => void;
    toggle: () => void;
    open: (index?: number) => void;
    close: (index?: number) => void;
    destroy: (remove?: boolean) => void;
  }>;
}
```

# Events

Events will be dispatched at different points of an expand and collapse. The toggled fold is passed in the listeners arguments and you can access the accordions instance via the `this` context of the event callbacks.

```js
import accordion from 'relapse';

// Accordion Instance
//
const event = relapse('#accordion');

// toggle button has been focused.
event.on('focus', function (this: IAccordion, fold?: IFold) {});

// toggle button has been clicked
event.on('toggle', function (this: IAccordion, fold?: IFold) {});

// fold has been opened
event.on('expand', function (this: IAccordion, fold?: IFold) {});

// fold has been closed
event.on('collapse', function (this: IAccordion, fold?: IFold) {});

// accordion has been destroyed.
event.on('destroy', function (this: IAccordion) {});
```

# Methods

In addition to the events, Relapse instances also expose some basic methods:

```typescript
import relapse from 'relapse';

const accordion = relapse('.selector');

// Expands a fold
accordion.expand(fold: number | string);

// Collapse a fold
accordion.collapse(fold: number | string);

// Recalculate an already expanded folds height
accordion.grow(fold: number | string);

// Destroy
accordion.destroy();
```

### Folds

Each fold is provided additional methods for interfacing. Access folds using a zero based index reference.

```js
import relapse from 'relapse';

const accordion = relapse('.selector');

accordion.folds[0].open(index?: number);

accordion.folds[0].close(index?: number);

accordion.folds[0].grow();

accordion.folds[0].blur();

accordion.folds[0].focus();

accordion.folds[0].toggle();

accordion.folds[0].enable();

accordion.folds[0].disable();

accordion.folds[0].destroy();
```
