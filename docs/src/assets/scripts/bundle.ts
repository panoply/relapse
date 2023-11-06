import relapse from 'relapse';
import { Drawer } from './components/drawer';
import { Application } from '@hotwired/stimulus';
import spx from 'spx';

spx.connect({
  targets: [ '#main' ],
  render: 'replace'
})(function () {

  const app = Application.start();
  app.register('drawer', Drawer);
  relapse();

});

spx.on('load', () => {
  relapse();
});
