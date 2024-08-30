import spx from 'spx';
import relapse from 'relapse';
import { Drawer } from './components/drawer';
import { Tabs } from './components/tabs';
import { Methods } from './components/methods';
import { Events } from './components/events';
import { Dropdown } from './components/dropdown';

spx(
  {
    fragments: [
      'main',
      'menu'
    ],
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

spx.on('load', function ({ key }) {

  relapse.reinit();

});
