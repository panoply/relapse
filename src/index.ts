import { Scope, Fold, Options, EventNames, Events } from '../index';

declare global {
  export interface Window { relapse: Map<string, Scope> }
}

interface InternalOptions extends Options {
  /**
   * Whether or not expanded folds should be observed for
   * changes in height. When enabled, Relapse will keep track
   * of opened folds and expand where necessary.
   *
   */
  parent?: HTMLElement;
}

class Folds extends Array<Fold> {

  refs: { [id: string]: number } = Object.create(null)

  get(id?: string | number) {

    const type = typeof id

    if(type === 'number') {
      return this[id]
    } else if (type === 'string') {
      if(id in this.refs) {
        return this[this.refs[id]]
      } else {
        throw new Error(`Relapse: No fold using an id value of: ${id}`)
      }
    } else if(type === 'undefined') {
      return this
    }
  }
}

/**
 * Event Emitter
 *
 * The emitted events for the accordion.
 */
function $events (events: { [K in EventNames]: Events<Readonly<Scope>, Fold>[] }) {

  function emit (name: EventNames, scope: Scope, fold?: Fold): boolean  {

    const event = events[name] || [];
    const length = event.length;

    let prevent: boolean = null;

    for (let i = 0; i < length; i++) {
      const returns = event[i].apply(scope, [ fold ]);
      if (prevent === null && returns === false) prevent = true;
    }

    return prevent;
  };

  function on (name: EventNames, callback: Events<Readonly<Scope>, Fold>) {
    if (!events[name]) events[name] = [];
    events[name].push(callback);
  };

  function off (name: EventNames, callback: () => void) {

    const live = [];
    const event = events[name];

    if (event && callback) {
      for (let i = 0, s = event.length; i < s; i++) {
        if (event[i] !== callback) live.push(event[i]);
      }
    }

    if (live.length) {
      event[name] = live;
    } else {
      delete event[name];
    }

  };

  return {
    on,
    off,
    emit
  };

};

/**
 * Folds instance - Creates an object literal for each content fold.
 */
