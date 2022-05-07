export interface IOptions {
  /**
   * The fold to open an initialization,
   * set to `NaN` to disable or if you've
   * defined this in the DOM using `opened`
   * class name.
   *
   * @default NaN
   */
  initial?: number | string;
  /**
   * Whether or not to persist a fold, when
   * `true` a fold will be always kept open.
   *
   * @default true
   */
  persist?: boolean;
  /**
   * Whether or not to allow multiple folds
   * to be opened.
   *
   * @default false
   */
  multiple?: boolean;
  /**
   * Whether or not to preserve the opened
   * state between page refreshed. Uses localStorage.
   *
   * @default false
   */
  preserve?: boolean;
  /**
   * Whether W3C keyboard shortcuts are enabled
   *
   * @default true
   */
  keyboard?: boolean;
  /**
   * Whether ARIA attributes are enabled
   *
   *  @default true
   */
  aria?: boolean;
  /**
   * SVG icon paths to use between
   * opened and closed states, set this
   * to `null` to disable icons. Icon expect
   * an SVG path string to be passed.
   */
  icons?: {
    /**
     * A closed icon SVG path
     *
     * @default right
     * @example >
     */
    closed?: string;
    /**
     * A closed icon SVG path
     *
     * @default down
     * @example ˅
     */
    opened?: string;
    /**
     * A locked icon SVG path
     *
     * @default locked
     */
    locked?: string;
  }
}

export interface IFold {
  /**
   * A unique string id for this fold. If the fold is wrapped
   * with an `id` attribute defined on the element, that is
   * what will be used. If the fold is using a
   * will be assigned.
   */
  id: string;
  /**
   * The button element which toggles this fold.
   */
  button: HTMLElement;
  /**
   * The content element which is toggled, ie: the fold.
   */
  content: HTMLElement;
  /**
   * The zero based index reference for the fold.
   */
  number: number;
  /**
   * Whether or not this fold is opened
   */
  opened: boolean;
  /**
   * Whether or not this fold is focused
   */
  focused: boolean;
  /**
   * Whether or not this fold is disabled
   */
  disabled: boolean;
  /**
   * Whether or not this fold is locked
   */
  locked: boolean;
  /**
   * Enable the fold
   */
  enable: () => void;
  /**
   * Disable the fold
   */
  disable: () => void;
  /**
   * Focus the fold button
   */
  focus: () => void;
  /**
   * Blur the fold button
   */
  blur: () => void;
  /**
   * Toggle the fold
   */
  toggle: (transition?: boolean) => void;
  /**
   * Open the fold
   */
  open: (transition?: boolean) => void;
  /**
   * Close the fold
   */
  close: (transition?: boolean) => void;
  /**
   * Destroy the fold
   */
  destroy: () => void;
}

export interface IScope {
  /**
   * The accordion instance. This is a number
   * value which infers the number of accordion
   * elements.
   */
  id: string;
  /**
   * The accordion element
   */
  element: Element;
  /**
   * The accordion options
   */
  config: IOptions;
  /**
   * The folds nested within the accordion
   * element.
   */
  folds: IFold[]
  /**
   * The events listening for dispatches
   */
  events: { [name: string]: Array<() => void> }
  /**
   * Focuses the accordion
   */
  focus: (target: 'prev' | 'next' | 'last' | 'first') => void;
  /**
   * Destroy the accordion
   */
  destroy: () => void;
  /**
   * Event Listener
   */
  on: (
    event: 'open' | 'opened' | 'close' | 'closed' | 'focus' | 'blur',
    callback: (this: IScope, fold: IFold) => void
  ) => void
}
