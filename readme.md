# @panoply/accordion

A lightweight (1.6kb gzip) [a11y](https://www.a11yproject.com/) accordion. Written in TypeScript and distributed in ES6, this silky smooth collapsible component is dependency free, vanilla and flaunts an extensive API.

### Example

Visit the docs and example: **[https://panoply.github.io/accordion](https://panoply.github.io/accordion)**

### Key Features

- Minimal markup (2 element node tree).
- Accessibility support, Aria + Keyboard
- Event dispatching and global context
- Functional, no classes or prototype.

### Installation

The module is shipped for ESM consumption in the Browser.

```bash
pnpm add @panoply/accordion
```

# Usage

The module provides both named and default import options.

```js
import accordion from '@panoply/accordion';

accordion('#accordion', {
  persist: true,
  multiple: false,
  aria: true,
  keyboard: true,
  icons: {
    opened: '<path d="M9 18l6-6-6-6"/>',
    closed: '<path d="M6 9l6 6 6-6"/>',
    locked: null
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

### `aria`

### `icons`

# Instance

An accordion will return the below instance. Each accordion is accessible via `window.accordion` as a object list where the accordion `id` is used as property, when no `id` is defined on a accordion one is generated.

```ts
interface Accordion {
  on: (event: string, callback: (this: Accordion, fold?: IFold) => void) => void;
  off: (event: string, callback: Function) => void);
  focus: (target: 'prev' | 'next' | 'last' | 'first') => void;
  destroy: () => void;
  id: string;
  element: Element;
  events: { [name: string]: Function[] };
  config: {
    initial: number | string;
    persist: boolean;
    multiple: boolean;
    preserve: boolean;
    keyboard: boolean;
    aria: boolean;
    icons: {
      closed: string;
      opened: string;
      locked: string;
    }
  };
  folds: Array<{
    id: string;
    button: HTMLElement;
    content: HTMLElement;
    number: number;
    expanded: boolean;
    focused: boolean;
    disabled: boolean;
    enable: () => void;
    disable: () => void;
    focus: () => void;
    blur: () => void;
    toggle: (transition?: boolean) => void;
    open: (transition?: boolean) => void;
    close: (transition?: boolean) => void;
    destroy: () => void;
  }>;
}
```

# Events

Events will be dispatched at different points of a collapse. The toggled fold is passed in the listeners arguments and you can access the accordions instance via the `this` context.

```js
import accordion from '@panoply/accordion';

// Accordion Instance
//
const event = accordion('#accordion');

// fold is about to be opened.
event.on('open', function (this: IAccordion, fold?: IFold) {});

// fold has opened
event.on('opened', function (this: IAccordion, fold?: IFold) {});

// fold is about to close
event.on('close', function (this: IAccordion, fold?: IFold) {});

// fold has closed
event.on('closed', function (this: IAccordion, fold?: IFold) {});

// toggle button has been focused.
event.on('focus', function (this: IAccordion, fold?: IFold) {});

// toggle button has lost focus.
event.on('blur', function (this: IAccordion, fold?: IFold) {});

// accordion has been destroyed.
event.on('destroy', function (this: IAccordion) {});
```

# Methods

```typescript
import accordion from '@panoply/accordion';

const instance = accordion('#accordion');

instance.focus('next');

instance.destroy();
```

### Folds

```js
import accordion from '@panoply/accordion';

const instance = accordion('#accordion');

instance.folds[0].open((transition = true));

instance.folds[0].close((transition = true));

instance.folds[0].toggle((transition = true));

instance.folds[0].disable();

instance.folds[0].enable();

instance.folds[0].destroy();
```

# Changelog

Refer to the [Changelog](changelog.md) for each per-version update and/or fixes.
