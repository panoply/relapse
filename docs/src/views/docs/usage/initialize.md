---
title: 'Relapse | Initialize'
layout: base
permalink: '/usage/initialize.html'
prev:
  label: 'Styling / CSS'
  uri: '/usage/styling'
next:
  label: 'Instance'
  uri: '/api/instance'
---

# Initialize

Relapse **requires** initialization to function, meaning you need to call `relapse()`. While configuration is optional, you have the flexibility to control settings through data-attribute annotation. All instances are diligently tracked by Relapse in a global `Map` data structure, that is made accessible via a `window.relapse` getter. When initializing Relapse, the nature of the resulting instance is determined by the parameters provided. Specifically, the instance type will be either an array of `Relapse[]` instances or a singular `Relapse` instance. This distinction is based on the nature of the parameter argument.

##### TIP

Consider adopting the practice of assigning a `value` to the `data-relapse` attribute (or using an `id`) (e.g: `data-relapse="some-id"`) to your Relapse elements during initialization. This recommendation serves a dual purpose: not only does it enhance the accessibility of instances post-initialization, but it also employs the `id` value as the identifier within the global `Map` store. By incorporating this suggested approach, you ensure a straightforward means of accessing and managing specific instances through a clearly defined and globally recognized identifier in the `window.relapse` Map store.

---

## Single Instance

To initialize and return a singular instance, simply pass an `HTMLElement` selector to the `relapse` function as the first parameter. You can provide either a `string` selector or an actual element. When passing a selector, Relapse will return a single instance. Each instance is integrated into the global store through the `window.relapse` Map reference. This is a streamlined process and ensures that the instance can be readily accessible for future interactions and management within the broader context of your web application.

```js
import relapse from 'relapse';

// OPTION 1 - Passing a selector and use default options
relapse('.selector');

// OPTION 2 - Passing a element and use default options
relapse(document.querySelector('.element'));

// OPTION 3 - Passing a selector with options
relapse('.selector', {
  schema: 'data-relapse',
  persist: false,
  multiple: false,
  folding: {
    duration: 220,
    easing: 'ease-in-out',
    hint: true
  },
  fading: {
    duration: 120,
    transition: 'linear',
    hint: true
  }
  classes: {
    opened: 'opened',
    focused: 'focused',
    expanded: 'expanded',
    disabled: 'disabled'
  }
});
```

All the above examples will return a single instance of `Relapse` (see [Instance](/api/instance)).

---

## Multiple Instances

When dealing with multiple instances of Relapse within the DOM, a convenient approach is to leverage data attribute annotation for initialization. This method, which is the **default** behavior whenever the selector parameter is omitted. Attribute driven allows for seamless detection and initialization of elements.

Simply put, elements containing a `data-relapse` attribute or an attribute that matches the specified `schema` option will be automatically initialized upon detection in the DOM. To achieve this, you can call `relapse()` without any parameters or provide an options object. In scenarios where no selector argument is passed, invoking `relapse()` results in the return of an array list comprising multiple Relapse instances or a single instance if only 1 occurrence is detected.

```js
import relapse from 'relapse';

// OPTION 1 - Initialize on all elements using data-relapse attribute
relapse();

// OPTION 2 - Initialize on all element using data-toggle attribute
relapse({ schema: 'data-toggle' });

// OPTION 3 - Initialize on all elements using data-relapse with options
relapse({
  schema: 'data-relapse',
  persist: false,
  multiple: false,
  folding: {
    duration: 220,
    easing: 'ease-in-out',
    hint: true
  },
  fading: {
    duration: 120,
    transition: 'linear',
    hint: true
  }
  classes: {
    opened: 'opened',
    focused: 'focused',
    expanded: 'expanded',
    disabled: 'disabled'
  }
});
```

---

## Global Store

As aforementioned, Relapse maintains a store reference for all its instances within a globally accessible `Map` data structure, accessible through the `window.relapse` getter. This global store exposes access any or all instances of Relapse in the DOM from any part of your web application.

For instance, let's consider three distinct Relapse occurrences in your web page, identified as `foo`, `bar`, and `baz`. To initialize them succinctly, you can employ the following code snippet in your bundle:

```js
import relapse from 'relapse';

relapse(); // Initialize on all elements using the data-relapse attribute
```

<br>

Subsequently, Relapse makes each instance globally available, allowing you to access them seamlessly:

```js
window.relapse.get('foo'); // => Relapse
window.relapse.get('bar'); // => Relapse
window.relapse.get('baz'); // => Relapse
```

<br>

Alternatively, you can utilize the default import method for a more concise syntax:

```js
import relapse from 'relapse';

relapse.get('foo'); // => Relapse
relapse.get('bar'); // => Relapse
relapse.get('baz'); // => Relapse
```
