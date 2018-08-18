import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service';
import { UserDataProvider } from '../../providers/user-data/user-data';
//import { AppDataProvider } from '../../providers/app-data/app-data';
import { TransitionProvider } from '../../providers/transition/transition';

@IonicPage()
@Component({
  selector: 'page-app-play',
  templateUrl: 'app-play.html',
})
export class AppPlayPage {

  _responseData:any;

  _formData = {"appId":""};
  _appName:string = "";
  _appId:number = 0;
  
  private _gameCredits:number = 0;
  private _betAmount:number = 1;

  private _deck:number = 0;
  private _card1:number = 0;
  private _card2:number = 0;
  private _card3:number = 0;
  private _card4:number = 0;
  private _action:string = "0";

  private _gameResult:string = "C0a";
  private _winState:string = "";
  private _winnings:number = 0;
  private _isPlaying:boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private webService: WebServiceProvider,
    private userData: UserDataProvider,
    //private appData: AppDataProvider,
    private transition:TransitionProvider) {

      this._appId = this.navParams.get('appId');
      this._appName = this.navParams.get('appName');

      this._formData.appId = this.navParams.get('appId');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AppLinkPage ' + this.navParams.get('appName'));

    this.InitGame();
  }

  OnDismiss() {
    this.viewCtrl.dismiss(this._formData);
  }

  BetAmounts(): number[] {
    return [
      1,
      5,
      10,
      25,
      50,
      100,
      500,
    ];
  }

  InitGame()
  {
    this._gameCredits = this.userData.GetUserProfile().gameCredits;
    this._winState = "NONE";
    this._winnings = 0;
    this._isPlaying = true;
    this._deck = 0;

    if(this._appId == 2)
    { // Open a random card from the deck
      this._deck = this.OpenRandomCard();
      this._card1 = 0;
      this._card2 = 0;
      this._card3 = 0;
      this._card4 = 0;
    }
  }

  OpenRandomCard()
  {
    let suit = this.GetRandomInt(1, 4);
    let rndCard = 0;

    // Get a random card with rank 4 to 10
    switch(suit)
    {
      case 1: // CLUBS
        rndCard = this.GetRandomInt(4, 10);
        break;
      case 2: // DIAMONDS
        rndCard = this.GetRandomInt(17, 23);
        break;
      case 3: // SPADES
        rndCard = this.GetRandomInt(30, 36);
        break;
      case 4: // HEARTS
        rndCard = this.GetRandomInt(43, 49);
        break;
    }

    return rndCard;
  }

  GetRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  OnBetSelect()
  {
    console.log(this._betAmount);
  }

  OnPlayGame(action)
  {
    this._action = action;

    this.transition.ShowLoader("");

    let userProfile = this.userData.GetUserProfile();

    this.webService.PlayGame(userProfile.authToken, userProfile.acctId, this._appId, this._betAmount, this._deck, action)
      .then((result) => {
        this._responseData = result;
        console.log(this._responseData);

        this.transition.HideLoader();

        if(this._responseData.winState)
        {
          this._isPlaying = false;

          this._winState = this._responseData.winState;
          this._winnings = this._responseData.winnings;

          switch(this._appId)
          {
            case 1: 
              this._gameResult = this._responseData.result;
              break;
            case 2:
              var cards = this._responseData.result.split("-"); 
              this._card1 = cards[0];
              this._card2 = cards[1];
              this._card3 = cards[2];
              this._card4 = cards[3];
              break;
          }

          this.UpdateGameCredits();
        }
        else
          this.transition.ShowToast("Unable to process your request. Please try again.");
      }, (err) => {
        console.log("Connection Failed");
        this.transition.HideLoader();
        this.transition.ShowToast("Unable to reach the server. Please check your internet connection.");
    });
  }

  UpdateGameCredits()
  {
    let userProfile = this.userData.GetUserProfile();

    // Update the GameCredits based on the current value from the server
    userProfile.gameCredits = this._responseData.gameCredits + this._responseData.winnings;
    this._gameCredits = userProfile.gameCredits;
    // Update the UserProfile on local storage
    this.userData.SetUserProfile(userProfile);

  }

}
