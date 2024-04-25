/* eslint-disable no-unused-vars */
import { Relapse, Fold, Options, EventNames, Events, Methods } from '../index';

const { isArray, from } = Array;

/**
 * Relapse Store
 *
 * This is a global store, Map reference which will maintain all
 * relapse instances
 */
const $r: Map<string, Relapse> = new Map();

/**
 * Objects (Utility)
 *
 * Utility for generating an object without Prototype.
 */
const $o = <T> (object?: Partial<T>, o = Object.create(null)): T => object ? Object.assign(o, object) : o;

/**
 * Folds
 *
 * Extends the native Array `[]` to support additional methods.
 */
class Folds extends Array<Fold> {

  ref: { [id: string]: number } = $o();

  get = (id?: string | number) => {

    const type = typeof id;

    if (type === 'number') return this[id];
    if (type === 'string') {
      if (id in this.ref) return this[this.ref[id]];
      console.error(`Relapse: Unknown fold id: ${id}`);
    }

    return this;

  };

}

const enum AriaKey {
  TRUE = 1,
  FALSE
}

/* -------------------------------------------- */
/* SUGARS FOR SMALLER DIST SIZE                 */
/* -------------------------------------------- */

const setProperty = (el: HTMLElement, key: string, value: string) => (
  el.style.setProperty(key, value)
);
const addClass = (el: HTMLElement, value: string) => (
  el.classList.add(value)
);
const removeClass = (el: HTMLElement, value: string) => (
  el.classList.remove(value)
);
const setAriaExpanded = (el: HTMLElement, value = AriaKey.TRUE) => {
  el.ariaExpanded = value === AriaKey.TRUE ? 'true' : 'false';
};
const setAriaDisabled = (el: HTMLElement, value = AriaKey.TRUE) => {
  const v = value === AriaKey.TRUE ? 'true' : 'false';
  if (el.tagName === 'BUTTON') {
    if (el.hasAttribute('aria-disabled')) el.removeAttribute('aria-disabled');
    if (value === AriaKey.TRUE) {
      el.setAttribute('disabled', v);
    } else if (el.hasAttribute('disabled')) {
      el.removeAttribute('disabled');
    }
  } else {
    el.ariaDisabled = v;
  }
};

/* -------------------------------------------- */
/* API                                          */
/* -------------------------------------------- */