function $folds (scope: Scope, event: ReturnType<typeof $events>) {

  const { classes } = scope.config;

  return function (fold: Fold) {

    /**
     * Expanding Element - Opens a closed fold
     */
    const $active = (index: number) => {

      if (typeof index !== 'number') {
        if (scope.active !== fold.index) scope.active = fold.index;
        return fold;
      }

      if (scope.folds.get(index)) {
        scope.active = fold.index;
        return scope.folds.get(index);
      } else {
        throw new Error(`relapse: No fold exists at index: ${index}`);
      }
    };

    /**
     * Collapsing Element - Closes an open fold
     */
    const $collapse = (focus: Fold) => {

      focus.button.ariaDisabled = 'false';
      focus.button.ariaExpanded = 'false';
      focus.element.classList.remove(classes.expanded);

      focus.expanded = false;

      if (focus.button.classList.contains(classes.initial)) {
        focus.button.classList.remove(classes.initial);
      }

      // if we want to transition when closing we
      // have to set the current height and replace auto
      focus.element.style.setProperty('max-height', '0')


      if (scope.parent !== null) {
        scope.parent.style.setProperty('max-height', `${scope.parent.scrollHeight - focus.height}px`);
      }

      if (scope.folds.length - 1 === focus.index) {
        focus.element.addEventListener('transitionend', function $end() {

          if(!focus.expanded) {
            focus.element.style.setProperty('opacity', '0')
            focus.element.style.setProperty('visibility','hidden')
            focus.button.classList.remove(classes.opened);
          }

          focus.element.removeEventListener('transitionend', $end);

        })
      } else {

        focus.element.style.setProperty('opacity', '0')
        focus.element.style.setProperty('visibility','hidden')
        focus.button.classList.remove(classes.opened);
      }

    };


    fold.open = function (index?: number) {

      const focus = $active(index);

      if (focus.expanded) return;

      focus.close();

      focus.height = focus.element.scrollHeight;
      focus.button.ariaDisabled = 'true';
      focus.button.ariaExpanded = 'true';
      focus.button.classList.add(classes.opened);

      focus.element.classList.add(classes.expanded);
      focus.element.style.setProperty('max-height', `${focus.height}px`);
      focus.element.style.setProperty('opacity', `1`)
      focus.element.style.setProperty('visibility', `visible`)

      if (scope.parent !== null) {
        scope.parent.style.setProperty('max-height', `${scope.parent.scrollHeight + focus.height}px`);
      }

      focus.expanded = true;
      focus.disable();

      scope.count = scope.folds.filter(({ expanded }) => expanded).length;
      event.emit('expand', scope, focus);

    };

    fold.close = function (index?: number) {

      let focus = $active(index);

      if (scope.config.multiple) {
        if (scope.config.persist === false || (scope.config.persist && scope.count > 1)) {
          $collapse(focus);
        }
      } else {
        for (const node of scope.folds.values()) {
          if (node.expanded === true) {
            if (scope.config.persist && node.index === focus.index) break;
            $collapse(node);
            focus = node;
            break;
          }
        }
      }

      focus.enable();
      scope.count = scope.folds.filter(({ expanded }) => expanded).length;
      event.emit('collapse', scope, focus);

    };

    /**
     * Focus Button - Applies focus to the button
     */
    fold.focus = function ()  {

      scope.active = fold.index; // focused Scope
      fold.button.classList.add(classes.focused);
      event.emit('focus', scope, fold);
    };

    /**
     * Blur Button - Applies blur to the button
     */
    fold.blur = function() {

      fold.button.classList.remove(classes.focused);
    }

    /**
     * Button Enable - Writes
     */
    fold.enable = function(index?: number)  {

      const focus = $active(index);

      if (focus.disabled) {
        focus.disabled = false;
        focus.button.ariaDisabled = 'false';
        focus.button.classList.remove(classes.disabled);
      }
    };

    /**
     * Button Disable - Enables
     */
    fold.disable = function(index?: number) {

      const focus = $active(index);

      if (!focus.disabled) {
        if (focus.expanded) {
          if (scope.config.persist) {
            focus.disabled = true;
            focus.button.ariaDisabled = 'true';
          }
        } else {
          focus.close();
          focus.disabled = true;
          focus.button.ariaDisabled = 'true';
          focus.button.classList.add(classes.disabled);
        }
      }
    };

    fold.toggle = function () {

      if (event.emit('toggle', scope, fold) === false) return;

      return fold.expanded
        ? fold.close()
        : fold.open();
    };

    fold.destroy = function (remove = false) {

      fold.close();

      fold.button.removeEventListener('click', fold.toggle);
      fold.button.removeEventListener('focus', fold.focus);
      fold.button.removeEventListener('blur', fold.blur);

      if (remove) {
        scope.element.removeChild(fold.element);
        scope.element.removeChild(fold.button);
      }

    };

    fold.button.addEventListener('click', fold.toggle);
    fold.button.addEventListener('focus', fold.focus);
    fold.button.addEventListener('blur', fold.blur);

    if(fold.element.hasAttribute('id')) {
      scope.folds.push(fold);
      (scope.folds as Folds).refs[fold.element.id] = scope.folds.length - 1
    } else {
      scope.folds.push(fold);
    }

  };

}

/**
 * Default Options - Merges the default options with user options.
 */
const $defaults = (options: InternalOptions): InternalOptions => {

  const config: InternalOptions = Object.create(null);

  config.persist = true;
  config.multiple = false;
  config.parent = null;
  config.schema = 'data-relapse';
  config.duration = 225;
  config.classes = Object.create(null);
  config.classes.initial = 'initial';
  config.classes.opened = 'opened';
  config.classes.disabled = 'disabled';
  config.classes.expanded = 'expanded';
  config.classes.focused = 'focused';

  if (typeof options === 'object') {
    for (const o in options) {
      if (o === 'classes') {
        for (const c in options[o]) {
          config.classes[c] = options[o][c];
        }
      } else {
        config[o] = options[o];
      }
    }
  }

  return config;

};

