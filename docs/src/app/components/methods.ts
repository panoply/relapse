import relapse, { Relapse } from 'relapse';
import spx, { SPX } from 'spx';
import papyrus from 'papyrus';

export class Methods extends spx.Component<typeof Methods.define> {

  static define = {
    state: {
      open: {
        default: 0,
        typeof: Number
      }
    },
    nodes: <const>[
      'relapse',
      'opener',
      'closer',
      'render',
      'foldDuration',
      'fadeDuration'
    ]
  };

  onmount (): void {

    this.methods = relapse(this.dom.relapseNode, {
      multiple: true,
      persist: false
    });

    this.methods.on('toggle', (fold) => {
      if (fold.expanded) {
        this.collapse({ attrs: { fold: fold.index } });
      } else {
        this.expand({ attrs: { fold: fold.index } });
      }
    });


    this.code();

  }

  code () {

    this.dom.renderNode.innerHTML = papyrus.static(JSON.stringify({
      multiple: this.methods.options.multiple,
      persist: this.methods.options.persist,
      fold: {
        easing: 'ease-in-out',
        duration: this.methods.options.fold.duration
      },
      fade: {
        duration: this.methods.options.fade.duration,
        transition: 'linear'
      }
    }, null, 2), {
      language: 'javascript',
      lineNumbers: false,
      editor: false
    });

  }

  options ({ attrs, target }) {

    if (attrs.type === 'fade') {
      this.methods.config({ fade: { duration: +target.value } });
      this.dom.fadeDurationNode.innerText = `${this.methods.options.fade.duration}`;
    } else if (attrs.type === 'fold') {
      this.methods.config({ fold: { duration: +target.value } });
      this.dom.foldDurationNode.innerText = `${this.methods.options.fold.duration}`;
    } else if (attrs.type === 'multiple') {
      this.methods.config({ multiple: target.checked });
    } else if (attrs.type === 'persist') {
      this.methods.config({ persist: target.checked });
    }

    this.code();

  }

  expand ({ attrs }: { attrs: { fold: number } }) {

    this.methods.expand(attrs.fold);

    this.dom.openerNodes[attrs.fold].classList.add('disabled');
    this.dom.openerNodes[attrs.fold].classList.remove('active');
    this.dom.closerNodes[attrs.fold].classList.remove('disabled');
    this.dom.closerNodes[attrs.fold].classList.add('active');
  }

  collapse ({ attrs }: { attrs: { fold: number } }) {

    this.methods.collapse(attrs.fold);

    this.dom.openerNodes[attrs.fold].classList.remove('disabled');
    this.dom.closerNodes[attrs.fold].classList.remove('active');
    this.dom.closerNodes[attrs.fold].classList.add('disabled');
  }

  disable ({ attrs }: SPX.Event<{ fold: number }>) {

    this.methods.expand(attrs.fold);

  }


  methods: Relapse;

}
