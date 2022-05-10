import { IAccordion } from '../types';
import { $events } from './events';

declare global {
  export interface Window { relapse: Map<string, IAccordion.Scope> }
}

/**
 * Folds instance - Creates an object literal for each content fold.
 */
function $folds (scope: IAccordion.Scope, event: ReturnType<typeof $events>) {

  const { config } = scope;
  const { classes } = config;

  return (fold: IAccordion.Fold) => {

    /**
     * Collapsing Element -Closes an open fold, uses RAF to handle the transition.
     */
    const $collapse = (focus: IAccordion.Fold) => {

      scope.collapsing = true;

      const { fade, transition } = focus;
      const { scrollHeight, style } = focus.content;
      const start = performance.now();

      let raf = requestAnimationFrame(function $animate (time: number) {

        const progress = Math.min((time - start) / (transition as number), 1);

        if (progress < 1) {

          if (fade && progress > 0) style.opacity = `${1 - progress}`;
          style.height = `${scrollHeight - progress * scrollHeight}px`;
          raf = requestAnimationFrame($animate);

        } else if (progress >= 1) {

          style.height = '0';
          if (fade) style.opacity = '0';
          focus.button.ariaDisabled = 'false';
          focus.button.ariaExpanded = 'false';
          focus.button.classList.remove(classes.opened);
          focus.content.classList.remove(classes.expanded);
          focus.expanded = false;
          scope.collapsing = false;

          cancelAnimationFrame(raf);
        }
      });
    };

    /**
     * Expanding Element - Opens a closed fold, uses RAF to handle the transition.
     */
    const $expand = (focus: IAccordion.Fold) => {

      scope.collapsing = true;

      const { fade, transition } = focus;
      const { scrollHeight, style } = focus.content;

      const start = performance.now();

      if (!fade) style.opacity = '1';

      let raf = requestAnimationFrame(function $animate (time: number) {

        const progress = Math.min((time - start) / (transition as number), 1);

        if (progress < 1) {

          if (fade && progress > 0) style.opacity = `${progress}`;
          style.height = `${progress * scrollHeight}px`;
          raf = requestAnimationFrame($animate);

        } else if (progress >= 1) {

          if (fade) style.opacity = '1';

          style.height = 'auto';
          scope.collapsing = false;

          cancelAnimationFrame(raf);
        }

      });
    };

    /**
     * Expanding Element - Opens a closed fold, uses RAF to handle the transition.
     */
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

    /**
   * Focus Button - Applies focus to the button
   */
    fold.focus = () => {
      scope.active = fold.number; // focused Scope
      fold.button.classList.add(classes.focused);
      event.emit('focus', scope, fold);
    };

    /**
   * Blur Button - Applies blur to the button
   */
    fold.blur = () => fold.button.classList.remove(classes.focused);

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
          if (config.persist) {
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

    fold.close = (index?: number) => {

      let focus = $active(index);

      if (config.multiple && !focus.expanded) {
        $collapse(focus);
      } else {
        for (const node of scope.folds) {
          if (node.expanded) {
            if (config.persist && node.number === focus.number) break;
            $collapse(node);
            focus = node;
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

      $expand(focus);

      focus.expanded = true;
      focus.button.ariaDisabled = 'true';
      focus.button.ariaExpanded = 'true';
      focus.button.classList.add(classes.opened);
      focus.content.classList.add(classes.expanded);

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

    fold.destroy = (remove = false) => {

      fold.close();

      fold.button.removeEventListener('click', fold.toggle);
      fold.button.removeEventListener('focus', fold.focus);
      fold.button.removeEventListener('blur', fold.blur);

      if (remove) {
        scope.element.removeChild(fold.content);
        scope.element.removeChild(fold.button);
      }
    };

    fold.button.addEventListener('click', fold.toggle);
    fold.button.addEventListener('focus', fold.focus);
    fold.button.addEventListener('blur', fold.blur);

    scope.folds.push(fold);

  };

}

const $boolean = (nodeValue: string) => {

  const value = nodeValue.trim();

  if (!/true|false/.test(value)) throw new TypeError(`Invalid value. Boolean expected, received: ${value}`);

  return value === 'true';

};

const $transition = (nodeValue: string) => {

  const value = nodeValue.trim();

  if (/[-]?[0-9]/.test(value)) {
    if (value.charCodeAt(0) === 45) throw new TypeError(`Negative transition is not allowed: ${value}`);
    return Number(value);
  }

  return $boolean(value) ? 300 : 0;

};

/**
 * Default Options - Merges the default options with user options.
 */
const $defaults = (options: IAccordion.Options, attrs: NamedNodeMap): IAccordion.Options => {

  const config: IAccordion.Options = Object.create(null);
  const classes: IAccordion.Options['classes'] = Object.create(null);

  classes.opened = 'opened';
  classes.disabled = 'disable';
  classes.expanded = 'expanded';
  classes.focused = 'focused';

  if ('classes' in options) Object.assign(classes, options.classes);

  config.classes = classes;
  config.persist = true;
  config.multiple = false;
  config.fade = true;
  config.schema = 'data-accordion';

  if (typeof options === 'object') Object.assign<IAccordion.Options, IAccordion.Options>(config, options);

  // Available attribute properties
  const name = /^(?:preserve|persist|multiple|keyboard|transition|fade)$/;
  const slice = config.schema === null ? 5 : config.schema.length + 1;

  // Lets loop over all the attributes contained on the element
  // and apply configuration to ones using valid annotations.
  for (const { nodeName, nodeValue } of attrs) {
    const prop = nodeName.slice(slice);
    if (name.test(prop)) config[prop] = prop === 'transition' ? $transition(nodeValue) : $boolean(nodeValue);
  }

  // convert transition booleans to numbers or assign defaults
  if (!('transition' in config)) config.transition = 300;

  return config;

};

export function accordion (selector: string | HTMLElement, options?: IAccordion.Options) {

  if (!(window.relapse instanceof Map)) window.relapse = new Map();

  const scope: IAccordion.Scope = Object.create(null);

  scope.folds = [];
  scope.events = Object.create(null);
  scope.element = typeof selector === 'string' ? document.body.querySelector(selector) : selector;
  scope.id = scope.element.id ? scope.element.id : `A${window.relapse.size}`;

  if (window.relapse.has(scope.id)) {
    throw new TypeError(`An accordion using id ${scope.id} alrerady exists`);
  }

  scope.config = $defaults(options, scope.element.attributes);
  scope.element.ariaMultiSelectable = `${scope.config.multiple}`;
  scope.collapsing = false;

  const children = scope.element.children;
  const length = children.length;
  const event = $events(scope.events);
  const folds = $folds(scope, event);

  const { classes, schema, transition, fade } = scope.config;
  const attr = schema === null ? 'data' : schema;
  const attrfade = `${attr}-fade`;
  const attrtran = `${attr}-transition`;

  for (let i = 0; i < length; i = i + 2) {

    const button = children[i] as HTMLElement;
    const content = children[i + 1] as HTMLElement;

    const fold: IAccordion.Fold = Object.create(null);

    fold.number = scope.folds.length;

    const isOpened = button.classList.contains(classes.opened);
    const isDisabled = button.classList.contains(classes.disabled);
    const isExpanded = content.classList.contains(classes.expanded);

    if (button.ariaExpanded === 'true' || isOpened || isExpanded) {

      // class name and attribute align
      if (!isOpened) button.classList.add(classes.opened); else button.ariaExpanded = 'true';
      if (!isExpanded) content.classList.add(classes.expanded);
      if (!isDisabled) button.classList.add(classes.disabled);

      // remove disabled if applied
      button.ariaDisabled = 'true';

      fold.expanded = true;
      fold.disabled = true;

    } else if (button.ariaDisabled === 'true' || isDisabled) {

      // class name and attribute align
      if (!isDisabled) button.classList.add(classes.disabled); else button.ariaDisabled = 'false';

      content.classList.remove(classes.expanded);
      button.classList.remove(classes.opened);

      button.ariaExpanded = 'false';

      fold.expanded = false;
      fold.disabled = true;

    } else {

      fold.expanded = false;
      fold.disabled = false;

      button.ariaExpanded = 'false';
      button.ariaDisabled = 'false';

    }

    fold.transition = transition;
    fold.fade = fade;

    if (button.id) fold.id = button.id;
    if (content.id) fold.id = content.id;

    if (!('id' in fold)) {
      fold.id = `${scope.id}F${fold.number}`;
      button.id = `B${fold.id}`;
      content.id = `C${fold.id}`;
    }

    if (button.hasAttribute(attrtran)) fold.transition = $transition(button.getAttribute(attrtran));
    if (content.hasAttribute(attrtran)) fold.transition = $transition(content.getAttribute(attrtran));
    if (button.hasAttribute(attrfade)) fold.fade = $boolean(button.getAttribute(attrfade));
    if (content.hasAttribute(attrfade)) fold.fade = $boolean(content.getAttribute(attrfade));

    if (!fold.fade) content.style.opacity = '1';

    button.setAttribute('aria-controls', fold.id);
    content.setAttribute('aria-labelledby', button.id);
    content.setAttribute('role', 'region');

    fold.button = button as any;
    fold.content = content as any;

    folds(fold);
  }

  const $find = (method: 'open' | 'close' | 'destroy', fold: string | number, remove = false) => {

    if (typeof fold === 'number') {
      return method.charCodeAt(0) === 100
        ? scope.folds[fold][method](remove as never)
        : scope.folds[fold][method]();
    } else if (typeof fold === 'string') {
      for (const f of scope.folds) {
        if (f.button.dataset[`${scope.config.schema}-fold`] === fold) {
          return method.charCodeAt(0) === 100 ? f[method](remove as never) : f[method]();
        }
      }
    }

    throw new TypeError(`Fold does not exist: "${fold}"`);

  };

  /* -------------------------------------------- */
  /* METHODS                                      */
  /* -------------------------------------------- */

  scope.on = event.on;

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

    window.relapse.delete(scope.id);

  };

  window.relapse.set(scope.id, scope);

  return scope;

};
