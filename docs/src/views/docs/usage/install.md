---
title: 'Relapse | Installation'
layout: base
permalink: '/usage/install.html'
prev:
  label: 'Intro'
  uri: '/'
next:
  label: 'Markup'
  uri: '/usage/markup'
---

## Install

Relapse is a straightforward module that only asks for adherence to its markup structures. It's not overly complex, so there's no need to over-complicate things. The project is accessible through the NPM registry, allowing you to install the module in your project using your preferred package manager. Alternatively, you can add it via CDN for added convenience.

###### PNPM

```bash
$ pnpm add relapse
```

<br>

###### NPM

```bash
$ npm install relapse
```

<br>

###### YARN

```bash
$ yarn add relapse
```

<br>

###### CDN

```bash
https://unpkg.com/relapse
```

---

## Browser Support

Relapse is designed to be utilized in modern browsers and is exported as an **ESM** [ECMAScript Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). The underlying architecture leverages the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) (WAAPI) and at of the time of writing this documentation, Relapse has **95% global** browser support.

<br>

## Legacy Support

For developers working with older browsers that do not support ES6 or lack compatibility with the Web Animations API, Relapse recommends the use of a [Polyfill](https://github.com/web-animations/web-animations-js). This additional script ensures compatibility and allows the module to function in legacy environments.
