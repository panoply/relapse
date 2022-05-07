import { right, down, locked } from './icons';
import { IScope, IFold, IOptions } from 'types';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window { accordion: { [id: string]: IScope } }
}

/**
 * Event Emitter
 *
 * The emitted events for the accordion.
 */
const $events = (events: IScope['events']) => ({

  emit: (name: string, scope: IScope, ...args: any[]) => {

    const event = events[name] || [];
    const length = event.length;

    for (let i = 0; i < length; i++) event[i].apply(scope, args);

  },

  on: (name: string, callback: (folds?: IFold) => void) => {

    if (!events[name]) events[name] = [];

    events[name].push(callback);

  },

  off: (name: string, callback: () => void) => {

    const live = [];
    const event = events[name];

    if (event && callback) {
      let i = 0;
      const len = event.length;
      for (; i < len; i++) if (event[i] !== callback) live.push(event[i]);
    }

    if (live.length) {
      event[name] = live;
    } else {
      delete event[name];
    }
  }
});

/**
 * Accordion Folds
 */
const $folds = (scope: IScope, fold: IFold, event: ReturnType<typeof $events>): IFold => {

  const config = scope.config;

  if (config.aria) {
    fold.button.setAttribute('aria-controls', fold.content.id);
    fold.button.setAttribute('aria-expanded', String(fold.opened));
    fold.button.setAttribute('aria-disabled', String(fold.disabled));
    fold.content.setAttribute('role', 'region');
    fold.content.setAttribute('aria-labelledby', fold.button.id);
  }

  /**
   * Fold Opened
   *
   * @private
   */
  const opened = () => {

    fold.content.style.height = 'auto';
    fold.content.classList.add('opened');
    fold.button.classList.add('opened');

    event.emit('opened', scope, fold);
  };

  /**
   * Fold Closed
   *
   * @public
   */
  const closed = () => {

    fold.button.classList.remove('open');
    fold.content.classList.remove('open');

    event.emit('closed', scope, fold);
  };

  /* -------------------------------------------- */
  /* PUBLIC                                       */
  /* -------------------------------------------- */

  /**
   * Enable Fold
   *
   * @private
   */
  fold.enable = () => {

    const value = fold.disabled = false;
    fold.button.classList.remove('disabled');
    fold.content.classList.remove('disabled');

    if (config.aria) fold.button.setAttribute('aria-disabled', String(value));
  };

  /**
   * Disable Fold
   *
   * @private
   */
  fold.disable = () => {

    const value = fold.disabled = true;
    fold.content.classList.add('disable');
    fold.button.classList.add('disable');

    if (config.aria) fold.button.setAttribute('aria-disabled', String(value));
  };

  /**
   * Fold Open
   *
   * @public
   */
  fold.open = (transition = true) => {

    if (fold.opened) return;

    event.emit('open', scope, fold);
    const value = fold.opened = true;

    if (!config.persist) fold.disable();
    if (config.aria) fold.button.setAttribute('aria-expanded', String(value));

    fold.button.classList.add('open');
    fold.content.classList.add('open');

    if (!transition) {
      opened();
    } else {
      fold.content.style.height = `${fold.content.offsetHeight}px`; ;
    }
  };

  /**
   * Fold Close
   *
   * @public
   */
  fold.close = (transition = true) => {

    if (!fold.opened) return;

    event.emit('close', scope, fold);
    const value = fold.opened = false;

    if (!config.persist) fold.enable();
    if (config.aria) fold.button.setAttribute('aria-expanded', String(value));

    fold.button.classList.remove('opened');
    fold.content.classList.remove('opened');

    if (!transition) {
      closed();
    } else {
      fold.content.style.height = `${fold.content.offsetHeight}px`;
      requestAnimationFrame(() => { fold.content.style.height = '0px'; });
    }
  };

  /**
   * Toggle Fold
   *
   * @public
   */
  fold.toggle = (transition = true) => {

    return fold.opened ? fold.close(transition) : fold.open(transition);

  };

  /**
   * Focus Button
   *
   * @public
   */
  fold.focus = () => fold.button.focus();

  /**
   * Blur Button
   *
   * @public
   */
  fold.blur = () => fold.button.blur();

  /* -------------------------------------------- */
  /* LISTENERS                                    */
  /* -------------------------------------------- */

  const $transition = (event: TransitionEvent) => {
    if (event.target === event.currentTarget && event.propertyName === 'height') {
      fold.opened ? opened() : closed();
    }
  };

  const $focus = () => {
    fold.focused = true;
    fold.button.classList.add('focus');
    fold.content.classList.add('focus');
    event.emit('focus', scope, fold);
  };

  const $blur = () => {
    fold.focused = false;
    fold.button.classList.remove('focus');
    fold.content.classList.remove('focus');
    event.emit('blur', scope, fold);
  };

  const $click = () => {
    fold.focus();
    if (fold.disabled) return;
    fold.toggle();
  };

  const $buttonkey = (event: KeyboardEvent) => {

    if (!config.keyboard) return;

    const { which } = event;
    let action = null;

    if (which === 40) action = 'next'; // Arrow Down
    else if (which === 38) action = 'prev'; // Arrow Up
    else if (which === 36) action = 'first'; // Home
    else if (which === 35) action = 'last';  // End
    else if (which === 34 && event.ctrlKey) action = 'next'; // Page down
    else if (which === 33 && event.ctrlKey) action = 'prev';  // Page Up
    else return;

    if (action) {
      event.preventDefault();
      scope.focus(action);
    }

  };

  const $contentkey = (event: KeyboardEvent) => {

    if (!config.keyboard || !event.ctrlKey) return;

    const action = event.which === 34 ? 'next' : event.which === 33 ? 'prev' : null;

    if (action) {
      event.preventDefault();
      scope.focus(action);
    }
  };

  fold.button.addEventListener('focus', $focus);
  fold.button.addEventListener('blur', $blur);
  fold.button.addEventListener('click', $click);
  fold.button.addEventListener('keydown', $buttonkey);
  fold.content.addEventListener('keydown', $contentkey);
  fold.content.addEventListener('transitionend', $transition);

  /* -------------------------------------------- */
  /* DESTROY                                      */
  /* -------------------------------------------- */

  /**
   * Destory Fold
   *
   * @public
   */
  fold.destroy = () => {

    fold.button.removeEventListener('focus', $focus);
    fold.button.removeEventListener('blur', $blur);
    fold.button.removeEventListener('click', $click);
    fold.button.removeEventListener('keydown', $buttonkey);
    fold.content.removeEventListener('keydown', $contentkey);
    fold.content.removeEventListener('transitionend', $transition);

    if (config.aria) {
      fold.button.removeAttribute('aria-controls');
      fold.button.removeAttribute('aria-expanded');
      fold.button.removeAttribute('aria-disabled');
      fold.content.removeAttribute('role');
      fold.content.removeAttribute('aria-labelledby');
    }

    fold.button.classList.remove('open', 'opened', 'focus');
    fold.content.classList.remove('open', 'opened', 'focus');
    fold.content.style.height = '0px';
    fold.button.removeAttribute('id');
    fold.content.removeAttribute('id');
  };

  /* -------------------------------------------- */
  /* RETURN FOLD                                  */
  /* -------------------------------------------- */

  return fold;

};

