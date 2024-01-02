/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */

/**
 * String Literal Union
 */
type LiteralUnion<LiteralType> = LiteralType | (string & Record<never, never>);

/**
 * Identity Utility
 */
type Identity<T> = T;

// eslint-disable-next-line no-unused-vars
export declare type EventNames = (
  | 'focus'
  | 'toggle'
  | 'expand'
  | 'collapse'
  | 'destroy'
)

export declare interface Events <T = Relapse, F = Fold, R = void>{
  /**
   * Triggered when a fold button has been focused.
   */
  <Binding = object>(
    event: 'focus',
    callback: (this: Binding & T, fold?: Binding & F) => void,
    binding?: Binding
  ): R;
  /**
   * Triggered before expanding or collapsing.
   * Returning a boolean `false` will `preventDefault()`
   * and toggle will not be invoked.
   *
   * > Use the `fold.expanded` parameter to determine the type of toggle occuring.
   */
  <Binding = object>(
    event: 'toggle',
    callback: (this: Binding & T, fold?: F) => void | boolean,
    binding?: Binding
  ): R;
  /**
   * Triggered when a fold has been expanded.
   */
  <Binding = object>(
    event: 'expand',
    callback: (this: Binding & T, fold?: F, binding?: Binding) => void,
    binding?: Binding
  ): R;
  /**
   * Triggered when a fold has been collapsed
   */
  <Binding = object>(
    event: 'collapse',
    callback: (this: Binding & T, fold?: F) => void,
    binding?: Binding
  ): R;
  /**
   * Triggered when an instance has been destroyed.
   */
  (event: 'destroy', callback: (this: T) => void): R;
}

export declare interface FadeOptions {
  /**
   * Fold content fading duration when expanding/collapsing
   *
   * @default 120
   */
  duration?: number;
  /**
   * The easing effect of fold content when expanding/collapsing
   *
   * @default 'linear
   */
  easing?: LiteralUnion<'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'linear'>;
}

export declare interface FoldOptions {
  /**
   * The animation speed in `ms` to applied when expanding and collapsing folds.
   * The value provided here will be passed to the `duration` keyframe option of
   * the [WAAPI](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
   * animation instance of fold elements.
   *
   * @default 225
   */
  duration?: number;
  /**
   * The folding animation easing effect to use. Accepts cubic-bezier or any valid
   * CSS easing value. The value provided here will be passed to the `duration` keyframe
   * option of the [WAAPI](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
   * animation instance of fold elements.
   *
   * ---
   *
   * @default 'ease-in-out'
   */
  easing?: LiteralUnion<'ease' | 'ease-in' | 'ease-in-out' | 'ease-out'>;
}

