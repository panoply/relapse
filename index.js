// src/index.ts
function $events(events) {
  const emit = (name, scope, fold) => {
    const event = events[name] || [];
    const length = event.length;
    let prevent = null;
    for (let i = 0; i < length; i++) {
      const returns = event[i].apply(scope, [fold]);
      if (prevent === null && returns === false)
        prevent = true;
    }
    return prevent;
  };
  const on = (name, callback) => {
    if (!events[name])
      events[name] = [];
    events[name].push(callback);
  };
  const off = (name, callback) => {
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
  };
  return { on, off, emit };
}
function $folds(scope, event) {
  const { config } = scope;
  const { classes } = config;
  return (fold) => {
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
    const $collapse = (focus) => {
      focus.button.ariaDisabled = "false";
      focus.button.ariaExpanded = "false";
      focus.button.classList.remove(classes.opened);
      focus.content.classList.remove(classes.expanded);
      focus.expanded = false;
      focus.content.style.maxHeight = "0";
    };
    fold.open = (index) => {
      const focus = $active(index);
      if (focus.expanded || focus.disabled)
        return;
      focus.close();
      focus.button.ariaDisabled = "true";
      focus.button.ariaExpanded = "true";
      focus.button.classList.add(classes.opened);
      focus.content.classList.add(classes.expanded);
      focus.content.style.maxHeight = `${focus.content.scrollHeight}px`;
      focus.expanded = true;
      focus.disable();
      event.emit("expand", scope, focus);
    };
    fold.focus = () => {
      scope.active = fold.number;
      fold.button.classList.add(classes.focused);
      event.emit("focus", scope, fold);
    };
    fold.blur = () => fold.button.classList.remove(classes.focused);
    fold.enable = (index) => {
      const focus = $active(index);
      if (focus.disabled) {
        focus.disabled = false;
        focus.button.ariaDisabled = "false";
        focus.button.classList.remove(classes.disabled);
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
          focus.button.classList.add(classes.disabled);
        }
      }
    };
    fold.close = (index) => {
      let focus = $active(index);
      if (config.multiple && !focus.expanded) {
        $collapse(focus);
      } else {
        for (const node of scope.folds) {
          if (node.expanded) {
            if (config.persist && node.number === focus.number)
              break;
            $collapse(node);
            focus = node;
            break;
          }
        }
      }
      focus.enable();
      event.emit("collapse", scope, focus);
    };
    fold.toggle = () => {
      if (event.emit("toggle", scope, fold))
        return;
      return fold.expanded ? fold.close() : fold.open();
    };
    fold.destroy = (remove = false) => {
      fold.close();
      fold.button.removeEventListener("click", fold.toggle);
      fold.button.removeEventListener("focus", fold.focus);
      fold.button.removeEventListener("blur", fold.blur);
      if (remove) {
        scope.element.removeChild(fold.content);
        scope.element.removeChild(fold.button);
      }
    };
    fold.button.addEventListener("click", fold.toggle);
    fold.button.addEventListener("focus", fold.focus);
    fold.button.addEventListener("blur", fold.blur);
    scope.folds.push(fold);
  };
}
var $boolean = (nodeValue) => {
  const value = nodeValue.trim();
  if (!/true|false/.test(value))
    throw new TypeError(`Invalid value. Boolean expected, received: ${value}`);
  return value === "true";
};
var $defaults = (options, attrs) => {
  if (typeof options !== "object")
    options = /* @__PURE__ */ Object.create(null);
  const config = /* @__PURE__ */ Object.create(null);
  const classes = /* @__PURE__ */ Object.create(null);
  classes.initial = "initial";
  classes.opened = "opened";
  classes.disabled = "disabled";
  classes.expanded = "expanded";
  classes.focused = "focused";
  if ("classes" in options)
    Object.assign(classes, options.classes);
  config.classes = classes;
  config.persist = true;
  config.multiple = false;
  config.schema = "data-relapse";
  if (typeof options === "object")
    Object.assign(config, options);
  const name = /^(?:persist|multiple)$/;
  const slice = config.schema === null ? 5 : config.schema.length + 1;
  for (const { nodeName, nodeValue } of attrs) {
    const prop = nodeName.slice(slice);
    if (name.test(prop))
      config[prop] = $boolean(nodeValue);
  }
  return config;
};
function relapse(selector, options) {
  if (!(window.relapse instanceof Map))
    window.relapse = /* @__PURE__ */ new Map();
  const scope = /* @__PURE__ */ Object.create(null);
  scope.folds = [];
  scope.events = /* @__PURE__ */ Object.create(null);
  scope.element = typeof selector === "string" ? document.body.querySelector(selector) : selector;
  scope.id = `A${window.relapse.size}`;
  scope.config = $defaults(options, scope.element.attributes);
  let key = scope.element.getAttribute("data-relapse");
  const id = scope.element.getAttribute("id");
  if (key === null && id === null) {
    key = scope.id;
  } else if (key !== null && id !== null) {
    if (window.relapse.has(id) || window.relapse.has(key)) {
      throw new TypeError(`An existing instance is using id "${key}"`);
    }
  } else if (key === null && id !== null)
    key = id;
  if (window.relapse.has(key)) {
    throw new TypeError(`An existing instance is using id "${key}"`);
  }
  scope.element.ariaMultiSelectable = `${scope.config.multiple}`;
  const children = scope.element.children;
  const length = children.length;
  const event = $events(scope.events);
  const folds = $folds(scope, event);
  const { classes } = scope.config;
  for (let i = 0; i < length; i = i + 2) {
    const button = children[i];
    const content = children[i + 1];
    const fold = /* @__PURE__ */ Object.create(null);
    fold.number = scope.folds.length;
    const isInitial = button.classList.contains(classes.initial);
    const isOpened = button.classList.contains(classes.opened);
    const isDisabled = button.classList.contains(classes.disabled);
    const isExpanded = content.classList.contains(classes.expanded);
    if (button.ariaExpanded === "true" || isOpened || isExpanded || isInitial) {
      if (!isOpened)
        button.classList.add(classes.opened);
      else
        button.ariaExpanded = "true";
      if (!isExpanded)
        content.classList.add(classes.expanded);
      if (!isDisabled)
        button.classList.add(classes.disabled);
      if (!isInitial)
        button.classList.remove(classes.initial);
      button.ariaDisabled = "true";
      fold.expanded = true;
      fold.disabled = true;
    } else if (button.ariaDisabled === "true" || isDisabled) {
      if (!isDisabled)
        button.classList.add(classes.disabled);
      else
        button.ariaDisabled = "false";
      content.classList.remove(classes.expanded);
      button.classList.remove(classes.opened);
      button.ariaExpanded = "false";
      fold.expanded = false;
      fold.disabled = true;
    } else {
      fold.expanded = false;
      fold.disabled = false;
      button.ariaExpanded = "false";
      button.ariaDisabled = "false";
    }
    if (button.id)
      fold.id = button.id;
    if (content.id)
      fold.id = content.id;
    if (!("id" in fold)) {
      fold.id = `${scope.id}F${fold.number}`;
      button.id = `B${fold.id}`;
      content.id = `C${fold.id}`;
    }
    button.setAttribute("aria-controls", fold.id);
    content.setAttribute("aria-labelledby", button.id);
    content.setAttribute("role", "region");
    fold.button = button;
    fold.content = content;
    folds(fold);
  }
  const $find = (method, fold, remove = false) => {
    if (typeof fold === "number") {
      return method.charCodeAt(0) === 100 ? scope.folds[fold][method](remove) : scope.folds[fold][method]();
    } else if (typeof fold === "string") {
      for (const f of scope.folds) {
        if (f.button.dataset[`${scope.config.schema}-fold`] === fold) {
          return method.charCodeAt(0) === 100 ? f[method](remove) : f[method]();
        }
      }
    }
    throw new TypeError(`Fold does not exist: "${fold}"`);
  };
  scope.on = event.on;
  scope.off = event.off;
  scope.collapse = (fold) => $find("close", fold);
  scope.expand = (fold) => $find("open", fold);
  scope.destroy = (fold, remove = false) => {
    if (typeof fold === "undefined") {
      for (const fold2 of scope.folds)
        fold2.destroy();
    } else {
      $find("destroy", fold, remove);
    }
    scope.element.removeAttribute("aria-multiselectable");
    event.emit("destroy", scope);
    window.relapse.delete(key);
  };
  window.relapse.set(key, scope);
  return scope;
}
relapse.get = (id) => id ? window.relapse.get(id) : window.relapse;
relapse.load = () => {
  if (document.readyState === "loading")
    setTimeout(relapse.load, 50);
  const elements = document.querySelectorAll("[data-relapse]");
  for (const element of elements) {
    if (element.getAttribute("data-relapse") !== "")
      relapse(element);
  }
};
var src_default = relapse;
export {
  $events,
  src_default as default
};
