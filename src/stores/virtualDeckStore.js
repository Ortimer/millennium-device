"use strict";

var microevent = require("microevent-github");
var storageKey = "mba:excluded-products";
var separator = "|";
var { shuffle } = require("../util.js");

function VirtualDeckStore(args) {
	var { sets, choiceStores } = args;
	var self = this;
	self.setCounts = {};
	self.choiceStores = choiceStores;
	self.currentDeck = [];

	sets.forEach(set => {
		if (set.count) {
			self.setCounts[set.name] = set;
		}
	});
}
VirtualDeckStore.prototype.registerDispatcher = function (dispatcher) {
	var self = this;

};
VirtualDeckStore.prototype.pollCards = function (index, amount) {
	var self = this;
	var currentDeck = self.currentDeck;

	if (index == 0) {
		var coreCount = self.setCounts["Core"];
		currentDeck = Array(coreCount.count).fill(coreCount.name);

		for (var i = 0; i < self.choiceStores.Expansion.size(); i++) {
			var expansion = self.choiceStores.Expansion.get(i);
			if (expansion) {
				var expansionCount = self.setCounts[expansion];
				currentDeck = currentDeck.concat(Array(expansionCount.count).fill(expansionCount.name));
			}
		}

		for (var i = 0; i < self.choiceStores.Premium.size(); i++) {
			var premium = self.choiceStores.Premium.get(i);
			if (premium) {
				var premiumCount = self.setCounts[premium];
				currentDeck = currentDeck.concat(Array(premiumCount.count).fill(premiumCount.name));
			}
		}

		for (var i = 0; i < self.choiceStores.Master.size(); i++) {
			var master = self.choiceStores.Master.get(i);
			if (master) {
				var masterCount = self.setCounts[master];
				currentDeck = currentDeck.concat(Array(masterCount.count).fill(masterCount.name));
			}
		}

		currentDeck = shuffle(currentDeck);
		self.currentDeck = currentDeck;
	}

	return currentDeck.slice(index, index + amount);
};

microevent.mixin(VirtualDeckStore);

module.exports = VirtualDeckStore;