function $attrs (config: InternalOptions, attrs: NamedNodeMap) {

  const slice = config.schema.length + 1;

  // Lets loop over all the attributes contained on the element
  // and apply configuration to ones using valid annotations.
  for (const { nodeName, nodeValue } of attrs) {

    if(!nodeName.startsWith(config.schema)) continue

    const prop = nodeName.slice(slice);
    const value = nodeValue.trim();

    if (prop === 'persist' || prop === 'multiple') {
      if(value === 'true' || value === 'false') {
        config[prop] = value === 'true'
      } else {
        throw new TypeError(`relapse: Invalid ${nodeName} attribute value. Boolean expected, received: ${value}`);
      }
    } else if(prop === 'duration') {
      if(isNaN(+value)) {
        throw new TypeError(`relapse: Invalid ${nodeName} attribute value. Number expected, received: ${value}`);
      } else {
        config[prop] = +value
      }
    }
  }

  return config;

};

function $style (config: InternalOptions) {

  const display = config.duration / 2

  return `will-change:visibility,opacity,max-height;overflow:hidden;transition:visibility ${display}ms linear,opacity ${display}ms linear,max-height ${config.duration}ms ease-in-out;`
}


const relapse = function relapse (selector?: string | HTMLElement | InternalOptions, options?: InternalOptions) {

  /**
   * Selector passed, single instance should apply
   */
  const single = typeof selector === 'string' || typeof selector === 'object' && 'tagName' in selector;

  if (single && selector instanceof NodeList) {
    throw TypeError('relapse: Invalid selector, NodeList is not supported, pass string or Element');
  }

  const config = $defaults(single ? options : selector);

  let element: HTMLElement = null;

  if(single) {
    if (typeof selector === 'string') {
      element = document.body.querySelector(selector);
    } else {
      element = selector
    }
  } else {
    for (const node of document.body.querySelectorAll<HTMLElement>(`[${config.schema}]`)) {
      relapse(node, options);
    }
  }

  if (element === null) return;
  if (!(window.relapse instanceof Map)) window.relapse = new Map();

  const scope: Scope = Object.create(null);
  scope.events = Object.create(null);
  scope.folds = new Folds()
  scope.element = element;
  scope.id = `R${window.relapse.size}`;
  scope.count = 0;
  scope.config = $attrs(config, scope.element.attributes);
  scope.parent = (scope.config as InternalOptions).parent;

  let key: string = null;

  if (element.hasAttribute(scope.config.schema)) {
    key = element.getAttribute(scope.config.schema);
  } else if ('id' in element) {
    key = element.id;
  }

  if (key === null && window.relapse.has(key) === true) {
    key = Math.random().toString(36).slice(2)
  }


  scope.element.ariaMultiSelectable = `${scope.config.multiple}`;

  const children = element.children;
  const length = children.length;
  const event = $events(scope.events);
  const folds = $folds(scope, event);
  const { classes } = scope.config;
  const style = isNaN(scope.config.duration) || scope.config.duration === -1
    ? null
    : $style(scope.config)

  for (let i = 0; i < length; i = i + 2) {


    const btn = children[i];
    const node = children[i + 1] as HTMLElement;
    const fold: Fold = Object.create(null);

    fold.index = scope.folds.length;

    const isInitial = btn.classList.contains(classes.initial);
    const isOpened = btn.classList.contains(classes.opened);
    const isDisabled = btn.classList.contains(classes.disabled);
    const isExpanded = node.classList.contains(classes.expanded);

    if (btn.ariaExpanded === 'true' || isOpened || isExpanded || isInitial) {

      // class name and attribute align
      if (!isOpened) {
        btn.classList.add(classes.opened);
      } else {
        btn.ariaExpanded = 'true';
      }

      if (!isInitial) btn.classList.remove(classes.initial);
      if (!isExpanded) node.classList.add(classes.expanded);

      if (isDisabled) {
        btn.classList.add(classes.disabled);
        btn.ariaDisabled = 'true';
        fold.disabled = true;
      }

      fold.expanded = true;

    } else if (btn.ariaDisabled === 'true' || isDisabled) {

      fold.disabled = true;

      // class name and attribute align
      if (!isDisabled) {
        btn.classList.add(classes.disabled);
      } else {
        btn.ariaDisabled = 'true';
      }

      if (isExpanded) {
        fold.expanded = true;
        btn.ariaExpanded = 'true';
      } else {
        fold.expanded = false;
        btn.ariaExpanded = 'false';
      }

      if (isOpened) {
        btn.classList.remove(classes.opened);
      }

    } else {

      fold.expanded = false;
      fold.disabled = false;

      btn.ariaExpanded = 'false';
      btn.ariaDisabled = 'false';

    }

    if ('id' in btn) fold.id = btn.id;
    if ('id' in node) fold.id = node.id;
    if (!('id' in fold)) {
      // @ts-ignore-next-line
      fold.id = `${scope.id}F${fold.index}`;
      // @ts-ignore-next-line
      btn.id = `B${fold.id}`;
      // @ts-ignore-next-line
      node.id = `C${fold.id}`;
    }

    btn.setAttribute('aria-controls', fold.id);
    node.setAttribute('aria-labelledby', btn.id);
    node.setAttribute('role', 'region');

    Object.defineProperties(fold, {
      button: {
        get() {
          return btn
        },
      },
      element: {
        get() {
          return node
        },
      }
    })

    if (fold.expanded) {

      scope.count = scope.count + 1;

      fold.element.style.cssText = style !== null
        ? `max-height:${fold.element.scrollHeight}px;opacity:1;visibility:visible;${style}`
        : `max-height:${fold.element.scrollHeight}px;opacity:1;visibility:visible;`;

    } else {

      fold.element.style.cssText = style !== null
        ? `max-height:0px;opacity:0;visibility:hidden;${style}`
        : 'max-height:0px;opacity:0;visibility:hidden;';

    }

    folds(fold);

    window.relapse.set(key, null);

    for (const nested of fold.element.querySelectorAll<HTMLElement>(`[${scope.config.schema}]`)) {
      relapse(nested, { parent: fold.element });
    }
  }

  const $find = (method: 'open' | 'close' | 'destroy', fold: string | number, remove = false) => {

    if (typeof fold === 'number') {
      return method.charCodeAt(0) === 100
        ? scope.folds[fold][method](remove as never)
        : scope.folds[fold][method]();
    } else if (typeof fold === 'string') {
      for (const f of scope.folds.values()) {
        if (f.button.dataset[`${scope.config.schema}-fold`] === fold) {
          return method.charCodeAt(0) === 100 ? f[method](remove as never) : f[method]();
        }
      }
    }

    throw new Error(`relapse: Fold does not exist: "${fold}"`);

  };

  /* -------------------------------------------- */
  /* METHODS                                      */
  /* -------------------------------------------- */

  scope.on = event.on as Events<Readonly<Scope>, Fold>;

  scope.off = event.off;

  scope.collapse = (fold: string | number) => $find('close', fold);

  scope.expand = (fold: string | number) => $find('open', fold);

  scope.destroy = (fold?: string | number, remove = false) => {

    if (typeof fold === 'undefined') {
      for (const fold of scope.folds.values()) fold.destroy();
    } else {
      $find('destroy', fold, remove);
    }

    scope.element.removeAttribute('aria-multiselectable');
    event.emit('destroy', scope);
    window.relapse.delete(key);

  };

  window.relapse.set(key, scope);

  return single ? scope : Array.from(window.relapse.values())

};

relapse.get = (id?: string) => id ? window.relapse.get(id) : window.relapse;

export default relapse;
