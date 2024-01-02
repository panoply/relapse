import { Controller } from '@hotwired/stimulus';
import relapse, { Relapse } from 'relapse';

export class Methods extends Controller<HTMLElement> {

  methods: Relapse;

  static targets: string[] = [
    'relapse',
    'opener',
    'closer'
  ];

  static values = {
    open: {
      default: 0,
      type: Number
    }
  };

  connect (): void {

    this.methods = relapse(this.relapseTarget, {
      multiple: true,
      persist: false
    });

    this.methods.on('toggle', (fold) => {

      if (fold.expanded) {
        this.collapse({ params: { fold: fold.index } });
      } else {
        this.expand({ params: { fold: fold.index } });
      }

    });
  }

  expand ({ params }: { params: { fold: number } }) {

    this.methods.expand(params.fold);

    this.openerTargets[params.fold].classList.add('disabled');
    this.openerTargets[params.fold].classList.remove('active');

    this.closerTargets[params.fold].classList.remove('disabled');
    this.closerTargets[params.fold].classList.add('active');
  }

  collapse ({ params }: { params: { fold: number } }) {

    this.methods.collapse(params.fold);

    this.openerTargets[params.fold].classList.remove('disabled');

    this.closerTargets[params.fold].classList.remove('active');
    this.closerTargets[params.fold].classList.add('disabled');
  }

  disable ({ params }: { params: { fold: number } }) {

    this.methods.expand(params.fold);

  }

  relapseTarget: HTMLElement;
  openerTargets: HTMLElement[];
  closerTargets: HTMLElement[];

}
