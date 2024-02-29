import relapse, { Fold, Relapse } from 'relapse';
import spx from 'spx';

export class Events extends spx.Component<typeof Events.connect> {

  relapse: Relapse;
  colors = [ 'fc-cyan', 'fc-pink', 'fc-purple', 'fc-green' ];

  static connect = {
    state: {
      count: Number
    }
  };

  onload (): void {

    this.relapse = relapse(this.relapseNode);
    this.relapse.on('focus', this.focus, this);
    this.relapse.on('collapse', this.collapse, this);
    this.relapse.on('expand', this.expand, this);
    this.relapse.on('toggle', this.toggle, this);

  }

  insert (message: string, fold: number) {

    ++this.state.count;

    const element = document.createElement('div');
    element.className = `d-block pb-1 message ${this.colors[fold]}`;
    element.ariaLabel = `${this.state.count}`;
    element.innerText = message;

    this.logNode.appendChild(element);
    this.logNode.scrollTop = this.logNode.scrollHeight;

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

  relapseNode: HTMLElement;
  logNode: HTMLElement;

}
