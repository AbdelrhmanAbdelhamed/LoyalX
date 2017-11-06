import Web3 from 'web3';
//import TruffleContract from 'truffle-contract';
import { Http } from './http';

export class Web3Service {

	private static _web3: Web3;
	private static _provider;
	private static _contracts: any;
	public static TruffleContract:any;
	public static Server;


	public static get web3(): Web3 { return this._web3; }
	public static get provider() { return this._provider; }
	public static get isWeb3Injected() { return (typeof web3 !== 'undefined'); }

	private static init() {
		if (this._web3 == null) {
			if (typeof web3 !== 'undefined') {
				this._provider = web3.currentProvider;
				this._web3 = new Web3(web3.currentProvider);
			} else {
				this._provider = new Web3.providers.HttpProvider(this.Server.HTTP_PROVIDER);
				this._web3 = new Web3(this._provider);
			}
		}
	}

	public static async getContract(contractName: string) {
		this.init();
		if (this._contracts[contractName]) {
			return this._contracts[contractName];
		} else {
			// Get the necessary contract artifact file and instantiate it with truffle-contract.
			var contractArtifact = await Http.get(`${this.Server.CONTRACTS_URL}/${contractName}.json`);

			var contract = this.TruffleContract(contractArtifact);
			// var contract = new this.Web3Provider.web3.eth.Contract(contractArtifact);

			contract.setProvider(Web3Service.provider); // Set the provider for our contract.
			this._contracts[contractName] = contract;
			return contract;
		}

	}

	public static hasMetaMask() {
		return ((typeof web3 !== "undefined") && (web3.currentProvider.isMetaMask === true))
	}

	public static isOnProperNetwork(): Promise<boolean> {
		this.init();
		var promise: Promise<boolean> = new Promise((resolve, reject) => {

			(<any>this.web3.eth.net).getNetworkType()
				.then(networkType => console.log("Network type", networkType));

			(<any>this.web3.version).getNetwork((err, netId) => {
				if (err) {
					console.warn(err);
					reject(err);
				} else {
					console.log("Network id", netId);
					if (this.Server.NETWORK_ID == null) {
						console.warn("no network id specified in config, ignoring network check");
					}
					resolve((this.Server.NETWORK_ID == null) || (netId == this.Server.NETWORK_ID));
				}
			});

		});

		return promise;
	}

	/**
	 * get the first account
	 */
	public static getAccount(): Promise<any> {
		this.init();
		var promise = new Promise((resolve, reject) => {

			this.web3.eth.getAccounts((error, accounts) => {
				if (error) {
					console.warn(error);
					reject(error);
				} else {
					var account = accounts[0];
					console.log("getAccount", account);
					resolve(account);
				}
			});

		});
		return promise;
	}
}
