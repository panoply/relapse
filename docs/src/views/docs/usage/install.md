---
title: 'Relapse | Installation'
layout: base
permalink: '/usage/install.html'
prev:
  label: 'Introduction'
  uri: '/'
next:
  label: 'Markup / HTML'
  uri: '/usage/markup'
---

## Installation

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

Relapse is designed to be utilized in modern browsers and is exported as an **ESM** [ECMAScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) module. The underlying architecture leverages the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) (WAAPI) for smooth animation effects. As of the time of writing this documentation, Relapse has global browser support of approximately **95%**.

<br>

## Legacy Support

For developers working with older browsers that do not support ES6 or lack compatibility with the Web Animations API, Relapse recommends the use of a [Polyfill](https://github.com/web-animations/web-animations-js). This additional script ensures compatibility and allows the extension of Relapse's functionality to legacy environments.

By incorporating this Polyfill, developers can extend Relapse's capabilities to a broader range of browsers, maintaining a consistent user experience across various platforms.
