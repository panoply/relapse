# Relapse | rĭ-lăps′

## NOT STABLE YET

An [A11y](https://www.a11yproject.com/) compliant, lightweight (1.7kb gzip) and dependency free toggle library for collapsible accordions. Written in TypeScript and distributed in ES6 this tiny little module flaunts an extensive API, uses [rAF](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) powered transitions and requires minimal markup.

### Example

TODO

### Key Features

- Minimal markup (2 element node tree).
- Silky smooth rAF powered transitions.
- Accessibility support, Aria + Keyboard.
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
  duration: 175,
  fade: true,
  persist: true,
  multiple: false,
  preserve: false,
  keyboard: true
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

### SASS

<!-- prettier-ignore -->
```scss
$lightgray: lightgray;
$pink: hotpink;

.accordion {
  position: relative;
  border: 1px solid $lightgray;

  button {
    position: relative;
    display: block;
    width: 100%;
    padding: 1em 0;
    color: $text;
    font-weight: 400;
    font-size: 1.15rem;
    text-align: left;
    background: none;
    border: none;
    border-bottom: 1px solid $lightgray;
    outline: none;

    &[aria-expanded="true"] {
      color: $pink;
      border-bottom: 1px solid $pink;
    }


    &:hover,
    &:focus {
      color: $pink;
      cursor: pointer;
    }
  }


  .accordion-content {
    height: 0;
    overflow: hidden;
    opacity: 0;
    will-change: opacity, height;
  }
}

```

### CSS

```css

```

# Options

### `collapse`

### `toggled`

### `persist`

### `preserve`

### `keyboard`

### `duration`

# Instance

Relapse will maintain active instances in global scope. Each accordion is accessible via `window.relapse` which uses a `Map` store, who's keys will reference the element `id` or when no `id` is defined one is generated.

```ts
interface Accordion {
  on: (event: string, callback: (this: Accordion, fold?: IFold) => void) => void;
  off: (event: string, callback: Function) => void);
  expand: (fold: number | string) => void);
  collapse: (fold: number | string) => void);
  destroy: () => void;
  id: string;
  element: Element;
  active: number;
  collapsing: boolean;
  events: { [name: string]: Array<(fold?: Fold) => void> };
  config: {
    persist: boolean;
    multiple: boolean;
    preserve: boolean;
    keyboard: boolean;
    duration: number;
    fade: boolean;
  };
  folds: Array<{
    id: string;
    button: HTMLElement;
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
