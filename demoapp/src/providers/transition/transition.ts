import { Injectable } from '@angular/core';
import { ToastController, LoadingController, Events} from 'ionic-angular';
//import { NavController, NavParams } from 'ionic-angular';

@Injectable()
export class TransitionProvider {

  private _selectedTabIndex = 0;
  private _loader: any;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public events:Events) {
  }

  ShowLoader(msg){
    this._loader =  this.loadingCtrl.create({content: msg});
    this._loader.present();
  }

  HideLoader(){
    this._loader.dismiss();
  }

  ShowToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    
    toast.present();
  }

  NavToTabIndex(tabIndex){
    this._selectedTabIndex = tabIndex;

    let eventData = {
      selectedTabIndex: this._selectedTabIndex
    };

    this.RaiseTransitionEvent('navtab', eventData);
  }

  private RaiseTransitionEvent(eventCode, eventData)
  {
    this.events.publish('transition:' + eventCode, eventData);
  }
}
