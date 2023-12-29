---
title: 'Relapse | Styling'
layout: base
permalink: '/usage/styling.html'
prev:
  label: 'Markup / HTML'
  uri: '/usage/markup'
next:
  label: 'Instance'
  uri: '/api/instance'
---

# Styling

Relapse injects CSS dynamically within `style="*"` attributes, however it is recommended that you apply styling externally within a `.css` file. The below code sample can be used as a base starting point for applying custom styles to Relapse collapsible components.

<br>

{% render 'examples/styling' %}

---

<!-- prettier-ignore -->
```css
.styling {
  position: relative;
  display: block;
  border: 1px solid #989292;
  color: #000;
  font-family: system-ui;
  background-color: #fafafa;
}

.styling > details:first-child > summary { border-top: none; }
.styling > details[open] > summary { background-color: #dedddd; }
.styling > details > summary:hover { background-color: #dedddd; }
.styling > details > summary {
  border-top: 1px solid #989292;
  background-color: #efefef;
  padding: 10px;
  cursor: pointer;
  user-select: none;
  list-style-type: none;
}

.styling > details > summary + * {
  background-color: #fafafa;
  margin: 0;
  padding: 25px 10px;
}

/* Addition classes relapse will apply */
.styling > details > summary.focused {}
.styling > details > summary.opened {}
.styling > details > summary.disabled {}
.styling > details > summary + .expanded {}
```
