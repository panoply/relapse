import spx, { SPX } from 'spx';

export class Tabs extends spx.Component<typeof Tabs.define> {

  static define = {
    state: {
      size: Number,
      open: {
        default: 0,
        typeof: Number
      }
    },
    nodes: <const>[
      'button',
      'tab'
    ]
  };

  onmount () {

    this.state.size = this.dom.tabNodes.length;

  }

  toggle ({ attrs }: SPX.Event<{ index: number }>) {

    if (this.state.open === attrs.index) return;

    for (let i = 0, s = this.state.size; i < s; i++) {
      if (i === attrs.index) {
        this.dom.buttonNodes[i].classList.add('active');
        this.dom.tabNodes[i].classList.remove('d-none');
      } else {
        this.dom.buttonNodes[i].classList.remove('active');
        this.dom.tabNodes[i].classList.toggle('d-none', true);
      }
    }

    this.state.open = attrs.index;
  }

}