export declare interface Options {
  /**
   * Whether or not the instance identifer should be treated as unique. When `true` Relapse
   * will not throw when an instance exists, but instead will skip re-assignment or teardowns.
   * This option is helpful in SPA's or when you need to persist the instance.
   *
   * ---
   *
   * @default false
   */
  unique?: boolean;
  /**
   * Whether or not to persist a single fold. This will prevent an accordion type
   * toggle group from having all folds collapsed (closed), ensuring that a single
   * fold remains expanded (opened).
   *
   * ---
   *
   * @default false
   */
  persist?: boolean;
  /**
   * Whether or not multiple folds can be expanded (opened) within an accordion type
   * toggle group. This will allow all folds to be opened. When set to `false` only
   * a single fold can be expanded per group.
   *
   * ---
   *
   * @default true
   */
  multiple?: boolean;
  /**
   * The data-attribute annotation schema. This allows you to customise the attribute
   * prefix key name that Relapse uses for query selection.
   *
   * ---
   *
   * ```html
   * <!-- defaults -->
   * <div
   *  class="relapse"
   *  relapse="id"
   *  relapse-multiple="true"
   *  relapse-persist="false"> </div>
   * ```
   *
   * @default 'relapse'
   */
  schema?: Lowercase<string>;
  /**
   * Folding animation control applied when expanding and collapsing folds.
   * Relapse uses the [Web Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
   * and settings provided here will be passed to this API.
   *
   * ---
   *
   * **Default Settings**
   *
   * ```ts
   * {
   *   fold: {
   *    duration: 220,
   *    easing: 'ease-in-out',
   *    hint: true
   * }
   * ```
   */
  fold?: FoldOptions
  /**
   * Fading animation control applied to inner contents of folds when expanding and collapsing.
   * Relapse uses the [Web Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
   * and settings provided here will be passed to this API.
   *
   * ---
   *
   * **Default Settings**
   *
   * ```ts
   * {
   *   fade: {
   *    duration: 120,
   *    easing: 'linear',
   *    hint: true
   * }
   * ```
   */
  fade?: FadeOptions;
  /**
   * Custom class names to apply to the relapse elements such as button and folds.
   *
   * ---
   *
   * **Default Settings**
   *
   * ```ts
   * {
   *   classes: {
   *    opened: 'opened', // applied to buttons
   *    expanded: 'expanded', // applied to folds
   *    disabled: 'disabled' // applied to buttons
   * }
   * ```
   */
  classes?: {
    /**
     * The opened class name which is added to buttons
     * and folds upon being opened.
     *
     * ---
     *
     * **Semantic Example**
     *
     * The class defined here will be applied to the `<summary>` tag
     * in semantic structures.
     *
     * ```html
     * <details>
     *   <!-- class applies here when fold is expanded -->
     *   <summary class="opened">Button</summary>
     *   ...
     * </details>
     *
     *
     * ```
     *
     * **Sibling Example**
     *
     * The class defined here will be applied to the `<button>` tag
     * in sibling structures. You can use this class to have the fold
     * open by default, replicating the `<details>` behaviour.
     *
     * ```html
     * <section data-relapse>
     *  <!-- class applies here when fold is expanded -->
     *  <button class="opened"></button>
     *  ...
     * </section>
     *
     *
     * ```
     *
     * ---
     *
     * @default 'opened'
     */
    opened?: string;
    /**
     * The expanded class name which is added to buttons
     * and folds upon being expanded, ie: transition ends.
     *
     *
     * ---
     *
     * **Semantic Example**
     *
     * The class defined here will be applied to the next element sibling of
     * the `<summary>` tag in semantic structures.
     *
     * ```html
     * <details>
     *  <summary class="opened">Button</summary>
     *  <!-- class applies here when fold is expanded -->
     *  <p class="expanded"></p>
     * </details>
     *
     *
     * ```
     *
     * **Sibling Example**
     *
     * The class defined here will be applied to the next element sibling of
     * the `<button>` tag.
     *
     * ```html
     * <section data-relapse="accordion">
     *  <button class="opened"></button>
     *  <!-- class applies here when fold is expanded -->
     *  <div class="expanded"></div>
     *  ...
     * </section>
     *
     *
     * ```
     *
     * ---
     *
     * @default 'expanded'
     */
    expanded?: string;
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
   * **Relapse Fold ID**
   *
   * The fold id. This value will be used as the `key`
   * reference for the fold. If the fold button or content element has an `id="*"`
   * attribute then that value will be used.
   *
   * If both the button and fold element contain an `id` attribute
   * then the `id` defined on the fold will be used.
   */
  id: string;
  /**
   * **Relapse Button Element**
   *
   * The button element which toggles this fold.
   *
   * The comments in below examples inform on the elements this value
   * will hold depending on markup structure.
   *
   * ---
   *
   * **Example 1**
   *
   * Using a semantic structure with `<details>` markup. The
   * button value will `<summary>`
   *
   * ```html
   * <div data-relapse="id">
   *  <details>
   *    <!-- The "button" element -->
   *    <summary>Collapse</summary>
   *    <p>Hello World</p>
   *  </details>
   * </div>
   * ```
   *
   * ---
   *
   * **Example 2**
   *
   * Using a basic sibling structure, wherein the `<button>` is the value.
   *
   * ```html
   * <div data-relapse="id">
   *  <!-- The "button" element -->
   *  <button>
   *    Collapse
   *  </button>
   *  ...
   * </div>
   * ```
   */
  button: HTMLElement;
  /**
   * **Relapse Fold Element**
   *
   * The fold element which will be toggled (i.e: expanded/collapsed).
   * This will always be the node wich contains the inner contents.
   *
   * The comments in below examples inform on the elements this value
   * will hold depending on markup structure.
   *
   * ---
   *
   * **Example 1**
   *
   * Using a semantic structure with `<details>` markup.
   *
   * ```html
   * <div data-relapse="id">
   *  <details>
   *    <summary>Collapse</summary>
   *    <!-- The fold "element"-->
   *    <p>
   *      Hello World
   *    </p>
   *  </details>
   * </div>
   * ```
   *
   * ---
   *
   * **Example 2**
   *
   * Using a basic sibling structure, wherein `element` will be
   * the same as the `wrapper` value.
   *
   * ```html
   * <div data-relapse="id">
   *  <button>Collapse</button>
   *  <!-- The section tag is the "element" -->
   *  <section>
   *    Hello World
   *  </section>
   * </div>
   * ```
   */
  element: HTMLElement;
  /**
   * **Relapse Fold Wrapper Element**
   *
   * The wrapper element which contains the button and element nodes.
   * For sibling structures the value will be identical to `element`.
   *
   * The comments in below examples inform on the elements this value
   * will hold depending on markup structure.
   *
   * ---
   *
   * **Example 1**
   *
   * Using a semantic structure with `<details>` markup.
   *
   * ```html
   * <div data-relapse="id">
   *  <!-- Details tag is the "wrapper" element -->
   *  <details>
   *    <summary>Collapse</summary>
   *    <p>Hello World</p>
   *  </details>
   * </div>
   * ```
   *
   * ---
   *
   * **Example 2**
   *
   * Using a basic sibling structure, wherein `wrapper` will be
   * the same as the `element` value.
   *
   * ```html
   * <div data-relapse="id">
   *  <button>Collapse</button>
   *  <!-- The section tag is the "wrapper" element -->
   *  <section>
   *    Hello World
   *  </section>
   * </div>
   * ```
   */
  wrapper: HTMLElement;
  /**
   * **Relapse Fold Index**
   *
   * The zero based index reference for the fold.
   */
  index: number;
  /**
   * **Relapse Fold Expanded**
   *
   * Whether or not the fold has expanded.
   */
  expanded: boolean;
  /**
   * **Relapse Fold Height**
   *
   * The current fold height
   */
  height: number;
  /**
   * **Relapse Fold Disabled Status**
   *
   * Whether or not the fold is disabled. This will
   * be set to `true` on expanded folds when the `persist`
   * option is enabled.
   *
   * If the fold is collapsed and this is `true` then then toggling will be prevented.
   */
  disabled: boolean;
  /**
   * **Relapse Fold Locked Status**
   *
   * Whether or not the fold is disabled and locked. This will be `true`
   * when the fold is marked as `disabled` upon intialisation.
   */
  locked: boolean;
  /**
   * **Relapse Fold Focus**
   *
   * Focus the button.
   */
  focus: (e: Event) => void;
  /**
   * **Relapse Fold Blur**
   *
   * Blur the button.
   */
  blur: (e: Event) => void;
  /**
   * **Relapse Fold Toggle**
   *
   * Toggles the fold. The expanded fold will be collapsed or vice-versa.
   */
  toggle: (e: Event) => void;
  /**
   * **Relapse Fold Enable**
   *
   * Enable the fold, Optionally accepts an `id` reference
   * to target specific fold either by a `0` based index of fold id.
   */
  enable: (id?: number | string) => void;
  /**
   * **Relapse Fold Disable**
   *
   * Disable the fold, Optionally accepts an `id` reference
   * to target specific fold either by a `0` based index of fold id.
   */
  disable: (id?: number | string) => void;
  /**
   * **Relapse Fold Open**
   *
   * Open the fold, Optionally accepts an `id` reference
   * to target specific fold either by a `0` based index of fold id.
   */
  open: (id?: number | string) => void;
  /**
   * **Relapse Fold Close**
   *
   * Close the fold,  Optionally accepts an `id` reference
   * to target specific fold either by a `0` based index of fold id.
   */
  close: (id?: number | string) => void;
  /**
   * **Relapse Fold Destroy**
   *
   * Teardown the fold and destroy its interactivity.
   */
  destroy: () => void;
}

export declare interface Folds extends Array<Fold> {
  /**
   * Index lookup
   */
  ref: { [id: string]: number }
  /**
   * Return a fold by `0` based index of by `id` attribute value.
   */
  get(id: string | number): Fold;
}

export declare enum Status {
  Static = 1,
  Transition = 2,
}

export declare interface Relapse {
  /**
   * **Relapse ID**
   *
   * The Relapse identifier Key
   */
  id: string;
  /**
   * **Relapse Options**
   *
   * Configuration options merged with defaults
   *
   * @see {@link Options}
   */
  options: Options;
  /**
   * **Relapse Status**
   *
   * The current status indicates the state of of operation executing
   *
   * - `1` Relapse is static, no expand or collapse taking place
   * - `2` Relapse is either expanding or collapsing a fold.
   */
  status: Status;
  /**
   * **Relapse Element**
   *
   * The relapse element, this will be outer most wrapper node
   *
   * @example
   * <div data-relapse="id"> // ← Value of this property
   * ...
   * </div>
   */
  element: HTMLElement;
  /**
   * **Relapse Semantic**
   *
   * Whether or not the accordion us using semantic markup.
   *
   * > **NOTE**
   * >
   * > Relapse will determine semantic structures by checking whether first child
   * > in the node tree is a `<details>` element.
   */
  semantic: boolean;
  /**
   * **Relapse Active Fold Index**
   *
   * The index of the last known expanded fold.
   */
  active: number;
  /**
   * **Relapse Opened Fold Count**
   *
   * The number of collapsed folds, ie: the open count
   */
  openCount: number;
  /**
   * **Relapse Folds**
   *
   * An array list of folds contained within the instance.
   *
   * @see {@link Fold}
   * @example
   * import relapse from 'relapse';
   *
   * const accordion = relapse();
   *
   * // Return a fold by id reference
   * accordion.folds.get('<id>')
   *
   * // The first fold occurance
   * accordion.folds[0]
   *
   * // The second fold occurance
   * accordion.folds[1]
   */
  folds: Folds;
  /**
   * **Relapse Events**
   *
   * Returns the binded events listeners of the Relapse instance
   */
  readonly events: { [K in EventNames]?: Events<Readonly<Relapse>, Fold>[] }
  /**
   * **Relapse On Event**
   *
   * Listen for an event,
   *
   * @example
   * import relapse from 'relapse';
   *
   * const accordion = relapse();
   *
   * accordion.on('expand', function(fold){
   *  console.log(fold); // The fold which was expanded
   * })
   */
  on: Events<Readonly<Relapse>, Fold, number>;
  /**
   * **Relapse Off Event**
   * Remove an event.
   */
  off: Events<Readonly<Relapse>, Fold, void>;
  /**
   * **Relapse Expand Fold**
   *
   * Expand a fold by passing its `0` based index.
   *
   * You can optionally annotate folds you need programmitic
   * control over with a `data-relapse-fold="*"` attribute and
   * pass the value provided opposed to the index.
   */
  expand: (fold?: number | string) => void;
  /**
   * **Relapse Collapse Fold**
   *
   * Collapse a fold by passing its `0` based index.
   *
   * You can optionally annotate folds you need programmitic
   * control over with a `data-relapse-fold="*"` attribute and
   * instead pass the value provided opposed to the index.
   */
  collapse: (fold?: string | number) => void;
  /**
   * **Relapse Destriy**
   *
   * Destroy the relapse instance.
   */
  destroy: () => void;
}

export declare class Methods {

