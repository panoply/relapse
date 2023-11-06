
import { Controller } from '@hotwired/stimulus';

class Tabs extends Controller {

  static targets: string[] = [
    'tab'
  ];

  static values = {
    open: Number
  };

  toggle ({ target }: { target: HTMLElement }) {
    for (const tab of this.tabTargets) {
      if(tab.classList.contains('d-block')) {
        tab.classList.remove('d-block')
      }
    }

    target.classList.add('d-block');
    this.openValue = +target.getAttribute('data-index');

  }

  openValue: number;
  tabTargets: HTMLElement[];

}
