import relapse, { Relapse } from 'relapse';
import spx, { SPX } from 'spx';

export class Methods extends spx.Component<typeof Methods.define> {

  static define = {
    state: {
      open: {
        default: 0,
        typeof: Number
      }
    }
  };

  onmount (): void {

    this.methods = relapse(this.relapseNode, {
      multiple: true,
      persist: false
    });

    this.methods.on('toggle', (fold) => {

      if (fold.expanded) {
        this.collapse({ attrs: { fold: fold.index } });
      } else {
        this.expand({ attrs: { fold: fold.index } });
      }

    });
  }

  expand ({ attrs }: { attrs: { fold: number } }) {

    this.methods.expand(attrs.fold);

    this.openerNodes[attrs.fold].classList.add('disabled');
    this.openerNodes[attrs.fold].classList.remove('active');
    this.closerNodes[attrs.fold].classList.remove('disabled');
    this.closerNodes[attrs.fold].classList.add('active');
  }

  collapse ({ attrs }: { attrs: { fold: number } }) {

    this.methods.collapse(attrs.fold);

    this.openerNodes[attrs.fold].classList.remove('disabled');
    this.closerNodes[attrs.fold].classList.remove('active');
    this.closerNodes[attrs.fold].classList.add('disabled');
  }

  disable ({ attrs }: SPX.Event<{ fold: number }>) {

    this.methods.expand(attrs.fold);

  }

  methods: Relapse;

  relapseNode: HTMLElement;
  openerNodes: HTMLElement[];
  closerNodes: HTMLElement[];

}
