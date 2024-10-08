---
title: 'Relapse | Instances'
layout: base
permalink: '/api/instance.html'
prev:
  label: 'Styling'
  uri: '/usage/styling'
next:
  label: 'Options'
  uri: '/api/options'
---

# Instance

Relapse **requires** initialization to function, meaning you need to call `relapse()`. While configuration is optional, you have the flexibility to control settings through data-attribute annotation (see [options](/relapse/api/options#attributes)). All instances are diligently tracked by Relapse in a global data structure, that is made accessible via a `window.relapse` getter.

When initializing Relapse, the nature of the resulting instance is determined by the parameters provided. Specifically, the instance type which will be either an array of `Relapse[]` instances or a singular `Relapse` instance. This distinction is based on the nature of the parameter argument/s, more on this below.

---

## Single Instance

To initialize and return a singular instance, simply pass an `HTMLElement` selector to the `relapse` function as the first parameter argument. You can provide either a `string` selector or an actual element. When passing a selector, Relapse will return a **single** instance.

Each **single** instance is integrated into the global store and can be accessed anywhere in your web application via the `relapse.get('id')` method, but only after initialization. This is a streamlined process and ensures that the instance can be readily accessible for future interactions and management within the broader context of your web application.

> All the below examples will return a single instance of `Relapse` that be interfaced and controlled directly.

##### Option 1

Passing a selector and use default options:

```js
import relapse from 'relapse';

const toggle = relapse('.selector'); // => Relapse
```

<br>

##### Option 2

Passing a element and use default options:

```js
import relapse from 'relapse';

const element = document.querySelector('#xxx');
const toggle = relapse(element); // => Relapse
```

<br>

##### Option 3

Passing a selector with options:

```js
import relapse from 'relapse';

const toggle = relapse('.selector', {
  schema: 'data-relapse',
  persist: false,
  multiple: false,
  unique: true,
  fold: {
    duration: 220,
    easing: 'ease-in-out',
  },
  fade: {
    duration: 120,
    transition: 'linear',
  }
  classes: {
    opened: 'opened',
    expanded: 'expanded',
    disabled: 'disabled'
  }
});
```

---

## Multiple Instances

When dealing with multiple instances of Relapse within the DOM, a convenient approach is to leverage data attribute annotation for initialization. This method, is the **default** behavior of the module whenever the selector parameter is omitted. Attribute driven initialization is determined by the omission of a `selector` (or `HTMLElement`) argument.

Simply put, elements containing a `data-relapse` attribute or an attribute that matches the specified `schema` option will be automatically initialized upon detection in the DOM. To achieve this, you can call `relapse()` without any parameters or provide an options object of configuration settings. In scenarios where no selector argument is passed as per the above **single instance** example, invoking `relapse()` results in the return of an array list comprising multiple Relapse instances.

##### Option 1

Initialize on all elements using `data-relapse` attribute. This is the **default** behavior.

```js
import relapse from 'relapse';

const toggle = relapse(); // => Relapse[]
```

<br>

##### Option 2

Initialize on all elements using a custom attribute of `data-foo` instead of using `data-relapse` default.

```js
import relapse from 'relapse';

const toggle = relapse({ schema: 'data-foo' }); // => Relapse[]
```

<br>

##### Option 3

Initialize on all elements using using `data-relapse` and also provide options for the instance.

```js
import relapse from 'relapse';

const toggle = relapse({
  schema: 'data-relapse',
  persist: false,
  multiple: false,
  unique: true,
  fold: {
    duration: 220,
    easing: 'ease-in-out',
  },
  fade: {
    duration: 120,
    transition: 'linear',
  }
  classes: {
    opened: 'opened',
    expanded: 'expanded',
    disabled: 'disabled'
  }
}); // => Relapse[]
```

---

## Global Store

As aforementioned, Relapse maintains a store reference for all its instances within a global data structure, accessible through the `window.relapse` getter. This global store exposes access to any or all instances of Relapse in the DOM from any part of your web application.

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

---

## Global Methods

The default `relapse` export provides a couple of methods that you can interface with. Typically, you'll use relapse on a per-element basis, but in cases where you need to query the global store, you can reach for the global methods.

<br>

<!--prettier-ignore-->
```js
import relapse from 'relapse';

relapse.get();                     // Returns all instances
relapse.get('foo');                // Returns instance using id of foo
relapse.get(['foo', 'bar'])        // Returns instances using ids foo and bar

relapse.has();                     // Whether or not instances exist
relapse.has('foo');                // Whether or not instance of foo exists
relapse.has(['foo', 'bar'])        // Whether or not instances foo and bar exist

relapse.destroy();                 // Teardown and destroy all instances
relapse.destroy('foo');            // Teardown and destroy the foo instance
relapse.destroy(['foo', 'bar'])    // Teardown and destroy foo and bar instances

relapse.reinit();                   // Reinitialize all instances
relapse.reinit('foo');              // Reinitialize instance using id of foo
relapse.reinit(['foo', 'bar'])      // Reinitialize instances using ids foo and bar

relapse.each(instance => {})       // Iterate through all instances, return false the break

```

---

## Instance Object

The returning `Relapse` instance is comprised of references, events and methods that you can reach for when additional control is required. The instance lifespan is persisted and updates are reflective where necessary.

<br>

<!--prettier-ignore-->
```js
import relapse from 'relapse';

const instance = relapse('#example');

// REFERENCES

instance.id                                   // The relapse key identifier
instance.element                              // Selector HTMLElement
instance.semantic                             // Whether or not semantic
instance.active                               // Last active fold index
instance.opened                               // Number of opened folds
instance.folds                                // An array list of folds
instance.options                              // Returns the current options

// EVENTS

instance.events.toggle                        // List of toggle events
instance.events.expand                        // List of expand events
instance.events.collapse                      // List of collapse events
instance.events.focus                         // List of focus events
instance.events.destroy                       // List of destroy events

instance.event.on('focus', (fold) => {})      // Listen for focus button events
instance.event.on('toggle', (fold) => {})     // Listen for open/close events
instance.event.on('expand', (fold) => {})     // Listen for expanded events
instance.event.on('collapse', (fold) => {})   // Listen for collapsed events
instance.event.on('destroy', (fold) => {})    // Listen for destroy events

// METHODS

instance.config()                            // Update the options of the instance
instance.expand()                            // Expand a fold by index or id
instance.collapse()                          // Collapse a fold by index or id
instance.destroy()                           // Destroy a the relapse instance
instance.reinit()                            // Reinitialize the instance

```
