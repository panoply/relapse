/* eslint-disable no-unused-vars */
import { Relapse, Fold, Options, EventNames, Events, Methods } from '../index';

const { isArray, from } = Array;

/**
 * Relapse Store
 *
 * This is a global store, Map reference which will maintain all
 * relapse instances
 */
const $R: Map<string, Relapse> = new Map();

/**
 * Objects (Utility)
 *
 * Utility for generating an object without Prototype.
 */
const $O = <T> (object?: Partial<T>, o = Object.create(null)): T => object ? Object.assign(o, object) : o;

/**
 * Folds
 *
 * Extends the native Array `[]` to support additional methods.
 */
class Folds extends Array<Fold> {

  ref: { [id: string]: number } = $O();

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

/* -------------------------------------------- */
/* API                                          */
/* -------------------------------------------- */

function setInstance (el: HTMLElement, config: Options) {

  /**
   * Key Identifier
   *
   * An import reference used to identify different fold structures
   */
  let id: string = el.getAttribute(config.schema);

  if (id === null || id === '') {
    id = el.hasAttribute('id') ? el.id : `R${$R.size}`;
    el.setAttribute(config.schema, id);
  };

  // Lets ensure that the identifier provided is not already in use
  // We will throw, if identifier is not unique, unless unique is false
  if ($R.has(id)) {
    if ($R.get(id).options.unique === false) return;
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
  const scope: Relapse = $R.set(id, <Relapse>{
    id,
    semantic: el.firstElementChild.nodeName === 'DETAILS',
    openCount: 0,
    status: 1,
    active: NaN,
    events: $O(),
    get folds () { return folds; },
    get options () { return options; },
    get element () { return el; }
  }).get(id);

  // Set aria multi-selectable attribute
  el.ariaMultiSelectable = `${scope.options.multiple}`;

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
  const { classes } = scope.options;

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
    const fold: Fold = $O<Fold>({
      index: scope.folds.length,
      locked: false
    });

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

    if (scope.semantic) {

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

    wrapper.setAttribute('role', 'region');

    const isDisabled = button.classList.contains(classes.disabled);
    const isOpened = button.classList.contains(classes.opened);
    const isExpanded = element.classList.contains(classes.expanded);

    if (button.ariaExpanded === 'true' || isOpen || isOpened) {

      if (button.ariaExpanded !== 'true') button.ariaExpanded = 'true';
      if (!isOpened && !isDisabled) button.classList.add(classes.opened);
      if (!isExpanded) element.classList.add(classes.expanded);
      if (isDisabled || button.ariaDisabled === 'true') {
        button.classList.add(classes.disabled);
        button.ariaDisabled = 'true';
        fold.disabled = true;
        fold.locked = true;
      }

      fold.expanded = true;

    } else if (button.ariaDisabled === 'true' || isDisabled) {

      if (button.ariaDisabled !== 'true') button.ariaDisabled = 'true';
      if (!isDisabled) button.classList.add(classes.disabled);
      if (isOpened) button.classList.remove(classes.opened);

      fold.expanded = (isExpanded || isOpen) === true;
      fold.disabled = true;
      fold.locked = true;

      button.ariaExpanded = String(fold.expanded);

    } else {

      fold.expanded = false;
      fold.disabled = false;

      button.ariaExpanded = 'false';
      button.ariaDisabled = 'false';

    }

    fold.id = `${scope.id}-fold-${fold.index}`;

    if (!button.hasAttribute('id')) button.id = `${scope.id}-button-${fold.index}`;
    if (!element.hasAttribute('id')) element.id = `${scope.id}-content-${fold.index}`;

    button.tabIndex = fold.index;
    button.setAttribute('aria-controls', element.id);
    element.setAttribute('aria-labelledby', button.id);

    if (fold.expanded) {

      scope.openCount = scope.openCount + 1;

      if (scope.options.multiple === false && scope.openCount === 2) {
        console.warn(`Relapse: More than 1 fold is expanded but "multiple" is set to false on: ${scope.id}`);
      }

      if (scope.semantic) {
        fold.height = button.offsetHeight + element.offsetHeight;
        wrapper.style.setProperty('height', 'auto');
      } else {
        fold.height = element.scrollHeight;
        wrapper.style.setProperty('max-height', 'inherit');
      }

    } else {

      if (scope.semantic) {
        fold.height = button.offsetHeight;
        wrapper.style.setProperty('height', 'auto');
      } else {
        fold.height = 0;
        element.style.setProperty('max-height', '0');
        element.style.setProperty('overflow', 'hidden');
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
    $R.delete(id);
  };

}

function setEvents (events: { [K in EventNames]?: Events<Readonly<Relapse>, Fold>[] }) {

  const event = $O<any>();

  event.on = (name: EventNames, cb: Events<Readonly<Relapse>, Fold>, binding?: any) => {

    if (!events[name]) events[name] = [];
    return events[name].push(binding ? cb.bind(binding) : cb) - 1;

  };

  event.off = (name: EventNames, cb: Events<Readonly<Relapse>, Fold> | number) => {

    /**
     * Select the event/s to emit
     */
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

  return event;

};

function setFold (fold: Fold, scope: Relapse, event: ReturnType<typeof setEvents>) {

  const cl = scope.options.classes;
  const fe = scope.options.fade;
  const fc = $O({
    easing: fe.easing,
    duration: fe.duration * 2
  });

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
  const getCount = () => (

    scope.folds.filter(({ expanded }) => expanded).length

  );

  /**
   * Fading Animation
   */
  const onFading = (el: HTMLElement, opacity: [string, string], visibility: [string, string]) => {

    el.style.setProperty('will-change', 'opacity,visibility');

    const animate = el.animate(
      { opacity, visibility },
      opacity[0] === '1' ? fc : fe
    );

    animate.onfinish = () => {

      el.style.setProperty('opacity', opacity[1]);
      el.style.setProperty('visibility', visibility[1]);
      el.style.removeProperty('will-change');

    };

  };

  /**
   * Folding Animation
   */
  const onFolding = (el: HTMLElement, height: [string, string], callback: () => void) => {

    scope.status = 2;

    const animate = el.animate(
      scope.semantic
        ? { height }
        : { maxHeight: height },
      scope.options.fold
    );

    animate.onfinish = callback;

  };

  /**
   * Fold Collapse
   */
  const doCollapse = (focus: Fold) => {

    if (focus.disabled) return;

    const b = focus.button;
    const w = focus.wrapper;
    const e = focus.element;

    w.style.setProperty('overflow', 'hidden');

    if (scope.semantic) {
      focus.height = b.offsetHeight;
      w.style.setProperty('will-change', 'height');
    } else {
      focus.height = 0;
      w.style.setProperty('will-change', 'max-height');
    }

    onFading(e, [ '1', '0' ], [ 'visible', 'hidden' ]);
    onFolding(w, [ `${w.offsetHeight}px`, `${focus.height}px` ], () => {

      if (scope.semantic) {
        w.style.setProperty('height', `${focus.height}px`);
        w.removeAttribute('open');
      } else {
        e.style.setProperty('max-height', '0');
      }

      focus.expanded = false;

      b.ariaDisabled = 'false';
      b.ariaExpanded = 'false';
      b.classList.remove(cl.opened);
      w.classList.remove(cl.expanded);
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

    b.ariaDisabled = 'true';
    b.ariaExpanded = 'true';

    let start: string;

    if (scope.semantic) {
      w.setAttribute('open', '');
      w.style.setProperty('will-change', 'height');
      w.style.setProperty('overflow', 'hidden');
      focus.height = b.offsetHeight + e.offsetHeight;
      start = `${b.offsetHeight}px`;
    } else {
      w.style.setProperty('will-change', 'max-height');
      focus.height = e.scrollHeight;
      start = '0px';
    }

    b.classList.add(cl.opened);

    onFading(e, [ '0', '1' ], [ 'hidden', 'visible' ]);
    onFolding(w, [ start, `${focus.height}px` ], () => {

      if (scope.semantic) {
        w.style.setProperty('height', 'auto');
      } else {
        e.style.setProperty('max-height', 'inherit');
      }

      w.style.removeProperty('overflow');
      w.style.removeProperty('will-change');

      e.classList.add(cl.expanded);

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

  /**
   * Fold Close
   */
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

  /**
   * Button Focus
   */
  fold.focus = () => {

    scope.active = fold.index;
    fold.button.focus({ preventScroll: true });

    event.emit('focus', scope, fold);

  };

  /**
   * Button Enable
   */
  fold.enable = (index?: number) => {

    const focus = getFold(index);

    if (focus.disabled && focus.locked === false) {
      focus.disabled = false;
      focus.button.ariaDisabled = 'false';
      focus.button.classList.remove(cl.disabled);
    }
  };

  /**
   * Button Disable
   */
  fold.disable = (index?: number) => {

    const focus = getFold(index);

    if (!focus.disabled) {
      if (focus.expanded) {
        if (scope.options.persist) {
          focus.disabled = true;
          focus.button.ariaDisabled = 'true';
        }
      } else {
        focus.close();
        focus.disabled = true;
        focus.button.ariaDisabled = 'true';
        focus.button.classList.add(cl.disabled);
      }
    }
  };

  /**
   * Open Fold
   */
  fold.open = (index?: number) => {

    const focus = getFold(index);
    if (scope.status === 2 || focus.expanded) return;

    requestAnimationFrame(doExpand(focus));

  };

  /**
   * Fold Toggle
   */
  fold.toggle = (e) => {

    if (scope.semantic) e.preventDefault();
    if (scope.status === 2 || event.emit('toggle', scope, fold) === false) return;

    return fold.expanded ? fold.close() : fold.open();

  };

  /**
   * Fold Destory
   */
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

  const config: Options = $O({
    persist: false,
    unique: false,
    multiple: false,
    schema: 'data-relapse',
    fold: $O({
      duration: 200,
      easing: 'ease-in-out'
    }),
    fade: $O({
      duration: 200 - (200 / 2.5),
      easing: 'linear'
    }),
    classes: $O({
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
  const clone = $O<Options>({
    fold: $O(),
    fade: $O(),
    classes: $O()
  });

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

    document.body.querySelectorAll<HTMLElement>(setSchema(selector)).forEach(element => (
      setInstance(
        element,
        setDefaults(selector)
      )
    ));

  }

  const instances = from($R.values());

  return single
    ? instances[instances.length - 1]
    : instances;

};

// @ts-expect-error
relapse.version = VERSION;

relapse.each = (cb: (scope: Relapse, id: string) => void) => (

  $R.forEach(cb)

);

relapse.has = (id: string | string[]) => (

  isArray(id) ? id : [ id ].every($R.has)

);

relapse.get = (id?: string | string[]) => (

  typeof id === 'string'
    ? $R.has(id) ? $R.get(id) : null
    : isArray(id)
      ? id.filter(x => $R.has(x)).map(x => $R.get(x))
      : from($R.values())

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
