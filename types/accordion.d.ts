declare interface IOptions {
  /**
   * Whether multiple folds can be opened at once
   */
  multiselect?: boolean;
  /**
   * Whether the folds are collapsible
   */
  collapsible?: boolean;

  /**
   * Whether ARIA attributes are enabled
   */
  ariaEnabled?: boolean;

  /**
   * Whether W3C keyboard shortcuts are enabled
   */
  keyboard?: boolean;

  /**
   * Whether to loop header focus. Sets focus back
   * to first/last header when end/start reached.
   */
  carouselFocus?: boolean;

  /**
   * attribute for the header or content to open folds at initialization
   */
  initialOpenAttr?: string;

  /**
   * Whether to use transition at initial open
   */
  initialOpen?: boolean;
  /**
   * Delay used to show initial transition
   */
  initialOpenDelay?: number;
}

declare interface IFolds {
  /**
   * Open content.
   */
  open(transition?: boolean): void;

  /**
   * Close content.
   */
  close(transition?: boolean): void;

  /**
   * Toggle content.
   */
  toggle(transition?: boolean): void;

  /**
   * Disable fold.
   */
  disable(): void;

  /**
   * Enable fold.
   */
  enable(): void;

  /**
   * Set focus to fold button.
   */
  focus(): void;

  /**
   * Remove focus from fold button.
   */
  blur(): void;

  /**
   * Remove event listeners and ARIA attributes.
   */
  destroy(): void;
}

export type IEvents =
  /** Accordion is about to be destroyed */
  | 'destroy'

  /** Accordion has been destroyed. */
  | 'destroyed'

  /** Fold is about to be opened. */
  | 'fold:open'

  /** Fold has opened. */
  | 'fold:opened'

  /** Fold is about to be closed */
  | 'fold:close'

  /** Fold has closed. */
  | 'fold:closed'

  /** Fold button has been focused. */
  | 'fold:focus'

  /** Fold button has lost focus. */
  | 'fold:blur';

export class IAccordion {
  constructor(selector: Element, options?: IOptions);

  /**
   * Update fold instances - Use if you dynamically append/remove DOM nodes.
   */
  public update(): void;

  /**
   * Set focus to a new header button. You can also directly
   * use the native `focus()` method on the button).
   */
  public focus(target: 'next' | 'previous' | 'last' | 'first'): void;

  /**
   * Destroy fold instances, remove event listeners and ARIA attributes.
   */
  public destroy(): void;

  /**
   * Event Listener
   */
  public on(events: IEvents, fn?: (fold: IFolds) => void): void;

  /**
   * Event Listener
   */
  public once(events: IEvents, fn?: (fold: IFolds) => void): void;

  /**
   * Event Listener (OFF)
   */
  public off(events: IEvents, fn?: (fold: IFolds) => void): void;

  /**
   * Panel Folds
   */
  public folds: IFolds[];
}

export class Accordion extends IAccordion {}

export function accordion(element: Element, options?: IOptions): Accordion