function setInstance (element: HTMLElement, config: Options) {

  let el: HTMLElement = element;

  /**
   * Key Identifier
   *
   * An import reference used to identify different fold structures
   */
  let id: string = el.getAttribute(config.schema);

  if (id === null || id === '') {
    id = el.hasAttribute('id') ? el.id : `R${$r.size}`;
    el.setAttribute(config.schema, id);
  };

  // Lets ensure that the identifier provided is not already in use
  // We will throw, if identifier is not unique, unless unique is false
  if ($r.has(id)) {
    if ($r.get(id).options.unique === false) return;
    throw new Error(`Relapse: Instance already exists with id: ${id} `);
  }

  /**
   * Merge attribute configurations
   */
  const options = setAttrs(config, el.attributes);

  /**
   * Set the Folds listing
   */
  const folds = new Folds();

  /**
   * Create the accordion "scope" which describes each instances of a relapse collapse in the DOM.
   */
  const scope: Relapse = $r.set(id, <Relapse>{
    id,
    semantic: el.firstElementChild.nodeName === 'DETAILS',
    openCount: 0,
    status: 1,
    active: NaN,
    events: $o(),
    get folds () { return folds; },
    get options () { return options; },
    get element () { return el; },
    set element (e) {
      el = e;
      id = el.getAttribute(config.schema);
    }
  }).get(id);

  /**
   * Generate event emitted to call on inner elements
   */
  const event = setEvents(scope.events);

  /**
   * The number of children
   */
  const length = el.children.length;

  /**
   * The next iteree of children
   */
  const next = scope.semantic ? 1 : 2;

  /**
   * Deconstructed classes for quicker lookip, micro-op
   */
  const cls = scope.options.classes;

  /* -------------------------------------------- */
  /* FOLDS                                        */
  /* -------------------------------------------- */

  /**
   * When semantic structure, begin from first node, whereas basic structure we begin for second.
   */
  let i: number = 0;

  do {

    /* -------------------------------------------- */
    /* INSTANCE                                     */
    /* -------------------------------------------- */

    /**
     * Fold Instance
     */
    const fold: Fold = $o<Fold>({ index: scope.folds.length, locked: false });

    /* -------------------------------------------- */
    /* SCOPES                                       */
    /* -------------------------------------------- */

    /**
     * Whether element has `open` or `hidden` attribute
     */
    let isOpen: boolean = false;

    /**
     * The button element, i.e: will be `<summary>` in semantic.
     */
    let button: HTMLElement;

    /**
     * The fold panel element, i.e: will be next sibling in semantic
     */
    let element: HTMLElement;

    /**
     * Either the `<details>` element or the same as `element` above.
     */
    let wrapper: HTMLElement;

    /* -------------------------------------------- */
    /* BEGIN                                        */
    /* -------------------------------------------- */

    const isSemantic = scope.semantic;

    if (isSemantic) {

      wrapper = el.children[i] as HTMLElement;

      if (wrapper.nodeName !== 'DETAILS') {
        throw new Error(`Relapse: Invalid markup on "${scope.id}", expected: <details>`);
      }

      button = wrapper.firstElementChild as HTMLElement;
      element = button.nextElementSibling as HTMLElement;
      isOpen = wrapper.hasAttribute('open');

    } else {

      button = el.children[i] as HTMLElement;
      element = wrapper = el.children[i + 1] as HTMLElement;

      if (element.hasAttribute('hidden')) {
        element.removeAttribute('hidden');
      } else if (element.firstElementChild.hasAttribute('hidden')) {
        element.firstElementChild.removeAttribute('hidden');
      }

    }

    const isOpened = button.classList.contains(cls.opened);
    const isExpanded = element.classList.contains(cls.expanded);

    let isDisabled = button.classList.contains(cls.disabled);

    if (button.ariaExpanded === 'true' || isOpen || isOpened) {

      if (!isOpened && !isDisabled) addClass(button, cls.opened);
      if (!isExpanded) addClass(element, cls.expanded);
      if (!isSemantic) {
        if (button.ariaExpanded !== 'true') setAriaExpanded(button);
        if (button.ariaDisabled === 'true') {
          setAriaDisabled(button);
          isDisabled = true;
        }
      }

      if (isDisabled) {
        addClass(button, cls.disabled);
        fold.disabled = true;
        fold.locked = true;
      }

      fold.expanded = true;

    } else if (button.ariaDisabled === 'true' || isDisabled) {

      if (!isDisabled) addClass(button, cls.disabled);
      if (isOpened) removeClass(button, cls.opened);

      fold.expanded = (isExpanded || isOpen) === true;
      fold.disabled = true;
      fold.locked = true;

      if (!isSemantic) {
        if (button.ariaDisabled !== 'true') setAriaDisabled(button);
        setAriaExpanded(button, fold.expanded ? AriaKey.TRUE : AriaKey.FALSE);
      }

    } else {

      fold.expanded = false;
      fold.disabled = false;

      if (!isSemantic) {
        setAriaExpanded(button, AriaKey.FALSE);
        setAriaDisabled(button, AriaKey.FALSE);
      }

    }

    fold.id = `${scope.id}-fold-${fold.index}`;

    if (!button.hasAttribute('id')) button.id = `${scope.id}-button-${fold.index}`;
    if (!element.hasAttribute('id')) element.id = `${scope.id}-content-${fold.index}`;

    button.setAttribute('aria-controls', element.id);
    element.setAttribute('aria-labelledby', button.id);

    if (fold.expanded) {

      button.tabIndex = -1;
      scope.openCount = scope.openCount + 1;

      if (scope.options.multiple === false && scope.openCount === 2) {
        console.warn(`Relapse: More than 1 fold is expanded but "multiple" is set to false on: ${scope.id}`);
      }

      if (isSemantic) {
        fold.height = button.offsetHeight + element.offsetHeight;
        setProperty(wrapper, 'height', 'auto');
      } else {
        fold.height = element.scrollHeight;
        setProperty(wrapper, 'max-height', 'inherit');
      }

    } else {

      button.tabIndex = 0;

      if (isSemantic) {
        fold.height = button.offsetHeight;
        setProperty(wrapper, 'height', 'auto');
      } else {
        fold.height = 0;
        setProperty(element, 'max-height', '0');
        setProperty(element, 'overflow', 'hidden');
      }
    }

    fold.button = button;
    fold.wrapper = wrapper;
    fold.element = element;

    setFold(fold, scope, event);

    i = i + next;

  } while (i < length);

  /* -------------------------------------------- */
  /* METHODS                                      */
  /* -------------------------------------------- */

  scope.on = event.on as Events<Readonly<Relapse>, Fold, number>;
  scope.off = event.off as Events<Readonly<Relapse>, Fold, void>;

  scope.collapse = (fold: string | number = scope.active) => {
    if (isNaN(fold as number)) return;
    folds.get(fold).close(fold);
  };

  scope.expand = (fold: string | number = scope.active) => {
    if (isNaN(fold as number)) return;
    folds.get(fold).open(fold);
  };

  scope.destroy = () => {
    folds.forEach(fold => fold.destroy());
    event.emit('destroy', scope);
    $r.delete(id);
  };

  scope.reinit = () => {
    folds.forEach(fold => fold.destroy());
    setInstance(element, config);
  };

}

