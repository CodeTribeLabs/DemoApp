import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { Md5 } from 'ts-md5/dist/md5';
import 'rxjs/add/operator/map';

//let _ApiUrl = "http://192.168.1.5/GameTopup/api/";
//let _ApiUrl = "https://adhoc.os-gameserver.net/apps/game-topup/api/";
//let _ApiKey = "4802fc7babb5bc89bbe283b5ed277803";

let API_URL = "http://localhost:52162/"; // "https://localhost:44329/";
let API_KEY = "PLAY_N_GO-API-KEY";
let API_ROUTE = "api/";
let APPS_ROUTE = "apps/";
let AUTH_ROUTE = "auth/";

let _Headers = new Headers();

let OP_REGISTER = 'register';
let OP_LOGIN = 'login';
let OP_SILENTLOGIN = 'silentlogin';
let OP_APPS = 'apps';
let OP_BOARD = 'boards';
let OP_FEED = 'feeds';
let OP_PLAY = 'play';

// export enum GameTopupOpCodes {
//   LOGIN = 'login',
//   UPDATE = 'update',
//   GET_APPS = 'get-apps',
//   VIEW_APP = 'view-app',
//   TOPUP = 'topup'
// }

@Injectable()
export class WebServiceProvider {

  constructor(public http: Http) {

    this.SetHeaders();
  }

  private SetHeaders() {
    // Create headers for POST request
    _Headers.append('Content-Type', 'application/json');
    _Headers.append('Access-Control-Allow-Credentials', 'true');
    _Headers.append('Access-Control-Allow-Methods', '*');
    //_Headers.append('Access-Control-Request-Method', 'POST');
    //_Headers.append('Keep-Alive', 'timeout=5, max=100');
    _Headers.append('Access-Control-Allow-Origin', '*');
    //_Headers.append('Connection', 'Keep-Alive');
  }

  private GenerateFullDigest(opCode, fieldData){
    return this.GenerateDigest(API_KEY + ":" + opCode, fieldData);
  }

  private GenerateDigest(opCode, fieldData){
    let digest = opCode + ":" + fieldData;
    return Md5.hashStr(digest).toString();
  }

  GetServerUrl(){
    return API_URL;
  }

  Login(userName, password)
  {
    let opCode = OP_LOGIN;

    let opData = {
      Email: userName,
      Password: password,
      digest: this.GenerateFullDigest(opCode, userName + ":" + password)
    }

    return this.PostData(AUTH_ROUTE, opCode, opData);
  }

  SilentLogin(userName)
  {
    let opCode = OP_SILENTLOGIN;

    let opData = {
      Email: userName,
      digest: this.GenerateFullDigest(opCode, userName)
    }

    return this.PostData(AUTH_ROUTE, opCode, opData);
  }

  Register(email, firstName, lastName, password)
  {
    let opCode = OP_REGISTER;

    let opData = {
      Email: email,
      FirstName: firstName,
      LastName: lastName,
      Password: password,
      Digest: this.GenerateFullDigest(opCode, email + ":" + firstName + ":" + lastName + ":" + password)
    }

    return this.PostData(AUTH_ROUTE, opCode, opData);
  }

  UpdateProfile(accessToken, acctId, firstName, lastName, password)
  {
    let opCode = 'upd-profile';

    let opData = {
      op_code: opCode,
      acct_id: acctId,
      first_name: firstName,
      last_name: lastName,
      auth_token: password,
      digest: this.GenerateDigest(opCode, accessToken + ":" + firstName + ":" + lastName + ":" + password)
    }

    return this.PostData(API_ROUTE, opCode, opData);
  }

  GetApps(accessToken, acctId)
  {
    let opCode = OP_APPS;

    let opData = {
      OpCode: opCode,
      AcctId: acctId,
      Digest: this.GenerateDigest(opCode, accessToken)
    }

    return this.GetData(API_ROUTE, '', opCode, opData);
  }

  PlayGame(accessToken, acctId, appId, betAmount, deck, action)
  {
    let opCode = OP_PLAY;

    let opData = {
      OpCode: opCode,
      AcctId: acctId,
      AppId: appId,
      BetAmount: betAmount,
      Deck: deck,
      Action: action,
      Digest: this.GenerateDigest(opCode, accessToken + ":" + appId + ":" + betAmount + ":" + deck + ":" + action)
    }

    return this.PostData(API_ROUTE + APPS_ROUTE, opCode, opData);
  }

