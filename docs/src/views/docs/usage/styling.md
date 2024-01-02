---
title: 'Relapse | Styling'
layout: base
permalink: '/usage/styling.html'
prev:
  label: 'Markup / HTML'
  uri: '/usage/markup'
next:
  label: 'Classes'
  uri: '/usage/styling/classes'
---

# Styling

While Relapse doesn't impose any specific CSS requirements out of the box, it's strongly recommended to apply styling for a more refined appearance. This page provides a foundational starting point, demonstrating how you might approach styling your collapsible components using CSS. Additionally, basic resets are included to ensure a clean slate for styling.

##### Semantic Unstyled

The below example showcases Relapse initialized on a semantic structure with no styling applied.

{% render 'styling/unstyled-semantic' %}

##### Sibling Unstyled

The below example showcases Relapse initialized on a **sibling** structure with no styling applied.

{% render 'styling/unstyled-sibling' %}

<br>

By design, Relapse refrains from styling any elements. Its primary role is to facilitate smooth transitions during the expansion and collapse of folds. Leveraging `requestAnimationFrame` in conjunction with the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) (WAAPI), Relapse applies animations using JavaScript, granting you control over the visual aspects.

---

## Base

First thing we want to do is provide some basic styling foundations for our collapsible component. The applied classes will be different between the **semantic** and **sibling** structures. The **sibling** structure will require additional styling compared to the **semantic** structure because we are working against the browser defaults.

::: tabs markup

{% render 'styling/example-semantic', type: 'base' %}

```css
.relapse {
  font-family: system-ui;
  font-size: 15px;
  display: block;
  position: relative;
  border: 1px solid black;
}
.relapse > details > summary {
  padding: 5px 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #f8f8f8;
}
.relapse > details > summary + * {
  padding: 10px;
  background-color: ivory;
}
```

:::
::: tabs sibling

{% render 'styling/example-sibling', type: 'base' %}

```css
.relapse {
  font-family: system-ui;
  font-size: 15px;
  display: block;
  position: relative;
  border: 1px solid black;
}
.relapse > .relapse-button {
  border: none;
  width: 100%;
  padding: 5px 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #f8f8f8;
}
/* Ensure the sibling element of <button> applies no padding or margin */
.relapse > .relapse-button + .relapse-fold {
  padding: 0;
  margin: 0;
}
/* The child node of the fold can apply padding */
.relapse > .relapse-button + .relapse-fold > * {
  padding: 10px;
  background-color: #f8f8f8;
}
```

:::

---

## Borders

Our collapsible looks a little better, but how about we add in some borders. You will notice that we've include a `last-of-type` reference, this is to ensure that we don't have double borders applied on the the very last button.

::: tabs markup

{% render 'styling/example-semantic', type: 'borders' %}

```css
/* The last-of-type pseudo class ensures the last <summary> button excludes bottom border. */
.relapse > details:last-of-type > summary {
  border-bottom: none;
}
.relapse > details > summary {
  border-bottom: 1px solid black;
}
```

:::
::: tabs sibling

{% render 'styling/example-sibling', type: 'borders' %}

```css
/* The last-of-type pseudo class ensures the last <button> in group excludes bottom border. */
.relapse > .relapse-button:last-of-type {
  border-bottom: none;
}
.relapse > .relapse-button {
  border-bottom: 1px solid black;
}
```

:::

---

## Icon

By default, semantic structures render a disclosure triangle in the shadow DOM slot and this can sometimes be undesirable. The triangle itself can be customized, although this is not as broadly supported. We will hide and replace the disclosure triangle in our **semantic** structure. In our **sibling** structure, we will simply just replicate the styling.

::: tabs markup

{% render 'styling/example-semantic', type: 'icon' %}

<!--prettier-ignore-->
```css
.relapse > details > summary {
  padding: 5px 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  /* Specific reset for Chrome / Firefox */
  list-style: none;

}
/* Specific reset for Safari WebKit */
.relapse > details > summary::-webkit-details-marker {
  display: none;
}
/* Collapsed state, i.e: the fold is closed */
.relapse > details > summary::after {
  content: '+';
}
/* Expanded state, i.e: the fold is opened */
.relapse > details[open] > summary::after {
  content: '–';
}
````

:::
::: tabs sibling

{% render 'styling/example-sibling', type: 'icon' %}

```css
/* Expanded and Collapsed States */
.relapse > .relapse-button {
  content: '+';
}
/* When the button aria label changes to expanded, icon will toggle */
.relapse > .relapse-button[aria-expanded='true']::after {
  content: '–';
}
```

:::

---

## Enhancements

Let's now add some minor UX enhancements to our collapsible component. We will add in `hover` effects for button toggles and apply a small hover transition for the sake of aesthetics.

::: tabs markup

{% render 'styling/example-semantic', type: 'hover' %}

<!--prettier-ignore-->
```css
/* We will add a small transition for UX */
.relapse > details > summary {
  transition: background 200ms linear;
}
/* We enable hover only when fold is collapsed (closed) not when it is expanded */
.relapse > details:not([open]) > summary:hover {
  background: gainsboro;
}

````

:::
::: tabs sibling

{% render 'styling/example-sibling', type: 'hover' %}

```css
/* We will add a small transition for UX */
.relapse > .relapse-button {
  transition: background 200ms linear;
}

/* We enable hover only when fold is collapsed (closed) not when it is expanded */
.relapse > .relapse-button[aria-expanded='false']:hover {
  background-color: gainsboro;
}
```

:::

---

## Final Result

Below is the final result for our custom CSS styling. Next up, have a look at the [classes](/relapse/usage/styling/classes) section to see how we can leverage the Relapse's dynamically inserted class names.

::: tabs markup

```css
.relapse {
  font-family: system-ui;
  font-size: 15px;
  display: block;
  position: relative;
  border: 1px solid black;
}
.relapse > details > summary {
  padding: 5px 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #f8f8f8;
  border-bottom: 1px solid black;
  list-style: none;
  transition: background 200ms linear;
}
.relapse > details:not([open]) > summary:hover {
  background: gainsboro;
}
.relapse > details:last-of-type > summary {
  border-bottom: none;
}
.relapse > details > summary::-webkit-details-marker {
  display: none;
}
.relapse > details > summary::after {
  content: '+';
}
.relapse > details[open] > summary::after {
  content: '–';
}
.relapse > details > summary + * {
  padding: 10px;
  background-color: ivory;
}
```

:::
::: tabs sibling

```css
.relapse {
  font-family: system-ui;
  font-size: 15px;
  display: block;
  position: relative;
  border: 1px solid black;
}
.relapse > .relapse-button {
  width: 100%;
  padding: 5px 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #f8f8f8;
  transition: background 200ms linear;
  border: none;
  border-bottom: 1px solid black;
  content: '+';
}
.relapse > .relapse-button:last-of-type {
  border-bottom: none;
}
.relapse > .relapse-button[aria-expanded='true']::after {
  content: '–';
}
.relapse > .relapse-button[aria-expanded='false']:hover {
  background-color: gainsboro;
}
.relapse > .relapse-button + .relapse-fold {
  padding: 0;
  margin: 0;
}
.relapse > .relapse-button + .relapse-fold > * {
  padding: 10px;
  background-color: #f8f8f8;
}
```

:::

---

##### Next Steps?

Take a look at the [classes](/relapse/usage/styling/classes) section for additional context and understanding of the dynamic classes Relapse applied and then checkout the [states](/relapse/usage/styling/states) portion of the documentation.