function setEvents (events: { [K in EventNames]?: Events<Readonly<Relapse>, Fold>[] }) {

  const event = $o<any>();

  event.on = (name: EventNames, cb: Events<Readonly<Relapse>, Fold>, binding?: any) => {
    if (!events[name]) events[name] = [];
    return events[name].push(binding ? cb.bind(binding) : cb) - 1;
  };

  event.off = (name: EventNames, cb: Events<Readonly<Relapse>, Fold> | number) => {

    const event = events[name];
    const warn = `Relapse: Removed ${name} event listener`;

    if (event && typeof cb === 'number') {
      event.splice(cb, 1);
      console.warn(`${warn} (id: ${cb})`);
      if (event.length === 0) delete event[name];
    } else {

      /**
       * Reference of all events that should not be removed
       */
      const live = [];

      if (event && typeof cb === 'function') {
        for (let i = 0, s = event.length; i < s; i++) {
          if (event[i] !== cb) {
            live.push(event[i]);
          } else {
            console.warn(`${warn} (id: ${i})`);
          }
        }
      }

      if (live.length > 0) {
        event[name] = live;
      } else {
        delete event[name];
      }
    }
  };

  event.emit = (name: EventNames, scope: Relapse, fold?: Fold): boolean => {

    const event = events[name] || [];

    let prevent: boolean = null;

    for (let i = 0, s = event.length; i < s; i++) {
      const returns = event[i].call(scope, fold);
      if (prevent === null && returns === false) prevent = true;
    }

    return prevent;

  };

  return event;

};

