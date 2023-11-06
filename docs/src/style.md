---
title: 'Relapse | Style'
layout: base
permalink: '/style.html'
---

# Style

Relapse injects CSS dynamically within `style="*"` attributes, however it is recommended that you apply styling externally within a `.css` file. The below code sample can be used as a base starting point for applying custom styles to Relapse collapsible components.

<br>

{% render 'examples/base' %}

---

```css
/* Relapse wrapper element */
.relapse {
  overflow: hidden;
  border: 1px solid lightgray;
  border-radius: 10px;
}

/* The relapse button default styles */
.relapse > .relapse-button {
  width: 100%;
  color: green;
  font-weight: 600;
  text-align: left;
  background-color: #374062;
  border: none;
  border-bottom: 1px solid lightgray;
}

/* Prevent the last button border from printing */
.relapse-button:last-of-type {
  border-bottom: none;
}

/* Relapse button text color on focus, i.e: pressing button */
.relapse > .relapse-button.focused {
  color: red;
}

/* When relapse button is opened or contains class initial */
.relapse > .relapse-button.initial,
.relapse > .relapse-button.opened {
  color: hotpink;
}

/* When relapse fold is expanded or the relapse button contains initial */
.relapse > .initial + .relapse-fold,
.relapse > .relapse-button + .expanded {
  max-height: inherit;
  visibility: visible;
  opacity: 1;
}

/* Relapse fold is closed, ensures no flash content */
.relapse > .relapse-fold {
  max-height: 0;
  visibility: hidden;
  opacity: 0;
}

/* The inner element of the relapse fold */
.relapse-fold > p {
  margin: 0;
  padding: 10px;
}
```
