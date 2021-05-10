// One of the limitations of the BigCommerce WYSIWYG HTML editor is that it doesn't permit stylesheets in the HTML.
// Snippets allow you to create a file that includes both HTML and stylesheets.
// Snippets also provide a way to create content in one location and then include it on multiple pages.

/* From Basecamp:
Snippets are similar to Dynamic tabs, in that they allow you to use a page's HTML property to
provide content, but pull it from a separate file.

Here is the format of the HTML that needs to placed on each page that uses the snippet:

 <div class="gr-snippet" data-gr-content="{{ CONTENT URL }}">
  <em>Loading...</em>
 </div>

The external file can contain any arbitrary HTML and CSS and is displayed in the spot on the page where the gr-snippet div is located.
You may want to put the file on the BigCommerce DAV server, in the content/snippets folder.
/* */

import RemoteContent from './RemoteContent';

export default class DynamicSnippets extends RemoteContent {
    constructor(context) {
        super('gr-dynamic-snippets', 5 * 60);

        this.context = context;
//      console.log('Snippet context: %o', this.context);
    }

    loadSnippets() {
        const self = this;

        $('.gr-snippet').each(function loadSnippet() {
            // Decide if this is a local or remote tab content
            const $this = $(this);
            const snippetContentURL = $this.data('gr-content');

            if (!!snippetContentURL) {
                self.loadSnippet($this, snippetContentURL);
            } else {
                console.error('DynamicSnippets.loadSnippets: gr-snippet has no data-gr-content attribute');
            }
        });
    }

    loadSnippet($rootElement, snippetContentURL) {
        this.getRemoteContent(snippetContentURL, (snippetContent) => {
            console.log(`DynamicSnippets.loadSnippet: putting ${snippetContentURL} snippet into page`);
            $rootElement.after(snippetContent);
            $rootElement.remove();                      // remove the html from its temporary location
        });
    }
}
