/* eslint-disable array-bracket-spacing */

const highlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const htmlmin = require('@sardine/eleventy-plugin-tinyhtml');
const md = require('markdown-it');

/**
 * @type {import('./eleventy').LocalConfigFunction}
 */
module.exports = function (config) {
  const markdown = md({ html: true, breaks: true });

  config.setBrowserSyncConfig({ notify: false });
  config.setLibrary('md', markdown);
  config.setDynamicPermalinks(false);
  config.addPlugin(highlight);
  config.addPlugin(htmlmin, {
    collapseBooleanAttributes: false,
    collapseWhitespace: true,
    decodeEntities: true,
    html5: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeOptionalTags: true,
    sortAttributes: true,
    sortClassName: true
  });

  return {
    htmlTemplateEngine: 'liquid',
    passthroughFileCopy: false,
    pathPrefix: '',
    templateFormats: ['liquid', 'json', 'md', 'css', 'html', 'yaml'],
    dir: {
      input: 'site',
      output: 'public',
      includes: 'include',
      layouts: '',
      data: ''
    }
  };
};
