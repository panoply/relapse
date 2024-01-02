/* eslint-disable array-bracket-spacing */

const eleventy = require('@panoply/11ty')
const svgsprite = require('eleventy-plugin-svg-sprite');
const htmlmin = require('@sardine/eleventy-plugin-tinyhtml');
const md = require('markdown-it');
const mdcontainer = require('markdown-it-container')
const papyrus = require('papyrus');
const fs = require('node:fs')
const { join } = require('node:path');
const { cwd } = require('node:process');

function versions ()  {

  const ver = require('../package.json').version


  return fs.readdirSync(join(cwd(), 'version'))
  .filter(v => v !== '.DS_Store')
  .sort()
  .map(version => {
   const v = version.replace(/\.zip/, '')
   const curr = ver.replace(/\.\d$/, 'x')
   const url = curr === v ? `/relapse/` : `/relapse/v/${v}/`
   return `<li><a href="${url}" spx-disable>${v}</a></li>`
  }).join('')

}

/**
 * Sugar helper for generating markup. Just a simple `.join('')`
 * utility
 *
 * @param {string[]} lines
 * @returns {string}
 */
function string (lines) {

  return lines.join('')

}


function highlighter (md, raw, language) {

  let code = '';


  if (language) {

    try {

      if (language === 'bash' || language === 'cli' || language === 'shell') {

        code = papyrus.static(raw, {
          language,
          editor: false,
          showSpace: false,
          showTab: false,
          showCR: false,
          showLF: false,
          showCRLF: false,
          lineNumbers: false
        })

      } else {

        code = papyrus.static(raw, {
          language,
          editor: false,
          showSpace: false,
          trimEnd: true,
          trimStart: true
        });

      }

    } catch (err) {

      code = md.utils.escapeHtml(raw);

      console.error(
        'HIGHLIGHTER ERROR\n',
        'LANGUAGE: ' + language + '\n\n', err);
    }

  } else {

    code = md.utils.escapeHtml(raw);

  }


  return code

};


function tabs(md, tokens, idx) {

  if(tokens[idx].nesting === 1) {

    const col = tokens[idx].info.trim().match(/^tabs\s+(.*)$/);

    if (col !== null) {

      // opening tag
      return col[1] === 'example' ? string([
        /* html */`
        <div data-controller="tabs">
          <div class="row gx-0 bd tabs py-2 px-2">
            <div class="col-auto mr-2">
              <button
                type="button"
                class="btn upcase tab active"
                data-index="0"
                aria-label="Preview Example"
                data-tooltip="top"
                data-tabs-target="btn"
                data-action="tabs#toggle">
                DEMO
              </button>
            </div>
            <div class="col-auto">
              <button
                type="button"
                class="btn upcase tab"
                data-index="1"
                data-tabs-target="btn"
                aria-label="Markup Structure"
                data-tooltip="top"
                data-action="tabs#toggle">
                HTML
              </button>
            </div>
            <!-- <div class="col-auto">
              <button
                type="button"
                class="btn upcase tab"
                data-index="2"
                aria-label="Styling"
                data-tooltip="top"
                data-tabs-target="btn"
                data-action="tabs#toggle">
                CSS
              </button>
            </div> -->
            <div class="col-auto ml-auto">
              <a
                class="btn upcase tab"
                href="http://tinyurl.com/38twtkpb"
                target="_blank"
                aria-label="Open in flems playground"
                data-tooltip="top">
                FLEMS
                <svg class="icon icon-right" role="group">
                  <use xlink:href="#svg-flems"></use>
                </svg>
              </a>
            </div>
          </div>
          <div class="col-12 tab-content p-4" data-tabs-target="tab">
        `,
      ]) : col[1] ==='markup' ? string([
        /* html */`
        <div data-controller="tabs">
          <div class="row gx-0 bd tabs py-2 px-2">
            <div class="col-auto mr-2">
              <button
                type="button"
                class="btn upcase tab active"
                data-index="0"
                data-tabs-target="btn"
                data-action="tabs#toggle">
                SEMANTIC
              </button>
            </div>
            <div class="col-auto">
              <button
                type="button"
                class="btn upcase tab"
                data-index="1"
                data-tabs-target="btn"
                data-action="tabs#toggle">
                SIBLING
              </button>
            </div>
          </div>
          <div class="col-12 tab-content" data-tabs-target="tab">
        `,
      ]) : string([
        /* html */`
          <div class="col-12 tab-content d-none" data-tabs-target="tab">
        `
      ])
    }
   }



  return '</div>'


}


