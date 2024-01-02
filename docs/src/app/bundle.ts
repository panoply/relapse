import spx from 'spx';
import relapse from 'relapse';
import { Controller as stimulus } from './components/controller';
import { Drawer } from './components/drawer';
import { Tabs } from './components/tabs';
import { Methods } from './components/methods';
import { Events } from './components/events';
import { Dropdown } from './components/dropdown';

spx.connect(
  {
    targets: [ '#main', '.spx' ],
    render: 'morph'
  }
)(function () {

  stimulus.connect(
    {
      Tabs,
      Drawer,
      Methods,
      Events,
      Dropdown
    }
  );

  relapse();

});

spx.on('visit', () => {

  window.relapse.each((scope, key) => {
    if (!key.startsWith('/')) scope.destroy();
  });

});

spx.on('load', (page) => {

  relapse();

  if (page.key.startsWith('/relapse/usage/styling') === false) {
    const styling = relapse.get('/relapse/usage/styling');
    if (styling.openCount !== 0) styling.collapse();
  } else {
    const styling = relapse.get('/relapse/usage/styling');
    styling.expand(0);
  }

  if (page.key.startsWith('/relapse/api') === false) {
    const api = relapse.get('/relapse/api');
    if (api.openCount !== 0) api.collapse();
  } else {
    const api = relapse.get('/relapse/api');
    api.expand(0);
  }

  if (page.key.startsWith('/relapse/usage') === false) {
    const usage = relapse.get('/relapse/usage');
    if (usage.openCount !== 0) usage.collapse();
  } else {
    const usage = relapse.get('/relapse/usage');
    usage.expand(0);
  }

});
