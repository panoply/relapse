/* eslint-disable array-bracket-spacing */

const eleventy = require('@panoply/11ty')
const htmlmin = require('@sardine/eleventy-plugin-tinyhtml');
const md = require('markdown-it');
const mdcontainer = require('markdown-it-container')
const papyrus = require('papyrus');


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

      } else if (language ==='css:editor') {

        language = language.slice(0, language.indexOf(':'))

        console.log(language);

        code = papyrus.static(raw, {
          language,
          editor: false,
          showSpace: false,
          trimEnd: true,
          trimStart: true,
          addClass: {
            pre: ['css-editor']
          }
        });

        console.log(code);

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

module.exports = eleventy (function(config){

  const markdown = md({
    html: true,
    breaks: true,
    highlight: (str, lang) => highlighter(markdown, str, lang)
  })
  .use(mdcontainer, 'note', { render: (tokens, idx) => notes(tokens, idx) })
  .use(mdcontainer, 'grid', { render: (tokens, idx) => grid(markdown, tokens, idx) })
  .disable("code");;


  config.setLibrary('md', markdown);
  config.setDynamicPermalinks(false);


  return {
    htmlTemplateEngine: 'liquid',
    passthroughFileCopy: false,
    pathPrefix: '',
    templateFormats: ['liquid', 'json', 'md', 'css', 'html', 'yaml'],
    dir: {
      input: 'src',
      output: 'public',
      includes: 'include',
      layouts: 'layout',
      data: ''
    }
  };

});
