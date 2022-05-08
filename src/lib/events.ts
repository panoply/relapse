import { IAccordion } from '../types';

/**
 * Event Emitter
 *
 * The emitted events for the accordion.
 */
export const $events = (events: IAccordion.Scope['events']) => ({

  emit: (name: IAccordion.EventNames, scope: IAccordion.Scope, fold?: IAccordion.Fold): boolean => {

    const event = events[name] || [];
    const length = event.length;

    let prevent: boolean = null;

    for (let i = 0; i < length; i++) {
      const returns = event[i].apply(scope, [ fold ]);
      if (prevent === null && returns === false) prevent = true;
    }

    return prevent;

  },

  on: (name: IAccordion.EventNames, callback: (this: IAccordion.Scope, folds?: IAccordion.Fold) => void) => {

    if (!events[name]) events[name] = [];
    events[name].push(callback as any);

  },

  off: (name: IAccordion.EventNames, callback: () => void) => {

    const live = [];
    const event = events[name];

    if (event && callback) {
      let i = 0;
      const len = event.length;
      for (; i < len; i++) if (event[i] !== callback) live.push(event[i]);
    }

    if (live.length) {
      event[name] = live;
    } else {
      delete event[name];
    }

  }
});
