import relapse from 'relapse';
import { Drawer } from './components/drawer';
import { Application, Controller } from '@hotwired/stimulus';
import spx from 'spx';

class Control extends Controller {

  static targets: string[] = [
    ''
  ];

  connect (): void {

  }

}

spx.connect({
  targets: [ '#main' ],
  render: 'replace'
})(function () {

  const app = Application.start();
  app.register('control', Control);
  app.register('drawer', Drawer);
  relapse();

});

spx.on('load', () => {
  relapse();
});
