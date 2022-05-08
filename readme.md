# Relapse | rĭ-lăps′

An [A11y](https://www.a11yproject.com/) compliant, lightweight (1.7kb gzip) and dependency free toggle library for collapsible accordions. Written in TypeScript and distributed in ES6 this tiny little module flaunts an extensive API, uses [rAF](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) powered transitions and requires minimal markup.

### Example

Visit the docs and example: **[https://panoply.github.io/accordion](https://panoply.github.io/accordion)**

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
// BASE STYLE
$accordion-bg-color:              #ffffff;
$accordion-border-color:          transparent;
$accordion-border-width:          1px;

// BUTTON STYLES
$accordion-btn-bg-color:          #000000;
$accordion-btn-bg-focus:          #999999;
$accordion-btn-font-color:        #000000;
$accordion-btn-border-color:      #ffffff;
$accordion-btn-disabled:          0.5;

// CONTENT STYLE
$accordion-fold-bg-color:         #ffffff;
$accordion-fold-font-color:       #000000;
$accordion-fold-border-color:     #ffffff;

// TRANSITION ANIMATION
$accordion-transition-animate:    linear;
$accordion-transition-height:     0.1s;
$accordion-transition-opacity:    0.3s;
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
  destroy: () => void;
  id: string;
  element: Element;
  focused: number;
  events: { [name: string]: Function[] };
  config: {
    persist: boolean;
    multiple: boolean;
    preserve: boolean;
    keyboard: boolean;
    duration: number;
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
    toggle: (index?: number) => void;
    open: (index?: number) => void;
    close: (index?: number) => void;
    destroy: () => void;
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

// fold is about to be opened.
event.on('open', function (this: IAccordion, fold?: IFold) {});

// fold is about to close
event.on('close', function (this: IAccordion, fold?: IFold) {});

// accordion has been destroyed.
event.on('destroy', function (this: IAccordion) {});
```

# Methods

```typescript
import relapse from 'relapse';

const accordion = relapse('#accordion');

accordion.focus('next');

accordion.destroy();
```

### Folds

```js
import relapse from 'relapse';

const accordion = relapse('#accordion');

accordion.folds[0].open(index?: number);

accordion.folds[0].close(index?: number);

accordion.folds[0].toggle();

accordion.folds[0].destroy();
```

# Changelog

Refer to the [Changelog](changelog.md) for each per-version update and/or fixes.
