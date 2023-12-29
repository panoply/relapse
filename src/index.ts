/* eslint-disable no-unused-vars */
import { Scope, Fold, Options, EventNames, Events } from '../index';

declare global {
  export interface Window { Relapse: Map<string, Scope> }
}

/**
 * Objects (Utility)
 *
 * Utility for generating an object without Prototype.
 */
function $object <T> (object?: Partial<T>): T {

  const o = Object.create(null);

  return object ? Object.assign(o, object) : o;

}

/**
 * Folds
 *
 * Extends the native Array `[]` to support additional methods.
 */
class Folds extends Array<Fold> {

  refs: { [id: string]: number } = $object();

  get = (id?: string | number) => {

    const type = typeof id;

    if (type === 'number') {
      return this[id];
    } else if (type === 'string') {
      if (id in this.refs) {
        return this[this.refs[id]];
      } else {
        throw new Error(`Relapse: No fold using an id value of: ${id}`);
      }
    } else if (type === 'undefined') {

      return this;

    }
  };

}

/**
 * Event Emitter
 *
 * The emitted events for the accordion.
 */
function $events (events: { [K in EventNames]?: Events<Readonly<Scope>, Fold>[] }) {

  const emit = (name: EventNames, scope: Scope, fold?: Fold): boolean => {

    /**
     * Select the event/s to emit
     */
    const event = events[name] || [];

    /**
     * Whether or not to `preventDefault`
     */
    let prevent: boolean = null;

    for (let i = 0, s = event.length; i < s; i++) {
      const returns = event[i].call(scope, fold);
      if (prevent === null && returns === false) prevent = true;
    }

    return prevent;

  };

  const on = (name: EventNames, callback: Events<Readonly<Scope>, Fold>) => {
    if (!events[name]) events[name] = [];
    events[name].push(callback);
  };

  const off = (name: EventNames, callback: () => void) => {

    /**
     * Select the event/s to emit
     */
    const event = events[name];

    /**
     * Reference of all events that should not be removed
     */
    const live = [];

    if (event && callback) {
      for (let i = 0, s = event.length; i < s; i++) {
        if (event[i] !== callback) live.push(event[i]);
      }
    }

    if (live.length > 0) {
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
function $folds (scope: Scope, event: ReturnType<typeof $events>, fold: Fold) {

  const { classes } = scope.config;

  const $fade = (element: HTMLElement, opacity: [ string, string ], visibility: [ string, string ]) => {

    const animate = element.animate({ opacity, visibility }, {
      duration: scope.config.fading.duration,
      easing: scope.config.fading.easing
    });

    animate.onfinish = () => {
      element.style.setProperty('opacity', opacity[1]);
      element.style.setProperty('visibility', visibility[1]);
      animate.cancel();
    };

  };

  const $grow = (fold: Fold, height: [string, string], callback: () => void) => {

    const animate = fold.wrapper.animate(scope.semantic ? { height } : { maxHeight: height }, {
      duration: scope.config.folding.duration,
      easing: scope.config.folding.easing
    });

    animate.onfinish = callback;

  };

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
      throw new Error(`Relapse: No fold exists at index: ${index}`);
    }

  };

  /**
   * Collapsing Element - Closes an opened fold
   */
  const $collapse = (focus: Fold) => {

    if (scope.semantic) {
      focus.height = focus.button.offsetHeight;
      focus.wrapper.style.setProperty('overflow', 'hidden');
    } else {
      focus.height = 0;
    }

    $fade(focus.element, [ '1', '0' ], [ 'visible', 'hidden' ]);
    $grow(focus, [ `${focus.wrapper.offsetHeight}px`, `${focus.height}px` ], () => {

      if (scope.semantic) {
        focus.wrapper.style.setProperty('height', `${focus.height}px`);
        focus.wrapper.removeAttribute('open');
      } else {
        focus.element.style.setProperty('max-height', '0');
      }

      focus.expanded = false;

      focus.button.ariaDisabled = 'false';
      focus.button.ariaExpanded = 'false';
      focus.button.classList.remove(classes.opened);
      focus.wrapper.classList.remove(classes.expanded);

    });

  };

  const $expand = (focus: Fold) => (time: number) => {

    focus.close();

    focus.wrapper.style.setProperty('overflow', 'hidden');
    focus.button.ariaDisabled = 'true';
    focus.button.ariaExpanded = 'true';
    focus.button.classList.add(classes.opened);

    let start: string;

    if (scope.semantic) {
      focus.wrapper.setAttribute('open', '');
      focus.height = focus.button.offsetHeight + focus.element.offsetHeight;
      start = `${focus.button.offsetHeight}px`;
    } else {
      focus.height = focus.element.scrollHeight;
      start = '0px';
    }

    $fade(focus.element, [ '0', '1' ], [ 'hidden', 'visible' ]);
    $grow(focus, [ start, `${focus.height}px` ], () => {

      if (scope.semantic) {
        focus.wrapper.style.setProperty('height', 'auto');
      } else {
        focus.element.style.setProperty('max-height', `${focus.height}px`);
      }

      focus.wrapper.style.removeProperty('overflow');
      focus.wrapper.classList.add(classes.expanded);
      focus.expanded = true;
      scope.openCount = scope.folds.filter(({ expanded }) => expanded).length;

      if (scope.config.persist === true && scope.openCount > 1) focus.disable();

      event.emit('expand', scope, focus);

    });
  };

  /**
   * Open Fold
   */
  fold.open = (index?: number) => {

    const focus = $active(index);

    if (focus.expanded) return;

    requestAnimationFrame($expand(focus));

  };

  /**
   * Close Fold
   */
  fold.close = (index: number) => {

    let focus = $active(index);

    if (scope.config.multiple) {
      if (scope.config.persist === true && scope.openCount > 1) {
        $collapse(focus);
      } else if (scope.config.persist === false && focus.expanded === true) {
        $collapse(focus);
      }
    } else {
      for (const node of scope.folds) {
        if (node.expanded === true) {
          if (scope.config.persist && node.index === focus.index) break;
          $collapse(node);
          focus = node;
          break;
        }
      }

    }

    focus.enable();
    scope.openCount = scope.folds.filter(({ expanded }) => expanded).length;
    event.emit('collapse', scope, focus);

  };

  /**
   * Focus Button - Applies focus to the button
   */
  fold.focus = () => {

    scope.active = fold.index; // focused Scope
    fold.button.classList.add(classes.focused);
    event.emit('focus', scope, fold);

  };

  /**
   * Blur Button - Applies blur to the button
   */
  fold.blur = () => {

    fold.button.classList.remove(classes.focused);
  };

  /**
   * Button Enable - Writes
   */
  fold.enable = (index?: number) => {

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
  fold.disable = (index?: number) => {

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

  /**
   * Toggle Fold
   */
  fold.toggle = (e) => {

    if (scope.semantic) e.preventDefault();

    if (event.emit('toggle', scope, fold) === false) return;

    return fold.expanded ? fold.close() : fold.open();

  };

  /**
   * Destroy Fold
   */
  fold.destroy = (remove = false) => {

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

  return fold;
}

/**
 * Default Options
 *
 * Merges the default options with user options. The `options` parameter
 * can be a `string` type. If options are of string type, the user initialized
 * relapse with a string selector.
 */
function $defaults (options: Options | string): Options {

  const config: Options = $object({
    persist: false,
    unique: false,
    multiple: false,
    schema: 'data-relapse',
    folding: $object({
      duration: 220,
      easing: 'ease-in-out',
      hint: true
    }),
    fading: $object({
      duration: 120,
      easing: 'linear',
      hint: true
    }),
    classes: $object({
      opened: 'opened',
      disabled: 'disabled',
      expanded: 'expanded',
      focused: 'focused'
    })
  });

  if (typeof options === 'object') {

    for (const o in options) {
      if (o === 'classes' || o === 'fading' || o === 'folding') {
        for (const c in options[o]) {
          config[o][c] = options[o][c];
        }
      } else {
        config[o] = options[o];
      }
    }

  }

  return config;

};

/**
 * Attribute Options
 *
 * Merges options defined via attribute on fold elements. Attribute
 * options will overwrite options defined via initialization.
 */
function $attrs (config: Options, attrs: NamedNodeMap) {

  const slice = config.schema.length + 1;

  // Lets loop over all the attributes contained on the element
  // and apply configuration to ones using valid annotations.
  for (const { nodeName, nodeValue } of attrs) {

    if (!nodeName.startsWith(config.schema)) continue;

    const prop = nodeName.slice(slice);
    const value = nodeValue.trim();

    if (prop === 'persist' || prop === 'multiple' || prop === 'unique') {
      if (value === 'true' || value === 'false') {
        config[prop] = value === 'true';
      } else {
        throw new TypeError(
          `Relapse: Invalid ${nodeName} attribute value. Boolean expected, received: ${value}`
        );
      }
    } else if (prop.endsWith('-duration')) {
      if (isNaN(+value)) {
        throw new TypeError(
          `Relapse: Invalid ${nodeName} attribute value. Number expected, received: ${value}`
        );
      } else {
        const [ name, child ] = prop.split('-');
        config[name][child] = +value;
      }
    } else if (prop.startsWith('class-') || prop.endsWith('-easing')) {
      const [ name, child ] = prop.split('-');
      config[name][child] = value;
    }
  }

  return $object(config);

};

function $instance (element: HTMLElement, config: Options) {

  /**
   * Key Identifier
   *
   * An import reference used to identify different fold structures
   */
  let key: string = element.getAttribute(config.schema);

  if ((key === null || key === '')) {
    if (!element.hasAttribute('id')) {
      key = element.id;
    } else {
      key = Math.random().toString(36).slice(2);
      element.setAttribute(config.schema, key);
    }
  };

  // Lets ensure that the identifier provided is not already in use
  if (window.relapse.has(key)) {
    if (window.relapse.get(key).config.unique) return;
    throw new Error(`Relapse: Identifier must be unique! An instance exists for: ${key} `);
  }

  /**
   * Create the accordion "scope" which describes each instances
   * of a relapse collapse in the DOM.
   */
  const scope: Scope = window.relapse.set(key, $object<Scope>(
    {
      element,
      key,
      config: $attrs(config, element.attributes),
      folds: new Folds(),
      id: `R${window.relapse.size}`,
      semantic: element.firstElementChild.nodeName === 'DETAILS',
      openCount: 0,
      active: -1,
      events: $object()
    }
  )).get(key);

  // Set aria multi-selectable attribute
  scope.element.ariaMultiSelectable = `${scope.config.multiple}`;

  /**
   * Element Children
   */
  const children = element.children;

  /**
   * The number of children
   */
  const length = children.length;

  /**
   * The next iteree of children
   */
  const next = scope.semantic ? 1 : 2;

  /**
   * Generate event emitted to call on inner elements
   */
  const event = $events(scope.events);

  /**
   * Deconstructed classes for quicker lookip, micro-op
   */
  const { classes } = scope.config;

  /* -------------------------------------------- */
  /* FOLDS                                        */
  /* -------------------------------------------- */

  /**
   * Iteree starting point
   *
   * When semantic structure, begin from first node, whereas basic structure we begin for second.
   */
  let i = 0;

  do {

    const fold: Fold = $object<Fold>({ index: scope.folds.length });

    fold.id = `${scope.id}F${fold.index}`;
    let isAttrOpen: boolean = false;

    if (scope.semantic) {

      fold.wrapper = children[i] as HTMLElement;

      if (fold.wrapper.nodeName !== 'DETAILS') {
        const wrap = fold.wrapper;
        throw new Error(
          `Relapse: Invalid markup, expected "<details>" received <${wrap.nodeName}> in: ${wrap.innerHTML}`
        );
      }

      fold.button = fold.wrapper.firstElementChild as HTMLElement;
      fold.element = fold.button.nextElementSibling as HTMLElement;

      isAttrOpen = fold.wrapper.hasAttribute('open');

      if (scope.config.folding.hint) {
        fold.wrapper.style.setProperty('will-change', 'height');
      }

      if (scope.config.fading.hint) {
        fold.element.style.setProperty('will-change', 'opacity,visibility');
      }

    } else {

      fold.button = children[i] as HTMLElement;
      fold.element = children[i + 1] as HTMLElement;
      fold.wrapper = fold.element;

      const hint: string[] = [];
      if (scope.config.folding.hint) hint.push('max-height');
      if (scope.config.fading.hint) hint.push('opacity', 'visibility');
      if (hint.length > 0) fold.element.style.setProperty('will-change', hint.join());

    }

    fold.wrapper.setAttribute('role', 'region');

    const isDisabled = fold.button.classList.contains(classes.disabled);
    const isOpened = fold.button.classList.contains(classes.opened);
    const isExpanded = fold.element.classList.contains(classes.expanded);

    if (fold.button.ariaExpanded === 'true' || isOpened || isExpanded || isAttrOpen) {

      // class name and attribute align
      if (!isOpened) {
        fold.button.classList.add(classes.opened);
      }

      if (fold.button.ariaExpanded !== 'true') {
        fold.button.ariaExpanded = 'true';
      }

      if (!isExpanded) {
        fold.element.classList.add(classes.expanded);
      }

      if (isDisabled) {
        fold.button.classList.add(classes.disabled);
        fold.button.ariaDisabled = 'true';
        fold.disabled = true;
      }

      fold.expanded = true;

    } else if (fold.button.ariaDisabled === 'true' || isDisabled) {

      fold.disabled = true;

      // class name and attribute align
      if (!isDisabled) {
        fold.button.classList.add(classes.disabled);
      }

      if (fold.button.ariaDisabled !== 'true') {
        fold.button.ariaDisabled = 'true';
      }

      if (isExpanded) {
        fold.expanded = true;
        fold.button.ariaExpanded = 'true';
      } else {
        fold.expanded = false;
        fold.button.ariaExpanded = 'false';
      }

      if (isOpened) {
        fold.button.classList.remove(classes.opened);
      }

    } else {

      fold.expanded = false;
      fold.disabled = false;

      fold.button.ariaExpanded = 'false';
      fold.button.ariaDisabled = 'false';

    }

    if (!fold.button.hasAttribute('id')) {
      fold.button.id = `${scope.id}B${fold.index}`;
    }

    if (!fold.element.hasAttribute('id')) {
      fold.element.id = `${scope.id}C${fold.index}`;
    }

    fold.button.setAttribute('aria-controls', fold.element.id);
    fold.element.setAttribute('aria-labelledby', fold.button.id);

    if (fold.expanded) {
      scope.openCount = scope.openCount + 1;
      if (scope.semantic) {
        fold.height = fold.button.offsetHeight + fold.element.offsetHeight;
        fold.wrapper.style.setProperty('height', `${fold.height}px`);
      } else {
        fold.height = fold.element.scrollHeight;
        fold.wrapper.style.setProperty('max-height', '0');
      }
    } else {
      if (scope.semantic) {
        fold.height = fold.button.offsetHeight;
        fold.wrapper.style.setProperty('height', `${fold.height}px`);
      } else {
        fold.height = 0;
        fold.element.style.setProperty('max-height', '0');
      }
    }

    scope.folds.push($folds(scope, event, fold));
    scope.folds.refs[fold.element.id] = scope.folds.length - 1;

    i = i + next;

  } while (i < length);

  /* -------------------------------------------- */
  /* METHODS                                      */
  /* -------------------------------------------- */

  const $find = (method: 'open' | 'close' | 'destroy', fold: string | number, remove = false) => {

    if (typeof fold === 'number') {

      return method.charCodeAt(0) === 100
        ? scope.folds[fold][method](remove as never)
        : scope.folds[fold][method]();

    } else if (typeof fold === 'string') {

      for (const f of scope.folds.values()) {
        if (f.button.getAttribute(`${scope.config.schema}-fold`) === fold) {

          return method.charCodeAt(0) === 100
            ? f[method](remove as never)
            : f[method]();

        }
      }
    }

    throw new Error(`Relapse: Fold does not exist: "${fold}"`);

  };

  scope.on = event.on as Events<Readonly<Scope>, Fold>;
  scope.off = event.off;
  scope.collapse = (fold: string | number) => $find('close', fold);
  scope.expand = (fold: string | number) => $find('open', fold);
  scope.destroy = (fold?: string | number, remove = false) => {

    if (typeof fold === 'undefined') {
      for (const fold of scope.folds) fold.destroy();
    } else {
      $find('destroy', fold, remove);
    }

    scope.element.removeAttribute('aria-multiselectable');
    event.emit('destroy', scope);
    window.relapse.delete(key);

  };

}

/* -------------------------------------------- */
/* RELAPSE                                      */
/* -------------------------------------------- */

/**
 * Relapse
 */
const relapse = function relapse (selector?: string | HTMLElement | Options, options?: Options) {

  // Create global store reference
  if (!(window.relapse instanceof Map)) window.relapse = new Map();

  /**
   * Selector passed, single instance should apply
   */
  const single = typeof selector === 'object' && 'tagName' in selector;

  // Ensure the selector is not a NodeList
  if (single && selector instanceof NodeList) {
    throw TypeError('Relapse: Invalid NodeList selector, provide string or HTMLElement');
  }

  /**
   * Merged defaults with provided options @see {@link Options}
   */
  const config = $defaults(single ? options : selector);

  /**
   * Accordion wrapper element reference
   */
  let element: HTMLElement = null;

  /**
   * Multiple occurances
   */

  if (single) {

    element = typeof selector === 'string'
      ? document.body.querySelector(selector)
      : selector;

    if (element !== null) {
      $instance(element, config); // store the instance
    }

  } else {

    /**
     * Obtain all relapse occurances in the DOM
     */
    const elements = document.body.querySelectorAll<HTMLElement>(`[${config.schema}]`);

    // Lets capture all occurances in and set and filter out later on
    // incase they are fold nested occurances
    if (elements.length > 0) {
      for (const node of elements) $instance(node, config);
    }
  }

  const scopes = Array.from(window.relapse.values());

  if (window.relapse.size === 1) return scopes[0];

  return single ? scopes[scopes.length - 1] : scopes;

};

relapse.get = (id?: string) => id ? window.relapse.get(id) : window.relapse;

export default relapse;
