# Relapse

An [A11y](https://www.a11yproject.com/) compliant, lightweight (2.1kb gzip) and dependency free toggle library for collapsible accordions. Written in TypeScript and distributed in ES6 this tiny little module flaunts an extensive API, uses [rAF](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) powered transitions and requires minimal markup.

### Example

TODO

### Key Features

- Minimal markup (2 element node tree).
- Silky smooth rAF powered transitions.
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
  transition: 300,
  fade: true,
  persist: true,
  multiple: false,
  schema: 'data-accordion'
  classes: {
    opened: 'opened',
    focused: 'focused',
    expanded: 'expanded',
    disabled: 'disabled'
  }
});
```

### Markup

The node tree is minimal and markup must adhere (use) the below structure. Accordion toggles can either be a `<button>` or `<a>` element, however the accordion collapsible (fold) cannot be a `<button>` or `<a>` element.

<!-- prettier-ignore -->
```html
<div class="accordion">

  <!-- PANEL 1 -->

  <button type="button">Opens Fold #</button>
  <div>
    This is Fold #1
  </div>

  <!-- PANEL 2 -->

  <a href="..">Opens Fold #2</a>
  <nav>
    <ul>
      <li>This is Fold #3</li>
    </ul>
  </nav>

  <!-- PANEL 3 -->

  <button type="button">Opens Fold #3</button>
  <p>
    This is Fold #3
  </p>

</div>
```

# Styling

The module requires some basic stylings. Simplest is CSS defaults, but for the adults there is a SASS version. The defaults apply styles according to hierarch and structure. Everything nested within an element using the class `accordion` will be styled without having to apply class names.

### Class Names

Relapse uses 4 specific class names on folds which can be used to infer the current state a fold exists. You can use these classes to add things like opened/closed icons and background colors.

### `opened`

Applied to the toggle button element when a fold is expanded.

### `focused`

Applied to the toggle button element when it has been focused

### `expanded`

Applied to the fold element when it is expanded

### `disabled`

Applied to the toggle button element when it is disabled.

### SASS

This is a bare minimum starting point the styling the accordion.

<!-- prettier-ignore -->
```scss
$accordion-border-width: 1px !default;
$accordion-border-color: #e5e5e5 !default;
$accordion-expanded-color: #03b5d2 !default;
$accordion-disabled-opacity: 0.5 !default;


.accordion {
  position: relative;
  border: 1px solid $accordion-border-color;

  section {
    height: 0;
    overflow: hidden;
    opacity: 0;
    will-change: opacity, height;
  }

  button {
    position: relative;
    display: block;
    width: 100%;
    padding: 25px;
    text-align: left;
    background: none;
    border: none;
    border-bottom: $accordion-border-width solid $accordion-border-color;
    outline: none;


    &[aria-expanded="false"][aria-disable="true"],
    &[aria-expanded="false"].disabled {
      opacity: $accordion-disabled-opacity;

      &:focus {
        color: inherit;
        cursor: default;
      }
    }

    &[aria-expanded="true"] {
      color: $accordion-expanded-color;
    }

    &:hover,
    &:focus {
      color: $accordion-expanded-color;
      cursor: pointer;
    }
  }
}
```

# Options

The accordion provides the following options.

### `persist`

Persist will persist a fold to be expanded at all times.

**Default:** `true`

### `multiple`

Multiple allows for multiple folds to be opened.

**Default:** `false`

### `transition`

The rAF transition (ms) for the collapse and expand animations

**Default:** `300`

### `fade`

Whether or not the fold content should gently fade in and fade out between expands/collapse

**Default:** `true`

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
- data-accordion-transition
- data-accordion-fade

Buttons and folds also accept the following attribute options to be annotated on an individual basis.

- data-accordion-transition
- data-accordion-fade

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
  collapsing: boolean;
  events: {
    [name: string]: Array<(this: Accordion, fold?: Fold) => void>
  };
  config: {
    duration: number;
    persist: boolean;
    multiple: boolean;
    preserve: boolean;
    keyboard: boolean;
    fade: boolean;
    classes: {
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
    transition: number;
    fade: boolean;
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