/**
 * Generates HTML markup for various blocks
 *
 * @param {"note"|"tip"|"important"} type The type of alert to create.
 * @param {Array<markdownit>} tokens Array of MarkdownIt tokens to use.
 * @param {number} index The index of the current token in the tokens array.
 * @returns {string} The markup for the alert.
 */
function grid(md, tokens, idx) {

  if(tokens[idx].nesting === 1) {

   var col = tokens[idx].info.trim().match(/^grid\s+(.*)$/);

   if (col !== null) {

     // opening tag
     return [
       /* html */`
       <div class="${md.utils.escapeHtml(col[1])}">
       `
     ].join('')
   }


  }

   return '</div>'

}


/**
 * Generates HTML markup for various blocks
 *
 * @param {"note"|"tip"|"important"} type The type of alert to create.
 * @param {Array<markdownit>} tokens Array of MarkdownIt tokens to use.
 * @param {number} index The index of the current token in the tokens array.
 * @returns {string} The markup for the alert.
 */
function notes(tokens, index) {

  return tokens[index].nesting === 1 ? `<blockquote class="note">` : '</blockquote>'

}

/**
 * Generates HTML markup for various blocks
 *
 * @param {"note"|"tip"|"important"} type The type of alert to create.
 * @param {Array<markdownit>} tokens Array of MarkdownIt tokens to use.
 * @param {number} index The index of the current token in the tokens array.
 * @returns {string} The markup for the alert.
 */
function heading(md, tokens, idx) {


  if(tokens[idx].nesting === 1) {

    var col = tokens[idx].info.trim().match(/^heading\s+(.*)$/);

    if (col !== null) {

      // opening tag
      return string([
        /* html */`
        <div class="row row-rev heading-ico mb-2">
          <div class="col-auto pl-1">${col[1] === 'JS' ? JS : HTML}</div>
          <div class="col-auto">
        `
      ])
    }


  }

  return '</div></div>'


}

module.exports = eleventy (function(config){

  const markdown = md({
    html: true,
    breaks: true,
    highlight: (str, lang) => highlighter(markdown, str, lang)
  })
  .use(mdcontainer, 'tabs', { render: (tokens, idx) => tabs(markdown, tokens, idx) })
  .use(mdcontainer, 'note', { render: (tokens, idx) => notes(tokens, idx) })
  .use(mdcontainer, 'grid', { render: (tokens, idx) => grid(markdown, tokens, idx) })
  .use(mdcontainer, 'heading', { render: (tokens, idx) => heading(markdown, tokens, idx) })
  .disable("code");;

  config.addLiquidShortcode('version', () => `<span class="lower">v</span>${require('../package.json').version}`);
  config.addLiquidShortcode('versions', () => versions());
  config.setLibrary('md', markdown);
  config.setDynamicPermalinks(false);
  config.addPlugin(svgsprite, {
    path: 'src/svg',
    spriteConfig: {
      mode: {
        symbol: {
          inline: true,
          sprite: 'sprite.svg',
          example: false
        }
      },
      shape: {
        transform: ['svgo'],
        id: {
          generator: 'svg-%s'
        }
      },
      svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false
      }
    }
  });

  if(process.env.ENV ==='production') {
    config.addPlugin(htmlmin, {
      collapseBooleanAttributes: false,
      collapseWhitespace: true,
      decodeEntities: true,
      html5: true,
      removeAttributeQuotes: false,
      removeComments: true,
      removeOptionalTags: false,
      sortAttributes: true,
      sortClassName: true
    });
  }



  return {
    htmlTemplateEngine: 'liquid',
    passthroughFileCopy: false,
    pathPrefix: '/relapse',
    templateFormats: ['liquid', 'json', 'md', 'css', 'html', 'yaml'],
    dir: {
      input: 'src',
      output: 'public',
      includes: 'views/include',
      layouts: 'views/layout',
      data: 'data'
    }
  };

});
