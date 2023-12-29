---
title: 'Relapse | Events'
layout: base
permalink: '/api/events.html'
prev:
  label: 'Folds'
  uri: '/api/folds'
next:
  label: 'Semantic Example'
  uri: '/examples/semantic'
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
