import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
//import TruffleContract from 'truffle-contract';
import CONFIG from '../../app.config';
import 'rxjs/add/operator/map';
import { Web3Provider } from '../web3/web3';

declare var TruffleContract;
/*
  Generated class for the LoyaltyFactoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoyaltyFactoryProvider {

  Contract;

  constructor(public http: Http, public Web3Provider: Web3Provider) {
    this._fetchContract();
    console.log('Hello LoyaltyFactoryProvider Provider');
  }

  private _fetchContract() {
    this.http.get(`${CONFIG.CONTRACTS_URL}/LoyaltyTokenFactory.json`).subscribe(data => {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var LoyaltyFactoryArtifact = data.json();
      this.Contract = TruffleContract(LoyaltyFactoryArtifact);
      //this.Contract = new this.Web3Provider.web3.eth.Contract(LoyaltyFactoryArtifact);
      // Set the provider for our contract.
      this.Contract.setProvider(this.Web3Provider.provider);
    });
  }

  public handleOnboard(retailSymbol: string, retailName: string, retailAmount: number, retailDecimal: number) {
    retailAmount = retailAmount * 10 ^ retailDecimal;

    console.log("Sysmbol: ", retailSymbol, "Name: ", retailName, "Amount: ", retailAmount, " Decimal:", retailDecimal);

    this.Web3Provider.web3.eth.getAccounts((error, accounts) => {
      if (error) { console.warn(error); }

      var account = accounts[0];

      this.Contract.deployed().then((loyaltyFactoryInstance) => {

        return loyaltyFactoryInstance.initialiseRetail(retailAmount, retailName, retailDecimal, retailSymbol, { from: account });
      }).then((result) => {
        // return App.markAdopted();
        console.log("success Address", result);
        // addToLog("#blockchain", "address : " + result);
      }).catch((err) => console.log(err.message));
    });

  }

  public getTokensAddress() {
    var promise = new Promise((resolve, reject) => {

      this.Web3Provider.web3.eth.getAccounts((error, accounts) => {
        if (error) {
          console.warn(error);
          reject(error);
        }

        var account = accounts[0];

        this.Contract.deployed().then((loyaltyFactoryInstance) => loyaltyFactoryInstance.getTokensAddress())
          .then((result) => {
            console.log("tokens Address", result);
            resolve(result);
          })
          .catch((err) => {
            console.warn(err.message);
            reject(err);
          });
      });

    });
    return promise;
  }

  public getTokensAddressByOwner() {
    // return ownerMap[owner];
    var promise = new Promise((resolve, reject) => {
      
            this.Web3Provider.web3.eth.getAccounts((error, accounts) => {
              if (error) {
                console.warn(error);
                reject(error);
              }
      
              var account = accounts[0];
      
              this.Contract.deployed().then((loyaltyFactoryInstance) => loyaltyFactoryInstance.getTokensAddressByOwner(accounts[0]))
                .then((result) => {
                  console.log("tokens Address", result);
                  resolve(result);
                })
                .catch((err) => {
                  console.warn(err.message);
                  reject(err);
                });
            });
      
          });
          return promise;
  }

}
