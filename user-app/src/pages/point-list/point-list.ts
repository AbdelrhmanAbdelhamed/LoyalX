import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Platform, ViewController } from 'ionic-angular';

import { OfferCreatePage } from '../offer-create/offer-create';
import { PointTransferPage } from '../point-transfer/point-transfer';

/**
 * Generated class for the PointListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
	selector: 'page-point-list',
	templateUrl: 'point-list.html',
})
export class PointListPage {
	vouchers: Array<{ price: number, points: number }> = [];
	callback;
	tokens: any;
	tokenIndex: any;
	token: any;
	balance: any;
	selectedCard: any;

	offers = [
		{
			img: "http://maaakickboxing.net/wp-content/uploads/2016/04/cards-hero-gift.png",
			price: 2500,
			reward: "50$ gift card",
			description: "get a gift card for your loved ones",
			creator: "Happiness",
			isActivated: false
		}, {
			img: "http://maaakickboxing.net/wp-content/uploads/2016/04/cards-hero-gift.png",
			price: 5000,
			reward: "100$ gift card",
			description: "get a gift card for your loved ones",
			creator: "Happiness",
			isActivated: false
		}, {
			img: "https://www.clintonsretail.com//media/wysiwyg/christmas-single-cards-50off-GIFFTS.jpg",
			price: 500,
			reward: "50% off",
			description: "get 50% off on any purchase under 100$ .",
			creator: "Happiness",
			isActivated: false
		}
	];

	constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
		public platform: Platform, public viewCtrl: ViewController) {
		this.token = this.navParams.get("token");
		this.callback = this.navParams.get("callback")
	}

	presentOfferCreate() {
		let OfferCreateModal = this.modalCtrl.create(OfferCreatePage, { brandId: 1 });
		OfferCreateModal.present();
	}

	presentPointTransfer() {
		/*let PointTransferPageModal = this.modalCtrl.create(PointTransferPage, { token: this.token });
		PointTransferPageModal.present();*/

		this.callback(this.vouchers[this.selectedCard]).then(() => {
			this.navCtrl.pop();
		});
	}

	checkSelection(index) {
		return index === this.selectedCard;
	}

	isRedeemDisabled() {
		return (this.selectedCard != 0 && !this.selectedCard);
	}

	onRedeemTapped() {
		//this.dismiss();
	}

	onVoucherCardTapped(index) {
		this.selectedCard = index;
	}

	async ionViewDidLoad() {
		this.tokenIndex = this.navParams.get("tokenIndex");
		//this.token = this.navParams.get("token");

		this.tokens = [
			{
				name: "IBM",
				symbol: "IBM",
				balance: 350000,
				logo: 'https://logoeps.com/wp-content/uploads/2012/04/ibm-logo-vector.png'
			},
			{
				name: "Happy",
				symbol: "HPY",
				balance: 200000,
				logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ23BRRC85RbvxoN3qROvfJ0W9eDMCe0mdIU0B8ZDIOpZK0sHvwTg'
			}
		];

		if (!this.token && this.tokenIndex) {
			//	this.tokens = []
			this.token = this.tokens[this.tokenIndex];
		}

		//let tempBalance = (await this.loyaltyTokenProvider.getBalance(this.token.address));
		this.balance = this.token.balance // tempBalance.dividedBy(Math.pow(10, this.token.decimal)).toString(10);

		this.vouchers = [
			{ price: 25, points: 50 },
			{ price: 50, points: 100 },
			{ price: 100, points: 200 },
			{ price: 25, points: 50 }
		];

	}


	navigateToTransfer(tokenIndex) {
		this.navCtrl.push('PointTransferPage', {
			token: this.tokens[tokenIndex], tokenIndex: tokenIndex
		});
	}

}
