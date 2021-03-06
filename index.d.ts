/* eslint-disable no-use-before-define */

// eslint-disable-next-line no-unused-vars
export declare type EventNames = (
  | 'focus'
  | 'toggle'
  | 'expand'
  | 'collapse'
  | 'destroy'
)

export declare interface Events <T = Scope, F = Fold>{
  /**
   * Triggered when a fold button has been focused.
   */
  (event: 'focus', callback: (this: T, fold?: F) => void);
  /**
   * Triggered before expanding or collapsing.
   * Returning a boolean `false` will `preventDefault()`
   * and toggle will not be fired.
   *
   * > Use the `fold.expanded` parameter to determine the type of toggle occuring.
   */
  (event: 'toggle', callback: (this: T, fold?: F) => void | false);
  /**
   * Triggered when a fold has been expanded.
   */
  (event: 'expand', callback: (this: T, fold?: F) => void);
  /**
   * Triggered when a fold has been collapsed
   */
  (event: 'collapse', callback: (this: T, fold?: F) => void);
  /**
   * Triggered when a fold has been destoryed.
   */
  (event: 'destroy', callback: (this: T) => void);
}

export declare interface Options {
  /**
   * Whether or not to persist a fold. This will prevent
   * the accordion from collapsing all folds, keeping
   * one expanded.
   *
   *
   * @default true
   */
  persist?: boolean;
  /**
   * Whether or not multiple folds can be expanded. This
   * will allow the use to control what folds are collapsed
   * and expanded.
   *
   * @default false
   */
  multiple?: boolean;
  /**
   * The data-attribute annotation schema. This allows you
   * to customise the attribute prefix key name. You can
   * optionally set this to `null` to omit prefixing.
   *
   * @default
   * 'data-accordion'
   *
   * @example
   *
   * // Default behaviour
   * <div
   *  class="relapse"
   *  data-relapse-multiple="true"
   *  data-relapse-persist="false">  </div>
   */
  schema?: null | `data-${string}`;
  /**
   * Custom class names
   */
  classes?: {
    /**
     * The class to use for loaded folds in an opened
     * state. Applies on button elements, it will expand
     * folds at runtime.
     *
     * @default 'initial'
     */
    initial?: string;
    /**
     * The opened class name which is added to buttons
     * and folds upon being opened.
     *
     * @default 'opened'
     */
    opened?: string;
    /**
     * The expanded class name which is added to buttons
     * and folds upon being expanded, ie: transition end
     *
     *
     * @default 'expanded'
     */
    expanded?: string;
    /**
     * The focused class name which is added to buttons
     * and folds that are in focus.
     *
     * @default 'focused'
     */
    focused?: string;
    /**
     * The focused class name which is added to buttons
     * and folds that are disabled.
     *
     * @default 'disabled'
     */
    disabled?: string;
  }
}

export declare interface Fold {
  /**
   * The fold id. This value will be used as the `key`
   * reference for the fold. If the fold button or content
   * element has an `id="*"` attribute then that value will be used.
   *
   * If both the button and fold element contain an `id` attribute
   * then the `id` defined on the fold will be used.
   */
  id: string;
  /**
   * The button element which toggles this fold.
   */
  button: HTMLElement;
  /**
   * The content fold element which is toggled.
   */
  content: HTMLElement;
  /**
   * The zero based index reference for the fold.
   */
  number: number;
  /**
   * Whether or not the fold is expanded.
   */
  expanded: boolean;
  /**
   * Whether or not the fold is disabled. This will
   * be set to `true` on expanded folds when the `persist`
   * option is enabled. If the fold is collapsed and this
   * is `true` then then toggling will be prevented.
   */
  disabled: boolean;
  /**
   * Focus the button.
   *
   * > The `focus` class will be added to the button and the
   * `active` index will be updated (unless button is disabled).
   */
  focus: () => void;
  /**
   * Blur the button.
   *
   * > The `focus` class will be removed from the toggle button.
   */
  blur: () => void;
  /**
   * Toggles the fold. The expanded fold will be collapsed
   * or vice-versa.
   */
  toggle: () => void;
  /**
   * Enable the fold, Optionally accepts an `index` reference
   * to target specific fold.
   */
  enable: (index?: number) => void;
  /**
   * Disable the fold, Optionally accepts an `index` reference
   * to target specific fold.
   */
  disable: (index?: number) => void;
  /**
   * Open the fold, Optionally accepts an `index` reference
   * to target specific fold.
   */
  open: (index?: number) => void;
  /**
   * Close the fold, Optionally accepts an `index` reference
   * to target specific fold.
   */
  close: (index?: number) => void;
  /**
   * Destroy the fold. You can optionally remove the
   * fold from the dom by passing in `true`.
   */
  destroy: (remove?: boolean) => void;
}

export declare interface Scope {
  /**
   * The internal id reference for this instance
   */
  id: string;
  /**
   * The accordion options
   */
  config: Options;
  /**
   * The accordion element.
   */
  element: HTMLElement;
  /**
   * The index of the last expanded fold.
   */
  active: number;
  /**
   * The list of folds contained within this
   * accordion.
   */
  folds: Fold[]
  /**
   * Binded events listeners.
   */
  events: { [name: string]: Events<Readonly<Scope>, Fold>[] }
  /**
   * Listen for an event
   */
  on: Events<Readonly<Scope>, Fold>;
  /**
   * Remove an event.
   */
  off: Events<Readonly<Scope>, Fold>;
  /**
   * Expand a fold by passing its `0` based index.
   *
   * You can optionally annotate folds you need programmitic
   * control over with a `data-accordion-fold="*"` attribute and
   * pass the value provided opposed to the index.
   */
  expand: (fold: number | string) => void;
  /**
   * Collapse a fold by passing its `0` based index.
   *
   * You can optionally annotate folds you need programmitic
   * control over with a `data-accordion-fold="*"` attribute and
   * instead pass the value provided opposed to the index.
   */
  collapse: (fold: string | number) => void;
  /**
   * Destroy the accordion. You optionally use this method
   * to target a specific fold and inform on whether it should
   * be removed or not.
   */
  destroy: (fold?: string | number, remove?: boolean) => void;
}

declare global {
  export interface Window { relapse: Map<string, Scope> }
}

declare const Relapse: {
  /**
   * *RELAPSE ACCORDION*
   *
   * A sliky smooth, modern and lightweight (2kb gzip)
   * accordion component.
   */
  (selector: string | Element, options?: Options): Scope;
  /**
   * *LOAD ACCORDIONS*
   *
   * Queries the document for `data-relapse="*"` annotated
   * elements and intializes them.
   */
  load(): Scope;
  /**
   * *GET ACCORDION*
   *
   * Find the current loaded accordion by its `id`
   */
  get(id: string): Scope;
  /**
   * *ALL ACCORDIONS*
   *
   * Returns the `window.replace` Map instance.
   */
  get(): Map<string, Scope>
};

export default Relapse;
