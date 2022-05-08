// src/lib/events.ts
var $events = (events) => ({
  emit: (name, scope, fold) => {
    const event = events[name] || [];
    const length = event.length;
    let prevent = null;
    for (let i = 0; i < length; i++) {
      const returns = event[i].apply(scope, [fold]);
      if (prevent === null && returns === false)
        prevent = true;
    }
    return prevent;
  },
  on: (name, callback) => {
    if (!events[name])
      events[name] = [];
    events[name].push(callback);
  },
  off: (name, callback) => {
    const live = [];
    const event = events[name];
    if (event && callback) {
      let i = 0;
      const len = event.length;
      for (; i < len; i++)
        if (event[i] !== callback)
          live.push(event[i]);
    }
    if (live.length) {
      event[name] = live;
    } else {
      delete event[name];
    }
  }
});

// src/lib/accordion.ts
var $defaults = (options) => {
  const config = /* @__PURE__ */ Object.create(null);
  config.preserve = false;
  config.persist = true;
  config.multiple = false;
  config.keyboard = true;
  config.duration = 175;
  config.fade = true;
  config.schema = "data-accordion";
  Object.assign(config, options);
  return config;
};
var $folds = (scope, event) => (fold) => {
  const { config } = scope;
  const { duration } = config;
  const $collapse = (focus) => {
    scope.collapsing = true;
    const { content, button } = focus;
    const { scrollHeight, style } = content;
    const start = performance.now();
    let opacity = 1;
    requestAnimationFrame(function $animate(time) {
      const progress = Math.min((time - start) / duration, 1);
      let raf;
      if (opacity >= 0)
        style.opacity = `${opacity -= 7e-3}`;
      if (progress < 1) {
        style.height = `${scrollHeight - progress * scrollHeight}px`;
        raf = requestAnimationFrame($animate);
      } else if (progress >= 1) {
        style.height = "0";
        style.opacity = "0";
        focus.expanded = false;
        scope.collapsing = false;
        content.classList.remove("expanded");
        button.classList.remove("expanded");
        button.ariaDisabled = "false";
        cancelAnimationFrame(raf);
      }
    });
  };
  const $expand = (focus) => {
    scope.collapsing = true;
    const { scrollHeight, style } = focus;
    const start = performance.now();
    let opacity = 0;
    requestAnimationFrame(function $animate(time) {
      const progress = Math.min((time - start) / duration, 1);
      let raf;
      if (opacity <= 1)
        style.opacity = `${opacity += 0.03}`;
      if (progress < 1) {
        style.height = `${progress * scrollHeight}px`;
        raf = requestAnimationFrame($animate);
      } else if (progress >= 1) {
        style.height = "auto";
        style.opacity = "1";
        scope.collapsing = false;
        cancelAnimationFrame(raf);
      }
    });
  };
  const $active = (index) => {
    if (typeof index !== "number") {
      if (scope.active !== fold.number)
        scope.active = fold.number;
      return fold;
    }
    if (scope.folds[index]) {
      scope.active = fold.number;
      return scope.folds[index];
    } else {
      throw new TypeError(`No fold exists at index: ${index}`);
    }
  };
  fold.button.ariaExpanded = `${fold.expanded}`;
  fold.button.ariaDisabled = `${fold.disabled}`;
  fold.button.setAttribute("aria-controls", fold.id);
  fold.content.setAttribute("aria-labelledby", fold.button.id);
  fold.content.setAttribute("role", "region");
  fold.focus = () => {
    fold.button.classList.add("focused");
    fold.content.classList.add("focused");
    scope.active = fold.number;
    event.emit("focus", scope, fold);
  };
  fold.blur = () => {
    fold.button.classList.remove("focused");
    fold.content.classList.remove("focused");
  };
  fold.enable = (index) => {
    const focus = $active(index);
    if (focus.disabled) {
      focus.disabled = false;
      focus.button.ariaDisabled = "false";
      focus.button.classList.remove("disabled");
    }
  };
  fold.disable = (index) => {
    const focus = $active(index);
    if (!focus.disabled) {
      if (focus.expanded) {
        if (config.persist) {
          focus.disabled = true;
          focus.button.ariaDisabled = "true";
        }
      } else {
        focus.close();
        focus.disabled = true;
        focus.button.ariaDisabled = "true";
        focus.button.classList.add("disabled");
      }
    }
  };
  fold.close = (index) => {
    let focus = $active(index);
    if (config.multiple && !focus.expanded) {
      $collapse(focus);
    } else {
      for (const f of scope.folds) {
        if (f.expanded) {
          if (config.persist && f.number === focus.number)
            break;
          $collapse(f);
          focus = f;
          break;
        }
      }
    }
    focus.enable();
    event.emit("collapse", scope, focus);
  };
  fold.open = (index) => {
    const focus = $active(index);
    if (focus.expanded || focus.disabled)
      return;
    focus.close();
    $expand(focus.content);
    focus.expanded = true;
    focus.button.ariaDisabled = "true";
    focus.button.classList.add("expanded");
    focus.content.classList.add("expanded");
    focus.disable();
    event.emit("expand", scope, focus);
  };
  fold.toggle = () => {
    if (scope.collapsing)
      return;
    if (event.emit("toggle", scope, fold))
      return;
    return fold.expanded ? fold.close() : fold.open();
  };
  fold.destroy = (aria = false) => {
    if (aria) {
      fold.button.removeAttribute("aria-expanded");
      fold.button.removeAttribute("aria-disabled");
      fold.button.removeAttribute("aria-controls");
      fold.content.removeAttribute("aria-labelledby");
      fold.content.removeAttribute("role");
    }
    fold.button.removeEventListener("click", fold.toggle);
    fold.button.removeEventListener("focus", fold.focus);
    fold.button.removeEventListener("blur", fold.blur);
  };
  fold.button.addEventListener("click", fold.toggle);
  fold.button.addEventListener("focus", fold.focus);
  fold.button.addEventListener("blur", fold.blur);
  scope.folds.push(fold);
};
var accordion = (selector, options) => {
  if (!(window.relapse instanceof Map))
    window.relapse = /* @__PURE__ */ new Map();
  const scope = /* @__PURE__ */ Object.create(null);
  scope.folds = [];
  scope.events = /* @__PURE__ */ Object.create(null);
  scope.config = $defaults(options);
  scope.id = `A${window.relapse.size}`;
  scope.element = typeof selector === "string" ? document.body.querySelector(selector) : selector;
  scope.element.ariaMultiSelectable = `${scope.config.multiple}`;
  scope.collapsing = false;
  const children = scope.element.children;
  const length = children.length;
  const event = $events(scope.events);
  const folds = $folds(scope, event);
  for (let i = 0; i < length; i = i + 2) {
    const child = children[i];
    const sibling = children[i + 1];
    let button;
    let content;
    if (child.nodeName === "A" || child.nodeName === "BUTTON") {
      button = child;
    } else {
      throw new TypeError("Buttons must be either <a> or <button> elements");
    }
    if (sibling.nodeName === "A" || sibling.nodeName === "BUTTON") {
      throw new TypeError("Content fold cannot be <a> or <button> element");
    } else {
      content = sibling;
    }
    const fold = /* @__PURE__ */ Object.create(null);
    fold.button = button;
    fold.content = content;
    ;
    fold.number = scope.folds.length;
    fold.id = `${scope.id}F${fold.number}`;
    fold.button.id = `B${fold.id}`;
    fold.content.id = `C${fold.id}`;
    fold.disabled = button.classList.contains("disabled") || content.classList.contains("disabled");
    fold.expanded = button.classList.contains("expanded") || content.classList.contains("expanded");
    folds(fold);
  }
  const $find = (fold, method) => {
    console.log(fold);
    if (typeof fold === "number") {
      return scope.folds[fold][method]();
    } else if (typeof fold === "string") {
      for (const f of scope.folds) {
        if (f.button.dataset[`${scope.config.schema}-fold`] === fold) {
          return f[method]();
        }
      }
    }
    throw new TypeError(`Fold does not exist for "${fold}"`);
  };
  scope.on = event.on;
  scope.off = event.off;
  scope.collapse = (fold) => $find(fold, "close");
  scope.expand = (fold) => $find(fold, "open");
  scope.destroy = (reset = false) => {
    for (const fold of scope.folds)
      fold.destroy();
    scope.element.removeAttribute("aria-multiselectable");
    scope.element.removeAttribute("id");
    event.emit("destroy", scope);
    window.relapse.delete(scope.id);
  };
  window.relapse.set(scope.id, scope);
  return scope;
};

// src/index.ts
var src_default = {
  accordion
};
export {
  accordion,
  src_default as default
};
