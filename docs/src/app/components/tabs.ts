import { Controller } from '@hotwired/stimulus';

export class Tabs extends Controller {

  static targets: string[] = [
    'tab',
    'btn'
  ];

  static values = {
    open: {
      default: 0,
      type: Number
    }
  };

  toggle ({ target }: { target: HTMLElement }) {

    this.openValue = +target.getAttribute('data-index');

    for (const btn of this.btnTargets) {
      btn.classList.remove('active');
    }

    for (const tab of this.tabTargets) {
      tab.classList.remove('d-block');
      tab.classList.add('d-none');
    }

    this.btnTargets[this.openValue].classList.add('active');
    this.tabTargets[this.openValue].classList.remove('d-none');
    this.tabTargets[this.openValue].classList.add('d-block');

  }

  openValue: number;
  tabTargets: HTMLElement[];
  btnTargets: HTMLElement[];

}
