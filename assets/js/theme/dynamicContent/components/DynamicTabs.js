// Tabs on the product pages are normally hardwired into the theme.
// Dynamic tabs allow you to store the content of tabs in separate files,
// which has the advantage that they can be managed by content specialists without requiring theme updates.

/* From Basecamp:
Dynamic tabs are similar to dropzones, in that they allow you to use a page's HTML property to provide content,
but move it to a specific location on the page. In this case, your content will appear in a tab.
This functionality is supported on both gear and event product pages.

There are two forms for the html. The first is designed for a tab you want to drop in using a page's HTML.
The second is designed for a tab that gets its input from an external file.

 <div class="gr-tab" data-gr-position="{{ POSITION }}" data-gr-title="{{ TITLE }}">
     {{ CONTENT }}
 </div>

 <div class="gr-tab" data-gr-content="{{ CONTENT URL }}">
 </div>

In the second case, the html in the external file must start with the position and title information:
 <input id="gr-tab-data" type="hidden" data-gr-position="{{ POSITION }}" data-gr-title="{{ TITLE }}" />
 {{ CONTENT }}

POSITION is a number, and determines where the dynamic tab will be put. For example,
a POSITION of 3 means that the tab will be placed after the third tab.
Use a position of 0 to place the tab ahead of the first tab.
If the position attribute is omitted, the tab will be placed after all the other tabs.
Note that if you add multiple dynamic tabs, the POSITION needs to account for the previously inserted dynamic tabs.

TITLE is the text you want for the title of the tab. For example, "Our Guarantee".

CONTENT is any arbitrary HTML and is displayed when the user clicks on the tab's title.
For content stored in a file, you may want to put it on the BigCommerce DAV server, in the content/tabs folder.
/* */

import RemoteContent from './RemoteContent';

export default class DynamicTabs extends RemoteContent {
    constructor() {
        super('gr-dynamic-tabs', 5 * 60);

        this.tabIndex = 0;
    }

    loadTabs() {
        const self = this;

        $('.gr-tab').each(function loadTab() {
            // Decide if this is a local or remote tab content
            const $this = $(this);
            const tabContentURL = $this.data('gr-content');

            if (!!tabContentURL) {
                self.loadRemoteTab(tabContentURL);
            } else {
                self.loadLocalTab($this);
            }

            $this.remove();                         // remove the html from its temporary location
        });
    }

    loadLocalTab($source) {
        const insertPosition = $source.data('gr-position');
        const tabTitle = $source.data('gr-title');
        const tabContent = $source.html();

        this.insertTab(insertPosition, tabTitle, tabContent);
    }

    loadRemoteTab(tabContentURL) {
        this.getRemoteContent(tabContentURL, (tabContent) => {
            const $dataElement = $(tabContent).filter('#gr-tab-data');
            if ($dataElement.length <= 0) {
                console.warn(`DynamicTabs.loadRemoteTab: No data element in downloaded tab for ${tabContentURL}`);
                return;
            }
//          console.log('Tab content downloaded from ' + tabContentURL);

            const insertPosition = $dataElement.data('gr-position');
            const tabTitle = $dataElement.data('gr-title');

            this.insertTab(insertPosition, tabTitle, tabContent);
        });
    }

    insertTab(insertPositionParameter, tabTitle, tabContent) {
        let insertPosition = !!insertPositionParameter ? parseInt(insertPositionParameter, 10) : 1000;
        const tabId = `gr-tabid_${this.tabIndex++}`;
        const chevron = "<svg class='icon icon-chevron-down'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-chevron-down'></use></svg>";

        // If there are no existing tabs, probably this page doesn't support tabs, so abort
        const numberOfExistingTabs = $('section.product-tabs ul.tabs li.tab-title').length;
        if (numberOfExistingTabs <= 0) {
            return;
        }

        // Determine how & where to insert the tab
        let insertBefore = true;
        if (insertPosition >= numberOfExistingTabs) {
            insertPosition = numberOfExistingTabs - 1;
            insertBefore = false;
        }

        // Find the elements we'll insert the tab next to
        const $targetElements = {};
        $targetElements.titleLi = $('section.product-tabs ul.tabs li.tab-title').eq(insertPosition);
        $targetElements.titleSpan = $('section.product-tabs div.tabs-content span.accordion-title').eq(insertPosition);
        $targetElements.contentPanel = $('section.product-tabs div.tabs-content div.tab-content-panel').eq(insertPosition);

        // Insert the new tab, either before or after the target elements
        if (insertBefore) {
            $targetElements.titleLi.before(`<li class='tab-title'><a href='#${tabId}'>${tabTitle}</a></li>`);
            $targetElements.titleSpan.before(`<span class='accordion-title'><a href='#${tabId}' data-scroll='#${tabId}'>${chevron}${tabTitle}</a></span>`);
            $targetElements.titleSpan.before(`<div class='tab-content-panel' id='${tabId}'>${tabContent}</div>`);
        } else {
            $targetElements.titleLi.after(`<li class='tab-title'><a href='#${tabId}'>${tabTitle}</a></li>`);
            $targetElements.contentPanel.after(`<div class='tab-content-panel' id='${tabId}'>${tabContent}</div>`);
            $targetElements.contentPanel.after(`<span class='accordion-title'><a href='#${tabId}' data-scroll='#${tabId}'>${chevron}${tabTitle}</a></span>`);
        }
    }
}
