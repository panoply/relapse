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
   * and toggle will not be invoked.
   *
   * > Use the `fold.expanded` parameter to determine the type of toggle occuring.
   */
  (event: 'toggle', callback: (this: T, fold?: F) => void | boolean);
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
   * Whether or not to persist a single fold. This will prevent
   * an accordion type toggle group from collapsing all folds, by
   * always keeping one expanded.
   *
   * @default false
   */
  persist?: boolean;
  /**
   * Whether or not multiple folds can be expanded within a toggle group. This
   * will allow all folds to be expanded. When set to `false` only one fold
   * can be expanded per group.
   *
   * @default true
   */
  multiple?: boolean;
  /**
   * The animation speed in `ms` to apply inline. Set this to `NaN` if you are
   * controlling duration speed within CSS.
   *
   * @default 225
   */
  duration?: number;
  /**
   * The data-attribute annotation schema. This allows you
   * to customise the attribute prefix key name.
   *
   * @default
   * 'data-relapse'
   *
   * @example
   *
   * // Default behaviour
   * <div
   *  class="relapse"
   *  data-relapse="id"
   *  data-relapse-multiple="true"
   *  data-relapse-persist="false">  </div>
   */
  schema?: `data-${string}`;
  /**
   * Custom class names
   */
  classes?: {
    /**
     * The class to use for loaded folds in an opened
     * state. Annotate button elements to expand folds at runtime.
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
     * and folds upon being expanded, ie: transition ends.
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
   * reference for the fold. If the fold button or content element has an `id="*"`
   * attribute then that value will be used.
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
   * The fold element which is toggled.
   */
  element: HTMLElement;
  /**
   * The zero based index reference for the fold.
   */
  index: number;
  /**
   * Whether or not the fold is expanded.
   */
  expanded: boolean;
  /**
   * The current folds max-height
   */
  height: number;
  /**
   * Whether or not the fold is disabled. This will
   * be set to `true` on expanded folds when the `persist`
   * option is enabled.
   *
   * If the fold is collapsed and this is `true` then then
   * toggling will be prevented.
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
   * or vice-versa. Use the `grow()` method to recalculate
   * height.
   */
  toggle: () => void;
  /**
   * Enable the fold, Optionally accepts an `id` reference
   * to target specific fold either by a `0` based index of fold id.
   */
  enable: (id?: number | string) => void;
  /**
   * Disable the fold, Optionally accepts an `id` reference
   * to target specific fold either by a `0` based index of fold id.
   */
  disable: (id?: number | string) => void;
  /**
   * Open the fold, Optionally accepts an `id` reference
   * to target specific fold either by a `0` based index of fold id.
   */
  open: (id?: number | string) => void;
  /**
   * Close the fold,  Optionally accepts an `id` reference
   * to target specific fold either by a `0` based index of fold id.
   */
  close: (id?: number | string) => void;
  /**
   * Destroy the fold. You can optionally remove the
   * fold from the dom by passing in `true`.
   */
  destroy: (remove?: boolean) => void;
}

export declare interface Folds extends Array<Fold> {
  /**
   * Return a fold by `0` based index of by `id` attribute value.
   */
  get(id: string | number): Fold;
}

export declare interface Scope {
  /**
   * The internal id reference for this instance
   */
  id: string;
  /**
   * The accordion options merged with defaults
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
   * Indicated a nested accordion within a fold
   */
  parent: HTMLElement;
  /**
   * The number of collapsed folds, ie: the open count
   */
  count: number;
  /**
   * The list of folds contained within this accordion.
   */
  folds: Folds;
  /**
   * Binded events listeners.
   */
  events: { [K in EventNames]: Events<Readonly<Scope>, Fold>[] }
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
   * control over with a `data-relapse-fold="*"` attribute and
   * pass the value provided opposed to the index.
   */
  expand: (fold: number | string) => void;
  /**
   * Collapse a fold by passing its `0` based index.
   *
   * You can optionally annotate folds you need programmitic
   * control over with a `data-relapse-fold="*"` attribute and
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
  export interface Window {
    /**
     * **_Relapse Instances_**
     *
     * This is getter which will return a `Map` containing all
     * current relapse instances in the DOM.
     */
    relapse: Map<string, Scope>
  }
}

declare const Relapse: {
  /**
   * **_RELAPSE_**
   *
   * A lightweight and a silky smooth ESM (vanilla) toggle utility for
   * creating dynamic collapsible components.
   *
   * @example
   * import relapse from 'relapse';
   *
   * // Calling relapse will invoke on all elements containing data-relapse
   * // All elements using class name .selector will be used by relapse
   * relapse('.selector');
   *
   * // Element with id value of #collapse will be used by relapse
   * relapse(document.querySelector('#collapse'));
   */
  (selector: string | HTMLElement | NodeListOf<HTMLElement>, options?: Options): Scope;
  /**
   * **_RELAPSE_**
   *
   * A lightweight and a silky smooth ESM (vanilla) toggle utility for
   * creating dynamic collapsible components.
   *
   * @example
   * import relapse from 'relapse';
   *
   * // Calling relapse will invoke on all elements containing data-relapse
   * relapse();
   *
   * // Calling relapse will invoke on all elements containing data-toggle
   * relapse({ schema: 'data-toggle' });
   */
  (options?: Options): Scope[];
  /**
   * **_GET ACCORDION_**
   *
   * Find the current loaded accordion by its `id`
   */
  get(id: string): Scope;
  /**
   * **_ALL ACCORDIONS_**
   *
   * Returns the `window.replace` Map instance.
   */
  get(): Map<string, Scope>
};

export default Relapse;
