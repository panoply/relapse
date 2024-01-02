---
title: 'Relapse | Semantic Styling'
layout: base
permalink: '/usage/styling/states.html'
prev:
  label: 'Markup / HTML'
  uri: '/usage/markup'
next:
  label: 'Instance'
  uri: '/api/instance'
---

## States

This section describes some basic styling states of Relapse. It intends to help developers understand some of the internal actions the module takes.

<br>

#### Animations

Relapse will perform transitions via WAAPI but it is important to note that you cannot directly interact with the Web Animations API through Relapse. The module focuses on providing surface-level customizations, passing them to WAAPI methods applied on folds. The intention is to streamline UX customization while avoiding unnecessary complexities.

By default, the applied animations in Relapse dynamically calculate transition `duration` based on the expanded `height` of folds. While Relapse provides the flexibility to control `duration` and `easing` effects (refer to [options](/api/options)), it's important to note that these settings will be overwritten when folds are collapsing.

When styling your components, there's no necessity to explicitly include animations or transition effects in your CSS. While it's technically applicable, it's advisable to refrain from adding extra effects on top of what Relapse adeptly manages. The goal is to leverage Relapse's built-in handling of animations for a seamless and consistent user experience, minimizing unnecessary complexity in your styles.

<br>

#### Rendering Hints

Relapse will inject `will-change` properties just before animations begin when expanding and collapsing folds. The `will-change` CSS property hints to browsers how an element is expected to change. Browsers may set up optimizations before an element is actually changed. These kinds of optimizations can increase the responsiveness of a page by doing potentially expensive work before they are actually required.

<br>

#### Avoiding Margin

Relapse uses `offsetHeight` to determine expand and collapse heights in semantic structures. Your fold element, which is the next known sibling of a `<summary>` can be any HTML tag, however it is important that margins are set to `0` to prevent invalid calculations. This is typically apparent if you are using paragraph `<p>` tags to contain content.

```css
/**
 * The asterisk * will ensure any element following
 * the <summary> tag will have margins reset to zero.
 */
details > summary + * {
  margin: 0;
}
```

<br>

#### Opened Folds

When a fold is opened in Relapse, the `<details>` tag is marked with a distinct `open` attribute as per the user agents (browser) default behavior. This attribute holds a significant role within Relapse, influencing the actions to be taken during initialization. Consequently, it's advisable to apply default styling using CSS to ensure optimal initial renders. This ensures that the visual representation aligns with the expected state.

```css
/**
 * The below example would apply to all folds
 * which have been expanded (opened).
 */
details[open] > summary {
  font-weight: 600;
  color: black;
  background-color: whitesmoke;
}
```
