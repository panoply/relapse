import spx from 'spx';
import relapse from 'relapse';
import { Controller as stimulus } from './components/controller';
import { Drawer } from './components/drawer';
import { Tabs } from './components/tabs';

spx.connect(
  {
    targets: [ '#main', '.spx' ],
    render: 'morph'
  }
)(function () {

  stimulus.connect(
    {
      Tabs,
      Drawer
    }
  );

  relapse();

});

spx.on('visit', () => {

  window.relapse.forEach((scope, key) => {
    if (!key.startsWith('sidebar'))scope.destroy();
  });

});

spx.on('load', () => {

  relapse();

});
