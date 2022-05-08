import { IAccordion } from './src/types';

/**
 * *RELAPSE ACCORDION*
 *
 * Creates a collapsible accordion component.
 */
declare const accordion: (
  selector: string | Element,
  options?: IAccordion.Options
) => Readonly<IAccordion.Scope>;

declare namespace relapse {
  export { accordion };
}

export = relapse;
