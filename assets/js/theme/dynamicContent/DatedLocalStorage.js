// Provider class to browser localStorage
//
// Structure of the cache is:
//  {
//      version: 1.0,                       // in case the data format changes
//      <key>: {                            // <key,value> pairs.   key can be any string
//                  timestamp: number,      // milliseconds when the key was cached
//                  value: any,             // value for key
//              }, ...
//  }
//
// Example usage:
//  let myObject;
//  if (DatedLocalStorage.getIsAvailable()) {
//      const cache = new DatedLocalStorage("my-example");
//
//      // Get cached data if it is less than five minutes old; otherwise, get the data from the server
//      myObject = cache.get("myinfo", 5);
//      if (myObject === null) {
//          myObject = getMyInfoFromServer();
//          cache.set("myinfo", myObject);
//      }
//  } else {
//      myObject = getMyInfoFromServer();
//  }

// Static property (another reason to like TypeScript)
let DatedLocalStorageStorage;

export class DatedLocalStorage {
    constructor(localStorageKey) {
        this.localStorageKey = localStorageKey;
    }

    // Return true if local storage is available
    // Otherwise, return false
    static getIsAvailable() {
        return DatedLocalStorage.storageAvailable('localStorage');
    }

    // Get the value for the specified key
    //  If the key's timestamp is older than the specified number of minutes, then the data is not returned to the caller
    get(key, ageLimitInMinutes) {
        // If this instance doesn't have data stored in local storage, return null
        const cachedDataString = DatedLocalStorageStorage.getItem(this.localStorageKey);
        if (!cachedDataString) {
            return null;
        }

        // If the stored data has no version, or version is not 1.0, panic
        const cachedData = JSON.parse(cachedDataString);
        if (!cachedData.version || cachedData.version !== '1.0') {
            return null;
        }

        // Get the data for the specified key
        const keyData = cachedData[key];

        // If the data has no timestamp, panic
        if (!keyData || !keyData.timestamp) {
            return null;
        }

        // If the stored data is too old, pretend it doesn't exist
        const msNow = Date.now();
        const msPerMinute = 60 /* seconds */ * 1000;
        if (keyData.timestamp < msNow - (msPerMinute * ageLimitInMinutes)) {
            return null;
        }

        const result = keyData.value;
        return (result === '' || !!result) ? result : null;
    }

    minutesSinceKeyCached(key) {
        // If this instance doesn't have data stored in local storage, pretend data is very old
        const cachedDataString = DatedLocalStorageStorage.getItem(this.localStorageKey);
        if (!cachedDataString) {
            return 999999;
        }

        // If the stored data has no version, or version is not 1.0, pretend data is very old
        const cachedData = JSON.parse(cachedDataString);
        if (!cachedData.version || cachedData.version !== '1.0') {
            return 999999;
        }

        // Get the data for the specified key
        const keyData = cachedData[key];

        // If no data, or the data has no timestamp, pretend data is very old
        if (!keyData || !keyData.timestamp) {
            return 999999;
        }

        // Return the age of the data
        const msNow = Date.now();
        const msPerMinute = 60 /* seconds */ * 1000;
        return (msNow - keyData.timestamp) / msPerMinute;
    }

    // save the value for the specified key
    set(key, value) {
        const cachedDataString = DatedLocalStorageStorage.getItem(this.localStorageKey);
        let cachedData = cachedDataString ? JSON.parse(cachedDataString) : { version: '1.0' };
        if (!cachedData.version || cachedData.version !== '1.0') {
            cachedData = { version: '1.0' };
        }

        cachedData[key] = { timestamp: Date.now(), value };
        DatedLocalStorageStorage.setItem(this.localStorageKey, JSON.stringify(cachedData));
    }

    // Remove the value for the specified key
    delete(key) {
        const cachedDataString = DatedLocalStorageStorage.getItem(this.localStorageKey);
        let cachedData = cachedDataString ? JSON.parse(cachedDataString) : { version: '1.0' };
        if (!cachedData.version || cachedData.version !== '1.0') {
            cachedData = { version: '1.0' };
        }

        delete cachedData[key];
        DatedLocalStorageStorage.setItem(this.localStorageKey, JSON.stringify(cachedData));
    }

    // From https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    static storageAvailable(type) {
        try {
            DatedLocalStorageStorage = (window)[type];
            const x = '__storage_test__';
            DatedLocalStorageStorage.setItem(x, x);
            DatedLocalStorageStorage.removeItem(x);
        } catch (err) {
            return false;
        }
        return true;
    }
}