/**
 * Settings Config
 *
 * Merges user settings with defaults
 */
const $config = (options?: IOptions) => {

  const config: IOptions = Object.create(null);

  config.initial = 0;
  config.preserve = false;
  config.persist = true;
  config.multiple = false;
  config.keyboard = true;
  config.aria = true;
  config.icons = Object.create(null);
  config.icons.opened = down;
  config.icons.closed = right;
  config.icons.locked = locked;

  if (options.icons) {
    Object.assign(config.icons, options.icons);
    delete options.icons;
  }

  Object.assign<IOptions, IOptions>(config, options);

  return config;

};

export const accordion = (selector: string | Element, options?: IOptions) => {

  if (!('accordion' in window)) window.accordion = Object.create(null);

  const scope: IScope = Object.create(null);

  scope.folds = [];
  scope.events = Object.create(null);
  scope.id = `A${Object.keys(window.accordion).length}`;
  scope.element = typeof selector === 'string' ? document.body.querySelector(selector) : selector;
  scope.config = $config(options);
  const event = $events(scope.events);

  /**
   * Accordion Events
   */
  scope.on = event.on;

  /**
   * Accordion Focus
   */
  scope.focus = (target: 'prev' | 'next' | 'last' | 'first') => {

    let focused = null;
    const folds = scope.folds.length;

    for (let i = 0; i < folds && focused === null; i++) if (folds[i].focused) focused = i;

    if ((target === 'prev' || target === 'next') && focused === null) {
      target = target === 'prev' ? 'last' : 'first';
    }

    if (target === 'prev' && focused === 0) {
      if (!scope.config.persist) return;
      target = 'last';
    }

    if (target === 'next' && focused === folds - 1) {
      if (!scope.config.persist) return;
      target = 'first';
    }

    if(target === 'prev') folds[--focused].focus();
    else if (target === 'next') folds[++focused].focus();
    else if (target === 'last') folds[folds - 1].focus();
    else if (target === 'first') folds[folds - 1].focus();
    else folds[0].focus();

  };

  if (scope.config.aria) {
    scope.element.setAttribute('aria-multiselectable', String(scope.config.multiple));
  }

  const children = scope.element.children;
  const length = children.length;

  for (let i = 0; i < length; i = i + 2) {

    let child = children[i] as HTMLElement;
    let sibling = children[i + 1];
    let button: Element;
    let content: Element;

    if (child.nodeName === 'A' || child.nodeName === 'BUTTON') {
      button = child;
    } else {
      child = child.firstElementChild as HTMLElement;
      sibling = child.nextElementSibling;
      if (child.nodeName === 'A' || child.nodeName === 'BUTTON') {
        button = child;
      } else {
        throw new TypeError('Wrapped fold buttons must be either <a> or <button> elements');
      }
    }

    if (sibling.nodeName === 'A' || sibling.nodeName === 'BUTTON') {
      throw new TypeError('Content fold cannot be <a> or <button> element');
    } else {
      content = sibling;
    }

    if (button && content) {

      const fold: IScope['folds'][number] = Object.create(null);

      fold.button = button as any;
      fold.content = content as any; ;
      fold.number = scope.folds.length;
      fold.id = `${scope.element.id}F${fold.number}`;
      fold.button.id = `B${fold.id}`;
      fold.content.id = `C${fold.id}`;

      scope.folds.push($folds(scope, fold, event));

    }
  }

  /**
   * Destory
   *
   * Teardown the accordion
   */
  scope.destroy = () => {

    for (const fold of scope.folds) fold.destroy();

    scope.element.removeAttribute('aria-multiselectable');
    scope.element.removeAttribute('id');
    event.emit('destroy', scope);

    delete window.accordion[scope.id];

  };

  const id = scope.element.hasAttribute('id') ? scope.element.id : scope.id;
  window.accordion[id] = scope;

  return scope;

};
