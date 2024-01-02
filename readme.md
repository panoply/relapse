# Relapse

An [A11y](https://www.a11yproject.com/) compliant, lightweight (2.7kb gzip) dependency free toggle utility for collapsible accordions. Written in TypeScript and distributed in ES6 this tiny little module flaunts an extensive API for usage in modern web projects,

Visit Documentation: https://panoply.github.io/relapse

### Key Features

- Supports both semantic and sibling markup structures
- Silky smooth transitions leveraging [WAAPI](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- Drop-in solution with no complexities, just initialize!
- A11y compliant (accessibility support) baked into the core.
- Functional and pure, no classes or prototype bullshit.
- Event dispatching with global context access and persisted instances

### Installation

The module is shipped for ESM consumption in the Browser.

```bash
pnpm add relapse
```

# Usage

Relapse requires initialization to function. The selector and option parameters are completely optional.

<!-- prettier-ignore -->
```js
import relapse from 'relapse';

const toggle = relapse('.selector', {
  persist: false,            // Whether or not a fold should always be expanded
  multiple: false,           // Whether or not multiple folds can be expanded
  unique: false,             // Whether or not instance is unique
  schema: 'data-relapse',    // Custom data attribute reference
  fold: {
    easing: 'ease-in-out',   // The animation easing to apply
    duration: 120,           // Duration of the fold content transition
  },
  fade: {
    duration: 120,           // Duration of the fold content transition
    transition: 'linear',    // The easing effect to apply when fading content
  },
  classes: {
    opened: 'opened',        // The class to use for opened button
    expanded: 'expanded',    // The class to use on expanded fold
    disabled: 'disabled'     // The class to use for disabled fold
  }
});
```