function setFold (fold: Fold, scope: Relapse, event: ReturnType<typeof setEvents>) {

  const cl = scope.options.classes;
  const fe = scope.options.fade;
  const fc = $o({ easing: fe.easing, duration: fe.duration * 2 });

  /* -------------------------------------------- */
  /* PRIVATES                                     */
  /* -------------------------------------------- */

  /**
   * Active Fold
   */
  const getFold = (id: number | string) => {

    if (typeof id !== 'number') {
      if (scope.active !== fold.index) scope.active = fold.index;
      return fold;
    }

    if (scope.folds.get(id)) {
      scope.active = fold.index;
      return scope.folds.get(id);
    } else {
      throw new Error(`Relapse: No fold exists using id: "${id}"`);
    }

  };

  /**
   * Active Count
   */
  const getCount = () => scope.folds.filter(({ expanded }) => expanded).length;

  /**
   * Fading Animation
   */
  const onFading = (el: HTMLElement, opacity: [string, string], visibility: [string, string]) => {

    setProperty(el, 'will-change', 'opacity,visibility');
    const animate = el.animate({ opacity, visibility }, opacity[0] === '1' ? fc : fe);
    animate.onfinish = () => {
      setProperty(el, 'opacity', opacity[1]);
      setProperty(el, 'visibility', visibility[1]);
      el.style.removeProperty('will-change');
    };

  };

  /**
   * Folding Animation
   */
  const onFolding = (el: HTMLElement, height: [string, string], fn: () => void) => {
    scope.status = 2;
    const animate = el.animate(scope.semantic ? { height } : { maxHeight: height }, scope.options.fold);
    animate.onfinish = fn;
  };

  /**
   * Fold Collapse
   */
  const doCollapse = (focus: Fold) => {

    if (focus.disabled) return;

    const b = focus.button;
    const w = focus.wrapper;
    const e = focus.element;

    setProperty(w, 'overflow', 'hidden');

    if (scope.semantic) {
      focus.height = b.offsetHeight;
      setProperty(w, 'will-change', 'height');
    } else {
      focus.height = 0;
      setProperty(w, 'will-change', 'max-height');
    }

    const h = `${focus.height}px`;

    onFading(e, [ '1', '0' ], [ 'visible', 'hidden' ]);
    onFolding(w, [ `${w.offsetHeight}px`, h ], () => {

      if (scope.semantic) {
        setProperty(w, 'height', h);
        w.removeAttribute('open');
      } else {
        setProperty(e, 'max-height', '0');
      }

      focus.expanded = false;

      // setAriaDisabled(b, AriaKey.FALSE);
      setAriaExpanded(b, AriaKey.FALSE);
      removeClass(b, cl.opened);
      removeClass(w, cl.expanded);

      w.style.removeProperty('will-change');

      scope.openCount = getCount();
      scope.status = 1;

      event.emit('collapse', scope, focus);

    });

  };

  /**
   * Fold Expand
   */
  const doExpand = (focus: Fold) => (time: number) => {

    focus.close();

    const b = focus.button;
    const w = focus.wrapper;
    const e = focus.element;

    // setAriaDisabled(b);
    setAriaExpanded(b);

    let start: string;

    if (scope.semantic) {
      w.setAttribute('open', '');
      setProperty(w, 'will-change', 'height');
      setProperty(w, 'overflow', 'hidden');
      focus.height = b.offsetHeight + e.offsetHeight;
      start = `${b.offsetHeight}px`;
    } else {
      setProperty(w, 'will-change', 'max-height');
      focus.height = e.scrollHeight;
      start = '0px';
    }

    addClass(b, cl.opened);
    onFading(e, [ '0', '1' ], [ 'hidden', 'visible' ]);
    onFolding(w, [ start, `${focus.height}px` ], () => {

      if (scope.semantic) {
        setProperty(w, 'height', 'auto');
      } else {
        setProperty(w, 'max-height', 'inherit');
      }

      w.style.removeProperty('overflow');
      w.style.removeProperty('will-change');

      addClass(e, cl.expanded);

      focus.expanded = true;
      scope.openCount = getCount();
      scope.status = 1;

      if (scope.options.persist && scope.openCount > 1) focus.disable();

      event.emit('expand', scope, focus);

    });
  };

  /* -------------------------------------------- */
  /* PUBLIC                                       */
  /* -------------------------------------------- */

  fold.close = (index: number) => {

    let focus = getFold(index);

    if (scope.options.multiple) {
      if (scope.options.persist === true && scope.openCount > 1) {
        doCollapse(focus);
      } else if (scope.options.persist === false && focus.expanded === true) {
        doCollapse(focus);
      }
    } else {
      for (const node of scope.folds) {
        if (node.expanded === true && node.locked === false) {
          if (scope.options.persist && node.index === focus.index) break;
          doCollapse(node);
          focus = node;
          break;
        }
      }

    }

    focus.enable();
    scope.openCount = getCount();

  };

  fold.focus = () => {

    scope.active = fold.index;
    fold.button.focus({ preventScroll: true });

    event.emit('focus', scope, fold);

  };

  fold.enable = (index?: number) => {

    const focus = getFold(index);

    if (focus.disabled && focus.locked === false) {
      focus.disabled = false;
      setAriaDisabled(focus.button, AriaKey.FALSE);
      removeClass(focus.button, cl.disabled);
    }
  };

  fold.disable = (index?: number) => {

    const focus = getFold(index);

    if (!focus.disabled) {
      if (focus.expanded) {
        if (scope.options.persist) {
          focus.disabled = true;
          setAriaDisabled(focus.button);
        }
      } else {
        focus.close();
        focus.disabled = true;
        setAriaDisabled(focus.button);
        addClass(focus.button, cl.disabled);
      }
    }
  };

  fold.open = (index?: number) => {

    const focus = getFold(index);

    if (scope.status === 2 || focus.expanded) return;

    requestAnimationFrame(doExpand(focus));

  };

  fold.toggle = (e) => {
    if (scope.semantic) e.preventDefault();
    if (scope.status === 2 || event.emit('toggle', scope, fold) === false) return;
    return fold.expanded ? fold.close() : fold.open();
  };

  fold.destroy = () => {

    fold.button.removeEventListener('click', fold.toggle);
    fold.button.removeEventListener('focus', fold.focus);
    fold.button.removeEventListener('blur', fold.blur);

  };

  fold.button.addEventListener('click', fold.toggle);
  fold.button.addEventListener('focus', fold.focus);

  scope.folds.push(fold);
  scope.folds.ref[fold.element.id] = scope.folds.length - 1;

}

