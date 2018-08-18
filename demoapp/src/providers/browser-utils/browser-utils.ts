import { Injectable } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';


@Injectable()
export class BrowserUtilsProvider {

  constructor(private inAppBrowser: InAppBrowser) {
    
  }

  public OpenExternalUrl(url, useSystem){
    //window.open(url, "_system", "location=yes");
    const options: InAppBrowserOptions = {
      location: 'no',
      zoom: 'no'
    }

    /* const browser = this.inAppBrowser.create(
      url,
      (useSystem) ? '_system' : '_self',
      options); */

    this.inAppBrowser.create(
      url,
      (useSystem) ? '_system' : '_self',
      options);
  }
}
