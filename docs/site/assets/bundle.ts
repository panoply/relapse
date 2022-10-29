import relapse from 'relapse';

document.addEventListener('DOMContentLoaded', () => {

  const accordion = relapse('#accordion', {
    classes: {
      opened: 'is-open'
    }
  });

  relapse('.multi');

  relapse.get();

  // @ts-ignore
  console.log('Relapse Instances:', window.relapse);
  console.log('-'.repeat(50));

  accordion.on('toggle', function (fold) {

    console.log('Toggle Event: Fired');
    console.log('Toggle Fold:', fold);
    console.log('Toggle Scope:', this);
    console.log('-'.repeat(50));

  });

  accordion.on('focus', function (fold) {

    console.log('Focus Event: Fired');
    console.log('Focus Fold:', fold);
    console.log('Focus Scope:', this);
    console.log('-'.repeat(50));

  });

  accordion.on('expand', function (fold) {

    console.log('Expand Event: Fired');
    console.log('Expand Fold:', fold);
    console.log('Expand Scope:', this);
    console.log('-'.repeat(50));

  });

  accordion.on('collapse', function (fold) {

    console.log('Collapse Event: Fired');
    console.log('Collapse Fold:', fold);
    console.log('Collapse Scope:', this);
    console.log('-'.repeat(50));

  });

  /* -------------------------------------------- */
  /* TRIGGER FOLD                                 */
  /* -------------------------------------------- */

  const fold_0 = document.querySelector('#fold-0');

  fold_0.addEventListener('click', () => {

    console.log('Programming Toggle: Fired on Fold with index 0');
    console.log('-'.repeat(50));
    accordion.expand(0);

  });

  const fold_1 = document.querySelector('#fold-1');

  fold_1.addEventListener('click', () => {

    console.log('Programming Toggle: Fired on Fold with index 1');
    console.log('-'.repeat(50));
    accordion.expand(1);

  });

  /* -------------------------------------------- */
  /* DISABLE / ENABLE FOLD                        */
  /* -------------------------------------------- */

  // Fold Targeting
  const fold_2 = document.querySelector('#fold-2');

  let disabled = false;

  fold_2.addEventListener('click', () => {

    if (!disabled) {

      console.log('Programming Disable: Disabled Fold 2');
      console.log('-'.repeat(50));

      accordion.folds[2].disable();
      fold_2.innerHTML = 'Fold 2 is disabled (click to enable)';
      disabled = true;
    } else {
      console.log('Programming Enable: Enabled Fold 2');
      console.log('-'.repeat(50));
      accordion.folds[2].enable();
      fold_2.innerHTML = 'Click to disable Fold 2';
      disabled = false;
    }

  });

  /* -------------------------------------------- */
  /* DESTROY                                      */
  /* -------------------------------------------- */

  // Fold Targeting
  const fold_3 = document.querySelector('#fold-3');

  fold_3.addEventListener('click', () => {

    console.log('Destroy: Destroyed Fold 3');
    console.log('-'.repeat(50));

    accordion.folds[3].destroy(true);
    fold_2.innerHTML = 'Fold 3 was destroyed';

  });

  /* -------------------------------------------- */
  /* EXPAND                                       */
  /* -------------------------------------------- */

  const fold_4 = document.querySelector('#fold-4');

  fold_4.addEventListener('click', () => {

    console.log('Programmatic Expand: Fold 4 is expanded');
    console.log('Programmatic Expanf: Disabling persist');
    accordion.config.persist = false;
    console.log('-'.repeat(50));

    if (accordion.folds[4].expanded) accordion.collapse(4); else accordion.expand(4);

  });

  relapse('#expanded');

});
