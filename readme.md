# Relapse

An [A11y](https://www.a11yproject.com/) compliant, lightweight (1.8kb gzip) and dependency free toggle library for collapsible accordions. Written in TypeScript and distributed in ES6 this tiny little module flaunts an extensive API.

### Key Features

- Minimal markup (2 element node tree).
- Silky smooth transitions.
- Accessibility support
- Functional and pure, no classes or prototype.
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

relapse('#accordion', {
  persist: true,
  multiple: false,
  schema: 'data-accordion'
  classes: {
    initial: 'initial',
    opened: 'opened',
    focused: 'focused',
    expanded: 'expanded',
    disabled: 'disabled'
  }
});
```

### Markup

The node tree is minimal and markup must adhere (use) the below structure. By default, no padding or margin is applied to the fold elements, you should avoid applying

<!-- prettier-ignore -->
```html
<div class="relapse">

  <!-- PANEL 1 -->

  <button type="button" class="relapse-btn">Opens Fold #</button>
  <div class="relapse-fold">
    This is Fold #1
  </div>

  <!-- PANEL 2 -->

  <a href=".." type="button" class="relapse-btn">Opens Fold #2</a>
  <div class="relapse-fold">
    This is Fold #1
  </div>

  <!-- PANEL 3 -->

  <button type="button" class="relapse-btn">Opens Fold #3</button>
  <div class="relapse-fold">
    This is Fold #1
  </div>

</div>
```

# Styling

The module requires some basic stylings. Simplest is CSS defaults, but for the adults there is a SASS version. The defaults apply styles according to hierarch and structure. Everything nested within an element using the class `accordion` will be styled without having to apply class names.

### Class Names

Relapse uses 4 specific class names on folds which can be used to infer the current state a fold exists. You can use these classes to add things like opened/closed icons and background colors.

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

### SASS

Import the base styles and use the SCSS variables to customize the look and feel of the accordion.

<!-- prettier-ignore -->
```scss
@import "relapse";
```

<details>
<summary>
Variables
</summary>

<!-- prettier-ignore -->
```scss
$relapse-border-width: 1px !default;
$relapse-border-color: #e5e5e5 !default;
$relapse-padding: 50px !default;
$relapse-transition-height: 225ms !default;
$relapse-transition-opacity: 200ms !default;
$relapse-transition-timing: ease-in-out !default;
```

</details>

<details>
<summary>
Stylesheet
</summary>

<!-- prettier-ignore -->
```scss
/* -------------------------------------------- */
/* RELAPSE                                      */
/* -------------------------------------------- */

$relapse-border-width: 1px !default;
$relapse-border-color: #e5e5e5 !default;
$relapse-padding: 50px !default;
$relapse-transition-height: 225ms !default;
$relapse-transition-opacity: 200ms !default;
$relapse-transition-timing: ease-in-out !default;

.relapse {
  position: relative;
  display: block;
  width: 100%;
  border: $relapse-border-width solid $relapse-border-color;
  border-top: none;


  &-fold {
    max-height: 0;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
    opacity: 0;
    -webkit-transition: opacity $relapse-transition-opacity linear,
      max-height $relapse-transition-height $relapse-transition-timing;
    transition: opacity $relapse-transition-opacity linear,
      max-height $relapse-transition-height $relapse-transition-timing;
    will-change: opacity, max-height;

    @media (prefers-reduced-motion: reduce) {
      -webkit-transition: none;
      transition: none;
    }

    > :first-child {
      padding: $relapse-padding;
    }

    &.expanded {
      max-height: auto;
      visibility: visible;
      opacity: 1;
    }
  }

  &-btn {
    display: inherit;
    width: 100%;
    margin: 0;
    padding: inherit;
    color: inherit;
    font-size: inherit;
    text-align: left;
    background-color: inherit;
    border: none;
    border-top: $relapse-border-width solid $relapse-border-color;
    border-radius: 0;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &.initial {
      color: inherit;
      background-color: inherit;

      + .relapse-fold {
        max-height: unset;
        visibility: visible;
        opacity: 1;
      }
    }

    &.opened {
      color: inherit;
      background-color: inherit;
    }

    &.focused {
      background-color: inherit;
      outline: none;
    }
  }
}
```

</details>

# Options

The accordion provides the following options.

### `persist`

Persist will persist a fold to be expanded at all times.

**Default:** `true`

### `multiple`

Multiple allows for multiple folds to be opened.

**Default:** `false`

### `schema`

Customize the attribute annotation data attribute.

**Default:** `data-accordion`

### `classes`

Customize the class names that relapse applies

**Default:** `data-accordion`

# Option Attributes

You may also prefer to pass options via data attributes on the element.

- data-accordion-persist
- data-accordion-multiple

# Instance

Relapse will maintain active instances in global scope. Each accordion is accessible via `window.relapse` which uses a `Map` store who's keys will reference the element `id` (when no `id` is defined one is generated).

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

Events will be dispatched at different points of a collapse. The toggled fold is passed in the listeners arguments and you can access the accordions instance via the `this` context.

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

```typescript
import relapse from 'relapse';

const accordion = relapse('#accordion');

accordion.expand(fold: number | string);

accordion.collapse(fold: number | string);

accordion.destroy();
```

### Folds

```js
import relapse from 'relapse';

const accordion = relapse('#accordion');

accordion.folds[0].open(index?: number);

accordion.folds[0].close(index?: number);

accordion.folds[0].blur();

accordion.folds[0].focus();

accordion.folds[0].toggle();

accordion.folds[0].enable();

accordion.folds[0].disable();

accordion.folds[0].destroy();
```

# Changelog

Refer to the [Changelog](changelog.md) for each per-version update and/or fixes.