  /**
   * Return the current relapse instance by its `id` value. Identifiers can be
   * defined via `data-relapse=""`. If you are not using attribute annotations,
   * then relapse will use the `id=""` value.
   *
   * If neither a `data-relapse` or `id` attribute exists then Relapse will assign
   * an identifier.
   */
  static get: {
    (id: string): Relapse;
    (ids: string[]): Relapse[];
    (): Relapse[]
  };

  /**
   * Current Version
   */
  static version: string;

  /**
   * Iterates over all existing instances of Relapse.
   */
  static each(callback: (scope?: Relapse, id?: string) => void): boolean;

  /**
   * Whether or not an instance exists for the provided identifier/s.
   */
  static has(id: string | string[]): boolean;

  /**
   * Destory and teardown all active instances or those which match the
   * provided `ids`.
   */
  static destroy(id?: string | string[]): boolean;

}

interface IRelapse extends Identity<typeof Methods> {
  /**
   * 🪗 **RELAPSE**
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
 (selector: string | HTMLElement | NodeListOf<HTMLElement>, options?: Options): Relapse;
 /**
  * 🪗 **RELAPSE**
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
 (options?: Options): Relapse[];
}

declare const Relapsed: IRelapse;

declare global {
  export interface Window {
   /**
    * 🪗 **RELAPSE**
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
    relapse: IRelapse;
  }

}

export default Relapsed;
