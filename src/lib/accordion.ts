import { IAccordion } from '../types';
import { $events } from './events';

declare global {
  export interface Window { relapse: Map<string, IAccordion.Scope> }
}

/**
 * Default Options
 *
 * Merges the default options with user options.
 */
const $defaults = (options: IAccordion.Options): IAccordion.Options => {

  const config: IAccordion.Options = Object.create(null);

  config.preserve = false;
  config.persist = true;
  config.multiple = false;
  config.keyboard = true;
  config.duration = 175;
  config.fade = true;
  config.schema = 'data-accordion';

  Object.assign<IAccordion.Options, IAccordion.Options>(config, options);

  return config;

};

/**
 * Folds instance
 *
 * Creates an object literal for each content
 * fold. The object is using a null prototype.
 */
const $folds = (scope: IAccordion.Scope, event: ReturnType<typeof $events>) => (fold: IAccordion.Fold) => {

  const { config } = scope;
  const { duration } = config;

  /**
   * Collapsing Element.
   *
   * Closes an open fold, uses RAF to handle
   * the transition.
   */
  const $collapse = (focus: IAccordion.Fold) => {

    scope.collapsing = true;

    const { content, button } = focus;
    const { scrollHeight, style } = content;
    const start = performance.now();

    let opacity = 1;

    requestAnimationFrame(function $animate (time: number) {

      const progress = Math.min((time - start) / duration, 1);

      let raf: number;

      if (opacity >= 0) style.opacity = `${opacity -= 0.007}`;

      if (progress < 1) {
        style.height = `${scrollHeight - progress * scrollHeight}px`;
        raf = requestAnimationFrame($animate);
      } else if (progress >= 1) {
        style.height = '0';
        style.opacity = '0';
        focus.expanded = false;
        scope.collapsing = false;
        content.classList.remove('expanded');
        button.classList.remove('expanded');
        button.ariaDisabled = 'false';
        cancelAnimationFrame(raf);
      }
    });
  };

  /**
   * Expanding Element.
   *
   * Opens a closed fold, uses RAF to handle
   * the transition.
   */
  const $expand = (focus: HTMLElement) => {

    scope.collapsing = true;

    const { scrollHeight, style } = focus;
    const start = performance.now();

    let opacity = 0;

    requestAnimationFrame(function $animate (time: number) {

      const progress = Math.min((time - start) / duration, 1);

      let raf: number;

      if (opacity <= 1) style.opacity = `${opacity += 0.03}`;

      if (progress < 1) {
        style.height = `${progress * scrollHeight}px`;
        raf = requestAnimationFrame($animate);
      } else if (progress >= 1) {
        style.height = 'auto';
        style.opacity = '1';
        scope.collapsing = false;
        cancelAnimationFrame(raf);
      }
    });
  };

  const $active = (index: number) => {

    if (typeof index !== 'number') {
      if (scope.active !== fold.number) scope.active = fold.number;
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
  fold.button.setAttribute('aria-controls', fold.id);
  fold.content.setAttribute('aria-labelledby', fold.button.id);
  fold.content.setAttribute('role', 'region');

  fold.focus = () => {

    fold.button.classList.add('focused');
    fold.content.classList.add('focused');

    // Focused Scope
    scope.active = fold.number;

    event.emit('focus', scope, fold);
  };

  fold.blur = () => {
    fold.button.classList.remove('focused');
    fold.content.classList.remove('focused');
  };

  fold.enable = (index?: number) => {

    const focus = $active(index);

    if (focus.disabled) {
      focus.disabled = false;
      focus.button.ariaDisabled = 'false';
      focus.button.classList.remove('disabled');
    }
  };

  fold.disable = (index?: number) => {

    const focus = $active(index);

    if (!focus.disabled) {
      if (focus.expanded) {
        if (config.persist) {
          focus.disabled = true;
          focus.button.ariaDisabled = 'true';
        }
      } else {
        focus.close();
        focus.disabled = true;
        focus.button.ariaDisabled = 'true';
        focus.button.classList.add('disabled');
      }
    }
  };

  fold.close = (index?: number) => {

    let focus = $active(index);

    if (config.multiple && !focus.expanded) {
      $collapse(focus);
    } else {
      for (const f of scope.folds) {
        if (f.expanded) {
          if (config.persist && f.number === focus.number) break;
          $collapse(f);
          focus = f;
          break;
        }
      }
    }

    focus.enable();
    event.emit('collapse', scope, focus);

  };

  fold.open = (index?: number) => {

    const focus = $active(index);

    if (focus.expanded || focus.disabled) return;

    focus.close();

    $expand(focus.content);

    focus.expanded = true;
    focus.button.ariaDisabled = 'true';
    focus.button.classList.add('expanded');
    focus.content.classList.add('expanded');

    focus.disable();
    event.emit('expand', scope, focus);

  };

  fold.toggle = () => {

    if (scope.collapsing) return;
    if (event.emit('toggle', scope, fold)) return;

    return fold.expanded
      ? fold.close()
      : fold.open();

  };

  fold.destroy = (aria = false) => {

    if (aria) {
      fold.button.removeAttribute('aria-expanded');
      fold.button.removeAttribute('aria-disabled');
      fold.button.removeAttribute('aria-controls');
      fold.content.removeAttribute('aria-labelledby');
      fold.content.removeAttribute('role');
    }

    fold.button.removeEventListener('click', fold.toggle);
    fold.button.removeEventListener('focus', fold.focus);
    fold.button.removeEventListener('blur', fold.blur);
  };

  fold.button.addEventListener('click', fold.toggle);
  fold.button.addEventListener('focus', fold.focus);
  fold.button.addEventListener('blur', fold.blur);

  scope.folds.push(fold);

};

export const accordion = (selector: string | HTMLElement, options?: IAccordion.Options) => {

  if (!(window.relapse instanceof Map)) window.relapse = new Map();

  const scope: IAccordion.Scope = Object.create(null);

  scope.folds = [];
  scope.events = Object.create(null);
  scope.config = $defaults(options);
  scope.id = `A${window.relapse.size}`;
  scope.element = typeof selector === 'string' ? document.body.querySelector(selector) : selector;
  scope.element.ariaMultiSelectable = `${scope.config.multiple}`;
  scope.collapsing = false;

  const children = scope.element.children;
  const length = children.length;
  const event = $events(scope.events);
  const folds = $folds(scope, event);

  for (let i = 0; i < length; i = i + 2) {

    const child = children[i] as HTMLElement;
    const sibling = children[i + 1];

    let button: Element;
    let content: Element;

    if (child.nodeName === 'A' || child.nodeName === 'BUTTON') {
      button = child;
    } else {
      throw new TypeError('Buttons must be either <a> or <button> elements');
    }

    if (sibling.nodeName === 'A' || sibling.nodeName === 'BUTTON') {
      throw new TypeError('Content fold cannot be <a> or <button> element');
    } else {
      content = sibling;
    }

    const fold: IAccordion.Fold = Object.create(null);

    fold.button = button as any;
    fold.content = content as any; ;
    fold.number = scope.folds.length;
    fold.id = `${scope.id}F${fold.number}`;
    fold.button.id = `B${fold.id}`;
    fold.content.id = `C${fold.id}`;
    fold.disabled = button.classList.contains('disabled') || content.classList.contains('disabled');
    fold.expanded = button.classList.contains('expanded') || content.classList.contains('expanded');

    folds(fold);

  }

  const $find = (fold: string | number, method: 'open' | 'close') => {

    console.log(fold);
    if (typeof fold === 'number') {
      return scope.folds[fold][method]();
    } else if (typeof fold === 'string') {
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
  scope.collapse = (fold: string | number) => $find(fold, 'close');
  scope.expand = (fold: string | number) => $find(fold, 'open');
  scope.destroy = (reset = false) => {

    for (const fold of scope.folds) fold.destroy();

    scope.element.removeAttribute('aria-multiselectable');
    scope.element.removeAttribute('id');

    event.emit('destroy', scope);

    window.relapse.delete(scope.id);

  };

  window.relapse.set(scope.id, scope);

  return scope;

};