  GetBoards(accessToken, acctId)
  {
    let opCode = OP_BOARD;

    let opData = {
      //OpCode: opCode,
      AcctId: acctId,
      Digest: this.GenerateDigest(opCode, accessToken)
    }

    return this.GetData(API_ROUTE, '', opCode, opData);
  }

  CreateBoard(accessToken, acctId, title, displayName)
  {
    let opCode = OP_BOARD;

    let opData = {
      //OpCode: opCode,
      AcctId: acctId,
      Title: title,
      DisplayName: displayName,
      Digest: this.GenerateDigest(opCode, accessToken + ":" + title + ":" + displayName)
    }

    return this.PostData(API_ROUTE, opCode, opData);
  }

  UpdateBoard(accessToken, acctId, boardId, title, displayName)
  {
    let opCode = OP_BOARD;

    let opData = {
      //OpCode: opCode,
      AcctId: acctId,
      Title: title,
      BoardId: boardId,
      DisplayName: displayName,
      Digest: this.GenerateDigest(opCode, accessToken + ":" + boardId + ":" + title + ":" + displayName)
    }

    return this.PutData(API_ROUTE, boardId, opCode, opData);
  }

  DeleteBoard(accessToken, acctId, boardId)
  {
    let opCode = OP_BOARD;

    let opData = {
      //OpCode: opCode,
      AcctId: acctId,
      Digest: this.GenerateDigest(opCode, accessToken + ":" + boardId)
    }

    return this.DeleteData(API_ROUTE, boardId, opCode, opData);
  }

  GetFeeds(accessToken, acctId, boardId)
  {
    let opCode = OP_FEED;

    let opData = {
      //OpCode: opCode,
      AcctId: acctId,
      BoardId: boardId,
      Digest: this.GenerateDigest(opCode, accessToken)
    }

    return this.GetData(API_ROUTE, boardId, opCode, opData);
  }

  CreateFeed(accessToken, acctId, boardId, content, displayName)
  {
    let opCode = OP_FEED;

    let opData = {
      //OpCode: opCode,
      AcctId: acctId,
      BoardId: boardId,
      Content: content,
      DisplayName: displayName,
      Digest: this.GenerateDigest(opCode, accessToken + ":" + boardId + ":" + content + ":" + displayName)
    }

    return this.PostData(API_ROUTE, opCode, opData);
  }

  UpdateFeed(accessToken, acctId, feedId, content, displayName)
  {
    let opCode = OP_FEED;

    let opData = {
      //OpCode: opCode,
      AcctId: acctId,
      Content: content,
      DisplayName: displayName,
      Digest: this.GenerateDigest(opCode, accessToken + ":" + feedId + ":" + content + ":" + displayName)
    }

    return this.PutData(API_ROUTE, feedId, opCode, opData);
  }

  DeleteFeed(accessToken, acctId, feedId)
  {
    let opCode = OP_FEED;

    let opData = {
      //OpCode: opCode,
      AcctId: acctId,
      Digest: this.GenerateDigest(opCode, accessToken)
    }

    return this.DeleteData(API_ROUTE, feedId, opCode, opData);
  }

  private PostData(apiRoute, opCode, opData) {
    return new Promise((resolve, reject) => {

      this.http.post(API_URL + apiRoute + opCode, JSON.stringify(opData), {headers: _Headers})
        .subscribe( res => {
          try {
            resolve(res.json());
          } catch (error) {
            resolve("{}");
          }
        }, (err) => {
          reject(err);
        });
    });
  }

  private GetData(apiRoute, routeId, opCode, opData) {
    return new Promise((resolve, reject) => {

      let url = API_URL + apiRoute + opCode;

      if(routeId)
        url += '/' + routeId;

      this.http.get(url, JSON.stringify(opData))
        .subscribe( res => {
          try {
            resolve(res.json());
          } catch (Error) {
            resolve("{}");
          }
        }, (err) => {
          reject(err);
        });
    });
  }

  private PutData(apiRoute, id, opCode, opData) {
    return new Promise((resolve, reject) => {

      this.http.put(API_URL + apiRoute + opCode + '/' + id, JSON.stringify(opData), {headers: _Headers})
        .subscribe( res => {
          try {
            resolve(res.json());
          } catch (Error) {
            resolve("{}");
          }
        }, (err) => {
          reject(err);
        });
    });
  }

  private DeleteData(apiRoute, id, opCode, opData) {
    return new Promise((resolve, reject) => {

      this.http.delete(API_URL + apiRoute + opCode + '/' + id, JSON.stringify(opData))
        .subscribe( res => {
          try {
            resolve(res.json());
          } catch (Error) {
            resolve("{}");
          }
        }, (err) => {
          reject(err);
        });
    });
  }

}