function setSchema (options: Options | string) {

  return typeof options === 'object' && 'schema' in options
    ? options.schema
    : '[data-relapse]';

}

function setDefaults (options: Options | string): Options {

  const config: Options = $o({
    persist: false,
    unique: false,
    multiple: false,
    schema: 'data-relapse',
    fold: $o({
      duration: 200,
      easing: 'ease-in-out'
    }),
    fade: $o({
      duration: 200 - (200 / 2.5),
      easing: 'linear'
    }),
    classes: $o({
      opened: 'opened',
      disabled: 'disabled',
      expanded: 'expanded'
    })
  });

  if (typeof options === 'object') {

    for (const o in options) {
      if (o === 'classes' || o === 'fade' || o === 'fold') {
        for (const c in options[o]) config[o][c] = options[o][c];
      } else {
        config[o] = options[o];
      }
    }

    if ((
      'fade' in options &&
      'duration' in options.fade &&
      options.fade.duration !== config.fade.duration) === false) {

      if (config.fold.duration !== 200) {
        config.fade.duration = config.fold.duration - (config.fold.duration / 2.5);
      }

    }

  }

  return config;

};

function setAttrs (config: Options, attrs: NamedNodeMap) {

  const slice = config.schema.length + 1;
  const clone = $o<Options>({ fold: $o(), fade: $o(), classes: $o() });

  // Lets loop over all the attributes contained on the element
  // and apply configuration to ones using valid annotations.
  for (const { nodeName, nodeValue } of attrs) {

    if (!nodeName.startsWith(config.schema)) continue;

    const prop = nodeName.slice(slice); // slice "data-relapse-" portion

    if (prop === 'schema') {
      console.warn('Relapse: The "schema" option cannot be defined via attribute');
      continue;
    }

    const value = nodeValue.trim();
    const error = `Invalid ${nodeName} attribute value.`;

    if (prop === 'persist' || prop === 'multiple' || prop === 'unique') {
      if (value === 'true' || value === 'false') {
        clone[prop] = value === 'true';
      } else {
        throw new TypeError(`Relapse: ${error}. Boolean expected, received: ${value}`);
      }
    } else if (prop === 'fold-duration' || prop === 'fade-duration') {
      if (isNaN(+value)) {
        throw new TypeError(`Relapse: ${error}. Number expected, received: ${value}`);
      } else {
        const [ name, child ] = prop.split('-');
        clone[name][child] = +value;
      }
    } else if (prop.startsWith('class-') || prop === 'fold-easing' || prop === 'fade-easing') {
      const [ name, child ] = prop.split('-');
      clone[name][child] = value;
    }
  }

  if ((
    'fade' in clone &&
    'duration' in clone.fade &&
    clone.fade.duration !== config.fade.duration) === false && (
    'fold' in clone &&
    'duration' in clone.fold &&
    clone.fold.duration !== config.fold.duration
  )) {

    clone.fade.duration = clone.fold.duration - (clone.fold.duration / 2.5);

  }

  for (const o in clone) {
    if (o === 'fold' || o === 'classes' || o === 'fade') {
      for (const c in clone[o]) config[o][c] = clone[o][c];
    } else {
      config[o] = clone[o];
    }
  }

  return config;
};

