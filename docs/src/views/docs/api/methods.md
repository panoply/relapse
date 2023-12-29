---
title: 'Relapse | Methods'
layout: base
permalink: '/api/methods.html'
prev:
  label: 'Options'
  uri: '/api/options'
next:
  label: 'Folds'
  uri: '/api/folds'
---

## Methods

A Relapse instances also expose some basic methods for programmatic control.

```typescript
import relapse from 'relapse';

const method = relapse('.selector');

// Expands a fold
method.expand(fold: number | string);

// Collapse a fold
method.collapse(fold: number | string);

// Destroy
method.destroy();
```
