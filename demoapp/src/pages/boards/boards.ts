import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

import { FeedsPage } from '../feeds/feeds';
import { SearchBoardsPage } from '../search-boards/search-boards';

import { WebServiceProvider } from '../../providers/web-service/web-service';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { TransitionProvider } from '../../providers/transition/transition';

@IonicPage()
@Component({
  selector: 'page-boards',
  templateUrl: 'boards.html',
})
export class BoardsPage implements OnInit {

  // This is bound to the form fields using two-way binding (ngModel)
  _formData = {"id":0,"title":""};
  _userProfile:any;

  _hubConnection: HubConnection;

  _responseData:any;
  _boardListing: any;
  _boards:any;
  _myBoards: object[] = [];

  _boardsTotal:number = 0;
  _myBoardsTotal:number = 0;
 
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private webService: WebServiceProvider,
    private userData: UserDataProvider,
    private transition: TransitionProvider) {

      this._boardListing = "segment1";
  }

  ngOnInit() {
    try {
      let builder = new HubConnectionBuilder();
      
      // The route should be setup in Startup.cs on the server
      this._hubConnection = builder.withUrl(this.webService.GetServerUrl() + 'hubs/msghub').build();

      // Subscribe to messages coming from the server
      this._hubConnection.on("ServerMessage", (message) => {
        console.log(">>> RECEIVED: " + message);

        if(message == "BOARD")
          this.RefreshFields();

      });

      // Start the SignalR connection
      this._hubConnection.start();
    } catch (error) {

    }
  }

  ionViewDidLoad() {
    this.OnNewBoard();
  }

  ionViewWillEnter() {
    this._userProfile = this.userData.GetUserProfile();

    this.OnNewBoard();
    this.RefreshFields();
  }

  BroadcastBoardUpdate() {
    this.SendMessage("BOARD");
  }

  SendMessage(message) {
    // Send message to the server via SignalR hub
    try{
      this._hubConnection.invoke("SendMessage", message);
    } catch (error){

    }
  }

  RefreshFields() {
    this.GetBoards();
  }

  OnSearchClick() {
    //this.navCtrl.push(SearchBoardsPage, {'boards': this._boards, 'acctId': this._userProfile.acctId});

    let data = {
      "boards": this._boards, 
      "acctId": this._userProfile.acctId
    };

    let customModal = this.modalCtrl.create(SearchBoardsPage, data);

    customModal.onDidDismiss(data => {
      //console.log("Search Dismissed, Id=" + data.id + " Action=" + data.action);

      if(data.id) {
        switch(data.action)
        {
          case "CHAT": this.OnBoardClick(data.id, data.title, data.ownerName); break;
          case "EDIT": this.OnEditBoard(data.id, data.title); break;
          case "DELETE": this.OnBoardDelete(data.id); break;
        }
      } else {
        //this.transition.ShowToast("Oops! You forgot to enter your User ID.");
      }
    });

    customModal.present();


  }

  OnBoardClick(id, title, ownerName)
  {
    let data = {
      "boardId": id, 
      "title": title, 
      "ownerName": ownerName
    };

    let customModal = this.modalCtrl.create(FeedsPage, data);

    customModal.onDidDismiss(data => {
      console.log("Board Dismissed, Id=" + data.boardId);

      if(data.boardId) {
        // Do something with boardId
      } else {
        //this.transition.ShowToast("Oops! You forgot to enter your User ID.");
      }
    });

    customModal.present();

  }

  OnNewBoard()
  {
    this._formData.id = 0;
    this._formData.title = "";
  }

  OnEditBoard(id, title)
  {
    this._formData.id = id;
    this._formData.title = title;
  }

  GetBoards()
  {
    this.transition.ShowLoader("");

    this.webService.GetBoards(this._userProfile.token, this._userProfile.acctId)
      .then((result) => {
        this._boards = result;
        this.FilterMyBoards();

        //console.log(this._responseData);
        this.transition.HideLoader();

      }, (err) => {
        console.log("Connection Failed");
        this.transition.HideLoader();
        this.transition.ShowToast("Unable to reach the server. Please check your internet connection.");
      });
  }

  FilterMyBoards() {

    this._myBoards = [];
    this._boardsTotal = 0;
    this._myBoardsTotal = 0;

    this._boards.forEach(element => {
      
      this._boardsTotal++;

      // Filter the boards owned by the user
      if(element.acctId == this._userProfile.acctId) {
        this._myBoards.push(element);

        this._myBoardsTotal++;
      }
    });

    this._boards.to
  }

  OnBoardCreate() {
    this.transition.ShowLoader("");

    if(this._formData.title)
    {
      console.log("Create Board: " + this._formData.title);

      this.webService.CreateBoard(this._userProfile.token, this._userProfile.acctId, this._formData.title, this._userProfile.firstName + " " + this._userProfile.lastName)
      .then((result) => {
        this._responseData = result;
        console.log(this._responseData);

        this.OnNewBoard();

        this.transition.HideLoader();
        this.BroadcastBoardUpdate();
      }, (err) => {
        console.log("Connection Failed");
        this.transition.HideLoader();
        this.transition.ShowToast("Unable to reach the server. Please check your internet connection.");
      });
    }
    else{
      this.transition.HideLoader();
      this.transition.ShowToast("Oops! You forgot to enter a new board title.");
    }
  }

  OnBoardUpdate() {
    this.transition.ShowLoader("");

    if(this._formData.title)
    {
      console.log("Update Board: Id=" + this._formData.id + ' Title=' + this._formData.title);

      this.webService.UpdateBoard(this._userProfile.token, this._userProfile.acctId, this._formData.id, this._formData.title, this._userProfile.firstName + " " + this._userProfile.lastName)
      .then((result) => {
        this._responseData = result;
        console.log(this._responseData);

        this.OnNewBoard();

        this.transition.HideLoader();
        this.BroadcastBoardUpdate();
      }, (err) => {
        console.log("Connection Failed");
        this.transition.HideLoader();
        this.transition.ShowToast("Unable to reach the server. Please check your internet connection.");
      });
    }
    else{
      this.transition.HideLoader();
      this.transition.ShowToast("Oops! You forgot to enter a new board title.");
    }
  }

  OnBoardDelete(id)
  {
    this.transition.ShowLoader("");

    console.log("Delete Board: Id=" + id);

    this.webService.DeleteBoard(this._userProfile.token, this._userProfile.acctId, id)
    .then((result) => {
      this._responseData = result;
      console.log(this._responseData);

      this.OnNewBoard();

      this.transition.HideLoader();
      this.BroadcastBoardUpdate();
    }, (err) => {
      console.log("Connection Failed");
      this.transition.HideLoader();
      this.transition.ShowToast("Unable to reach the server. Please check your internet connection.");
    });
  }
}