/* -------------------------------------------- */
/* RELAPSE                                      */
/* -------------------------------------------- */

const relapse = function relapse (selector?: string | HTMLElement | Options, options?: Options) {

  // ensure dom is ready
  if (document.readyState === 'loading') {
    addEventListener('DOMContentLoaded', () => relapse(selector, options));
    return;
  }

  /**
   * Selector passed, single instance apply
   */
  const single = typeof selector === 'object' && 'tagName' in selector;

  // Ensure the selector is not a NodeList
  if (single && selector instanceof NodeList) {
    throw TypeError('Relapse: Invalid NodeList selector. Provide string or HTMLElement');
  }

  if (single) {

    const el = typeof selector === 'string'
      ? document.body.querySelector(selector)
      : selector;

    if (el !== null) setInstance(el, setDefaults(options));

  } else {

    document.body
      .querySelectorAll<HTMLElement>(setSchema(selector))
      .forEach(element => (
        setInstance(
          element,
          setDefaults(selector)
        )
      ));

  }

  const instances = from($r.values());

  return single ? instances[instances.length - 1] : instances;

};

// @ts-expect-error
relapse.version = VERSION;

relapse.each = (cb: (scope: Relapse, id: string) => void | false) => {

  for (const [ id, instance ] of $r) {
    if (cb(instance, id) === false) break;
  }

};

relapse.reinit = (id?: string | string[]) => {

  const get = relapse.get(id);
  const instances = isArray(get) ? get : [ get ];

  for (const instance of instances) {
    const { id, options } = instance;
    instance.destroy();
    relapse(`#${id}`, options);
  }

};

relapse.has = (id?: string | string[]) => (

  id ? (isArray(id) ? id : [ id ]).every($r.has) : $r.size > 0

);

relapse.destroy = (id?: string | string[]) => {

  const get = relapse.get(id);
  const instances = isArray(get) ? get : [ get ];
  for (const instance of instances) instance.destroy();

};

relapse.get = (id?: string | string[]) => (

  typeof id === 'string'
    ? $r.has(id) ? $r.get(id) : null
    : isArray(id)
      ? id.filter(x => $r.has(x)).map(x => $r.get(x))
      : from($r.values())

);

/* -------------------------------------------- */
/* GLOBAL                                       */
/* -------------------------------------------- */

if (!window.relapse) {
  Object.defineProperty(window, 'relapse', {
    get () {
      return relapse;
    }
  });
}

export default relapse;
