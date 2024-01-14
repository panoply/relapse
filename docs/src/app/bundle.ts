import spx from 'spx';
import relapse from 'relapse';
import { Drawer } from './components/drawer';
import { Tabs } from './components/tabs';
import { Methods } from './components/methods';
import { Events } from './components/events';
import { Dropdown } from './components/dropdown';

spx.connect(
  {
    fragments: [ '#main' ],
    method: 'morph',
    components: {
      Methods,
      Dropdown,
      Events,
      Tabs,
      Drawer
    }
  }
)(function () {

  relapse();

});

spx.on('visit', function () {

  relapse.each((scope, key) => {
    if (!key.startsWith('/')) {
      scope.destroy();
    }
  });

});

spx.on('load', function ({ key }) {

  relapse();

  for (const id of [
    '/relapse/usage',
    '/relapse/usage/styling',
    '/relapse/api',
    '/relapse/examples'
  ]) {

    if (key.startsWith(id)) {
      if (id.endsWith('/styling')) {
        if (key.endsWith('/styling')) relapse.get(id).expand(0);
      } else {
        relapse.get(id).expand(0);
      }
    } else {
      const { collapse, openCount } = relapse.get(id);
      if (openCount !== 0) collapse();
    }

  }

});
