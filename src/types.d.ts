/* eslint-disable no-use-before-define */

export namespace IAccordion {

  export type EventNames = (
    | 'focus'
    | 'toggle'
    | 'expand'
    | 'collapse'
    | 'destroy'
  )

  export interface Events <T = Scope, F = Fold>{
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

  export interface Options {
    /**
     * The slide duration (ms) for the collapse animation.
     * Set to `0` to disable transitions.
     *
     * @default 175
     */
    duration?: number;
    /**
     * Whether or not fold content should gently fade-in
     * upon expanding. Uses the `duration` value to best
     * calculate the opacity animation.
     *
     * @default true
     */
    fade?: boolean;
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
     * Whether or not to preserve the expanded/collpase states
     * between browser refresh. References will be stored in
     * localStorage.
     *
     * > Calls `destroy()` will remove preserved records.
     *
     * @default false
     */
    preserve?: boolean;
    /**
     * Whether W3C keyboard shortcuts are enabled. This is
     * for accessibility, when `true` the folds can be expanded
     * or collapsed using the keyboard.
     *
     * @default true
     */
    keyboard?: boolean;
    /**
     * The data-attribute annotation schema. This allows you
     * to customise the attribute prefix key name. You can
     * optionally set this to `null` to omit prefixing.
     *
     * @default
     * 'data-accordion'
     * @example
     *
     * // Default behaviour
     * <div
     *  class="accordion"
     *  data-accordion-duration="200"
     *  data-accordion-multiple="true"
     *  data-accordion-persist="false">  </div>
     *
     * // Using null
     * <div
     *  class="accordion"
     *  data-duration="200"
     *  data-multiple="true"
     *  data-persist="false">...</div>
     */
    schema?: null | `data-${string}`;
  }

  export interface Fold {
    /**
     * A unique string id for this fold.
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

  export interface Scope {
    /**
     * The accordion internal id reference.
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
     * Whether or not a fold is collapsing
     */
    collapsing: boolean;
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
     * Destroy the accordion. You can optionally reset the
     * expanded and collapsed folds by passing in `true`.
     */
    destroy: (reset?: boolean) => void;
  }
}
