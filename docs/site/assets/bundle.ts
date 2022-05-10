import { accordion } from 'relapse';

const c = accordion(document.querySelector('#accordion'), {
  transition: 300,
  multiple: false
});

// c.folds[0].disable(3);

c.on('toggle', function (fold) {

  // if (fold.number === 1) fold.destroy();

});

// const t = accordion('#accordion-2');
// console.log(c);
