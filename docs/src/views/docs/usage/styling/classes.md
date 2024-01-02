---
title: 'Relapse | Styling - Classes'
layout: base
permalink: '/usage/styling/classes.html'
prev:
  label: 'Styling'
  uri: '/usage/styling'
next:
  label: 'States'
  uri: '/usage/styling/states'
---

## Classes

Relapse automatically adds classes to folds in various states, providing a convenient way to customize their appearance. You have the flexibility to define and customize these class names through Relapse options (refer to [Options](/relapse/api/options)). Utilizing custom classes not only allows for tailored styling but can also serve as initial state hints, simplifying fold control through straightforward class name annotations.

> Before delving into this section, it's recommended to have a brief look at the [styling](/relapse/usage/styling) section for a foundational understanding of how styling is approached in Relapse. The code samples on this page are working with the collapsible component example from the [styling](/relapse/usage/styling) page.

---

## Opened

The `opened` class is automatically added to **buttons** within collapsible groups that are in an **expanded** state (i.e: **opened**). In **semantic** structures, the toggle button corresponds to the `<summary>` tag, while in **sibling** structures, the button can be any HTML tag adhering to the specified [markup structures](/relapse/usage/markup).

::: tabs markup

{% render 'styling/example-semantic', type: 'opened' %}

<!--prettier-ignore-->
```css
.relapse > details > summary.opened {
  border-color: transparent;
  background:#e9e9e9;
}
````

:::
::: tabs sibling

{% render 'styling/example-sibling', type: 'opened' %}

```css
/* We enable hover only when fold is collapsed (closed) not when it is expanded */
.relapse > .relapse-button.opened {
  border-color: transparent;
  background: #e9e9e9;
}
```

:::

<br>

##### Sibling Initializer

The `opened` class serves as both an annotation and an initializer in **sibling** structures. When **toggle** button element possess the `opened` class name, Relapse will render the associated fold in an expanded (active) state. This feature is specifically designed for **sibling** structures but in order for it to be taken advantage of we would also need set the correct CSS styling to apply.

```css
/* We enable hover only when fold is collapsed (closed) not when it is expanded */
.relapse > .relapse-button.opened {
  border-color: transparent;
  background: #e9e9e9;
}
```

---

## Expanded

The `expanded` class is automatically added to **folds** within collapsible groups that are in an **expanded** state (i.e: **opened**). In **semantic** structures, this class will added to element of the fold, which would be the last known child within a `<details>` group. In **sibling** structures, the class is applied to the sibling of **button** toggles, which will always be the odd indexed nodes in a group, see [markup structures](/relapse/usage/markup) for additional reference.

> The `expanded` class is not necessarily important and merely provided for convenience sake. Developers can style collapsible groups without needed to reference this dynamically inserted class name.

::: tabs markup

{% render 'styling/example-semantic', type: 'expanded' %}

<!--prettier-ignore-->
```css
/**
 * We will add a bottom border to expanded folds. Notice how we also
 * have asserted the :not(:last-of-type) pseudo property. This ensures
 * no double border is applied on last fold group.
 */
.relapse > details:not(:last-of-type) > summary + .expanded {
  border-bottom: 1px solid black;
}
````

:::
::: tabs sibling

{% render 'styling/example-sibling', type: 'expanded' %}

```css
/**
 * We will add a bottom border to expanded folds. Notice how we also
 * have asserted the :not(:last-of-type) pseudo property. This ensures
 * no double border is applied on last fold group.
 */
.relapse > .relapse-button + .relapse-fold:not(:last-of-type).expanded {
  border-bottom: 1px solid black;
}
```

:::

---

## Disabled

The `disabled` class serves as both an annotation and an initializer in both **sibling** and **semantic** structures. The class name will be used to signal that a fold should not be expanded or collapsed and will be applied to the toggle **buttons** of collapsible components.

When a collapsible components fold contains a `disabled` class the fold will be marked as `locked` which will result in neither expanding or collapsing. When a fold is initialized in an opened (expanded) state and included a `disabled` annotation then the fold will remain expanded.

::: tabs markup

{% render 'styling/example-semantic', type: 'disabled' %}

```css
.relapse > details > summary.disabled {
  opacity: 0.5;
  background-color: white;
  cursor: not-allowed;
}
```

:::
::: tabs sibling

{% render 'styling/example-sibling', type: 'disabled' %}

```css
.relapse > .relapse-button.disabled {
  opacity: 0.5;
  background-color: white;
  cursor: not-allowed;
}
```

:::

<br>

##### Initializer

The `disabled` class serves as both an annotation and an initializer for both **semantic** and **sibling** structures. In **semantic** structures, when the `<summary>` button contains the class `disabled` then fold will be initialized disabled. You may also annotate the details element`<details disabled>` to initialize locked. In **sibling** structures when the **toggle** button element possess the `disabled` class the fold will be initialized disabled.

::: tabs markup

```html
<div class="relapse" data-relapse="xxx">
  <details>
    <summary>Foo</summary>
    <div>This fold is not disabled</div>
  </details>
  <!-- This fold is disabled -->
  <details>
    <summary class="disabled">Bar</summary>
    <div>This fold is disabled</div>
  </details>
  <details>
    <summary>Baz</summary>
    <div>This fold is not disabled</div>
  </details>
  <!-- This fold is both expanded and disabled -->
  <details open>
    <summary class="disabled">Qux</summary>
    <div>This fold is not disabled</div>
  </details>
</div>
```

:::
::: tabs sibling

```html
<div class="relapse" data-relapse="xxx">
  <button type="button" class="relapse-button">Foo</button>
  <section class="relapse-fold">
    <div>This fold is not disabled</div>
  </section>
  <!-- This fold is disabled -->
  <button type="button" class="relapse-button disabled">Bar</button>
  <section class="relapse-fold">
    <div>This fold is disabled</div>
  </section>
  <button type="button" class="relapse-button">Foo</button>
  <section class="relapse-fold">
    <div>This fold is not disabled</div>
  </section>
  <!-- This fold is both expanded and disabled -->
  <button type="button" class="relapse-button opened disabled">Qux</button>
  <section class="relapse-fold">
    <div>This fold is disabled</div>
  </section>
</div>
```

:::
