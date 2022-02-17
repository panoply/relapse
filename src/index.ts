/* eslint-disable no-use-before-define */
import EventEmitter from 'ev-emitter';
import { MergeExclusive } from 'type-fest';
import { Folds } from './folds';

/**
 * Accordion
 */
export class Accordion extends EventEmitter {

  static instances = 0;

  options: {
    keyboard: boolean,
    button: boolean,
    multiselect: boolean,
    ariaEnabled: boolean,
    collapsible: boolean,
    carouselFocus: boolean,
    initialOpenAttr: string,
    initialOpen: boolean,
    initialOpenDelay: number,
  } = {
    keyboard: true,
    button: false,
    multiselect: true,
    ariaEnabled: true,
    collapsible: true,
    carouselFocus: true,
    initialOpen: true,
    initialOpenDelay: 200,
    initialOpenAttr: 'data-open'
  };

  id: string;
  folds: Folds[];
  element: MergeExclusive<{ fold?: Folds; accordion?: Accordion; }, HTMLElement>;
  active: Function;

  constructor (element: Element, options: Partial<Accordion['options']> = {}) {

    super();

    this.element = element as Accordion['element'];
    this.element.accordion = this;
    this.id = `a${++Accordion.instances}`;
    this.element.setAttribute('id', this.id);
    this.options = Object.assign(this.options, options);
    this.folds = [];
    this.bind();
    this.init();
    this.update();

  }

  update () {

    this.folds = [];

    const children = this.element.children;
    const length = children.length;

    for (let i = 0; i < length; i = i + 2) {

      const header = children[i] as Folds['header'];
      const content = children[i + 1] as Folds['content'];

      // get fold instance if there is already one
      let fold: Folds = header.fold;

      // create new one when header and content exist
      if (!fold && header && content) fold = new Folds(this, header, content);
      if (fold) this.folds.push(fold);

    }
  }

  focus (target: string) {

    let focused = null;
    const folds = this.folds.length;

    for (let i = 0; i < folds && focused === null; i++) {
      if (this.folds[i].focused) focused = i;
    }

    if ((target === 'prev' || target === 'next') && focused === null) {
      target = target === 'prev' ? 'last' : 'first';
    }

    if (target === 'prev' && focused === 0) {
      if (!this.options.carouselFocus) return;
      target = 'last';
    }

    if (target === 'next' && focused === folds - 1) {
      if (!this.options.carouselFocus) return;
      target = 'first';
    }

    switch (target) {
      case 'prev': this.folds[--focused].focus(); break;
      case 'next': this.folds[++focused].focus(); break;
      case 'last': this.folds[folds - 1].focus(); break;
      case 'first': default: this.folds[0].focus();
    }

  }

  destroy () {

    this.emitEvent('destroy');
    this.element.removeAttribute('id');

    for (const fold of this.folds) fold.destroy();

    this.unbind();
    this.clean();
    this.element.accordion = null;
    this.emitEvent('destroyed');

  }

  private handleFoldOpen (openFold: Folds) {

    if (this.options.multiselect) return;
    for (const fold of this.folds) if (openFold !== fold) fold.close();

  }

  private init () {

    if (!this.options.ariaEnabled) return;
    if (this.options.multiselect) {
      this.element.setAttribute('aria-multiselectable', 'true');
    }

  }

  private clean () {

    this.element.removeAttribute('aria-multiselectable');

  }

  private bind () {

    this.active = this.handleFoldOpen.bind(this);
    this.on('accordion:open', this.active);

  }

  private unbind () {

    this.off('accordion:open', this.active);

  }

}

export function accordion (element: Element, options: Partial<Accordion['options']> = {}) {

  return new Accordion(element, options);
}
