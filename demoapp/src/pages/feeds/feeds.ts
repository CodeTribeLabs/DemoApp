import { Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

import { WebServiceProvider } from '../../providers/web-service/web-service';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { TransitionProvider } from '../../providers/transition/transition';

@IonicPage()
@Component({
  selector: 'page-feeds',
  templateUrl: 'feeds.html',
})
export class FeedsPage implements OnInit {

  _formData = {"boardId":0,"id":0,"content":""};
  _boardTitle:string = "";
  _boardId:number = 0;

  _hubConnection: HubConnection;

  _responseData:any;
  _feeds:any;
  _userProfile:any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController, 
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private userData: UserDataProvider,
    private transition: TransitionProvider,
    private webService: WebServiceProvider
  ) {

  }

  ngOnInit() {
    try {
      let builder = new HubConnectionBuilder();
    
      // The route should be setup in Startup.cs on the server
      this._hubConnection = builder.withUrl(this.webService.GetServerUrl() + 'hubs/msghub').build();

      // Subscribe to messages coming from the server
      this._hubConnection.on("ServerMessage", (message) => {
        console.log(">>> RECEIVED: " + message);
        
        if(message == "FEED-" + this._boardId)
          this.RefreshFields();

      });

      // Start the SignalR connection
      this._hubConnection.start();
    } catch (error) {

    }
  }

  ionViewDidLoad() {
    this.OnNewFeed();
  }

  ionViewWillEnter() {
    this._userProfile = this.userData.GetUserProfile();
    this._boardTitle = this.navParams.get('title');
    this._boardId = this.navParams.get('boardId');
    this._formData.boardId = this._boardId;

    this.OnNewFeed();
    this.RefreshFields();
  }

  OnDismiss() {
    this.viewCtrl.dismiss(this._formData);

    try{
      this._hubConnection.stop();
    } catch (err){

    }
  }

  OnKeyPressed(keyCode)
  {
    if(keyCode == 13)
      this.OnFeedCreate();
  }

  BroadcastFeedUpdate() {
    this.SendMessage("FEED-" + this._boardId);
  }

  SendMessage(message) {
    // Send message to the server via SignalR hub
    try{
      this._hubConnection.invoke("SendMessage", message);
    } catch (err){

    }
  }

  RefreshFields() {
    this.GetFeeds();
  }

  OnNewFeed()
  {
    this._formData.id = 0;
    this._formData.content = "";
  }

  OnEditFeed(id, content)
  {
    this._formData.id = id;
    this._formData.content = content;
  }

  GetFeeds() {
    this.transition.ShowLoader("");

    this.webService.GetFeeds(this._userProfile.token, this._userProfile.acctId, this._boardId)
      .then((result) => {
        this._feeds = result;
        //console.log(this._responseData);
        this.transition.HideLoader();

      }, (err) => {
        console.log("Connection Failed");
        this.transition.HideLoader();
        this.transition.ShowToast("Unable to reach the server. Please check your internet connection.");
      });
  }

  OnFeedCreate() {
    this.transition.ShowLoader("");

    if(this._formData.content)
    {
      console.log("Create Feed: " + this._formData.content);

      this.webService.CreateFeed(this._userProfile.token, this._userProfile.acctId, this._boardId, this._formData.content, this._userProfile.firstName + " " + this._userProfile.lastName)
      .then((result) => {
        this._responseData = result;
        console.log(this._responseData);

        this.OnNewFeed();

        this.transition.HideLoader();
        this.BroadcastFeedUpdate();
      }, (err) => {
        console.log("Connection Failed");
        this.transition.HideLoader();
        this.transition.ShowToast("Unable to reach the server. Please check your internet connection.");
      });
    }
    else{
      this.transition.HideLoader();
      this.transition.ShowToast("Oops! You forgot to enter your message");
    }
  }

  OnFeedUpdate() {
    this.transition.ShowLoader("");

    if(this._formData.content)
    {
      console.log("Update Feed: Id=" + this._formData.id + ' Title=' + this._formData.content);

      this.webService.UpdateFeed(this._userProfile.token, this._userProfile.acctId, this._formData.id, this._formData.content, this._userProfile.firstName + " " + this._userProfile.lastName)
      .then((result) => {
        this._responseData = result;
        console.log(this._responseData);

        this.OnNewFeed();

        this.transition.HideLoader();
        this.BroadcastFeedUpdate();
      }, (err) => {
        console.log("Connection Failed");
        this.transition.HideLoader();
        this.transition.ShowToast("Unable to reach the server. Please check your internet connection.");
      });
    }
    else{
      this.transition.HideLoader();
      this.transition.ShowToast("Oops! You forgot to enter your message");
    }
  }

  OnFeedDelete(id)
  {
    this.transition.ShowLoader("");

    console.log("Delete Feed: Id=" + id);

    this.webService.DeleteFeed(this._userProfile.token, this._userProfile.acctId, id)
    .then((result) => {
      this._responseData = result;
      console.log(this._responseData);

      this.OnNewFeed();

      this.transition.HideLoader();
      this.BroadcastFeedUpdate();
    }, (err) => {
      console.log("Connection Failed");
      this.transition.HideLoader();
      this.transition.ShowToast("Unable to reach the server. Please check your internet connection.");
    });
  }
}
