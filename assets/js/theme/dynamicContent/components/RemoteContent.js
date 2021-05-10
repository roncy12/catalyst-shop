// Handle page content that is stored in files on the server.
// Performs the ajax calls to get the content, and handle cacheing in LocalStorage
import { DatedLocalStorage } from '../DatedLocalStorage';

export default class RemoteContent {
    constructor(cacheName, cacheMinutes) {
        this.cacheName = cacheName;
        this.cacheMinutes = cacheMinutes;
    }

    // Get the content, from the cache if available, or else go to the server.
    // Once the content has been retrieved, either locally or remotely, call the callback function with the content
    getRemoteContent(remoteContentURL, callback) {
        if (DatedLocalStorage.getIsAvailable()) {
            const cache = new DatedLocalStorage(this.cacheName);

            // Get cached data if it is less than five hours old; otherwise, get the data from the server
            let remoteContent = cache.get(remoteContentURL, this.cacheMinutes);
            console.log(`remote content ${remoteContentURL} has been cached for minutes: ${cache.minutesSinceKeyCached(remoteContentURL)}`);
            if (remoteContent === '' && cache.minutesSinceKeyCached(remoteContentURL) > self.cacheMinutes / 2) {
                console.log('clearing empty content to force refetch');
                remoteContent = null;
            }
            if (remoteContent === null) {
                console.log(`remote content ${remoteContentURL} not found in cache; asking host.`);
                this._getContentFromServer(remoteContentURL, cache, callback);
            } else if (remoteContent !== '') {
                callback(remoteContent);
            } else {
                console.log(`cache hit but there is no content for ${remoteContentURL}`);
            }
        } else {
            this._getContentFromServer(remoteContentURL, null, callback);
        }
    }

    // Get the content from the server, cache it, and call the callback
    _getContentFromServer(remoteContentURL, cache, callback) {
        // Generate a hash that changes each day. This way, we'll only pull obsolete content for remainder of a day
        const now = new Date();
        let datestamp = now.getYear().toString();                                   // Two (three) digit year
        datestamp += (now.getMonth() < 10 ? '0' : '') + now.getMonth().toString();  // pad with a 0
        datestamp += (now.getDate() < 10 ? '0' : '') + now.getDate().toString();    // pad with a 0

        // Get the tab content and insert it into the page
        $.ajax({
            type: 'GET',
            url: `${remoteContentURL}?h=${datestamp}`,
            error: () => {
                if (cache) {
                    cache.set(remoteContentURL, ''); // cache empty result for !/2 normal duration if file is unavailable
                }
                console.warn(`RemoteContent.getContentFromServer: Remote content URL not found: ${remoteContentURL}`);
            },
            success: (remoteContent) => {
                // When the file is not found , we tend to get back a 'successful' Your content is not here page, instead of an error.
                //  So, we assume that any file starting with a doctype is a full html page, and we reject it
                if (remoteContent.substring(0, 15) === '<!DOCTYPE html>') {
                    if (cache) {
                        cache.set(remoteContentURL, ''); // cache empty result for !/2 normal duration if file is unavailable
                    }
                    console.warn(`RemoteContent.getContentFromServer: Remote content URL file not found error: ${remoteContentURL}`);
                } else {
                    if (cache) {
                        cache.set(remoteContentURL, remoteContent);
                    }
                    callback(remoteContent);
                }
            },
        });
    }
}
