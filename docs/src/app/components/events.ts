import { Controller } from '@hotwired/stimulus';
import relapse, { Fold, Relapse } from 'relapse';

export class Events extends Controller<HTMLElement> {

  relapse: Relapse;
  colors = [ 'fc-cyan', 'fc-pink', 'fc-purple', 'fc-green' ];

  static targets: string[] = [
    'relapse',
    'log'
  ];

  static values = {
    count: {
      default: 0,
      type: Number
    }
  };

  connect (): void {

    this.relapse = relapse(this.relapseTarget);
    this.relapse.on('focus', this.focus, this);
    this.relapse.on('collapse', this.collapse, this);
    this.relapse.on('expand', this.expand, this);
    this.relapse.on('toggle', this.toggle, this);

  }

  insert (message: string, fold: number) {

    this.countValue += 1;

    const element = document.createElement('div');
    element.className = `d-block pb-1 message ${this.colors[fold]}`;
    element.ariaLabel = `${this.countValue}`;
    element.innerText = message;

    this.logTarget.appendChild(element);
    this.logTarget.scrollTop = this.logTarget.scrollHeight;

  }

  toggle (fold: Fold) {

    this.insert(
      `Fold at index ${fold.index} was toggled and will ${fold.expanded ? 'collapse' : 'expand'}`,
      fold.index
    );

  }

  focus (fold: Fold) {

    this.insert(
      `Fold at index ${fold.index} was focused and will ${fold.expanded ? 'collapse' : 'expand'}`,
      fold.index
    );

  }

  collapse (fold: Fold) {

    this.insert(
      `Fold at index ${fold.index} was collapsed and is closed`,
      fold.index
    );

  }

  expand (fold: Fold) {

    this.insert(
      `Fold at index ${fold.index} was expanded and is open`,
      fold.index
    );

  }

  relapseTarget: HTMLElement;
  logTarget: HTMLElement;
  countValue: number;

}
