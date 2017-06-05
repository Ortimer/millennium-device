"use strict";

var React = require("react");
var Dispatcher = require("flux/lib/Dispatcher");
var VirtualDeckStore = require("../stores/VirtualDeckStore.js");

var VirtualStoreDeck = React.createClass({
	displayName: "virtual-store",
	propTypes: {
		dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
		virtualDeckStore: React.PropTypes.instanceOf(VirtualDeckStore).isRequired
	},
	getInitialState: function () {
		return {
			currentDeck: this.props.virtualDeckStore.currentSlice,
			currentIndex: this.props.virtualDeckStore.currentIndex
		};
	},
	resetDeck: function() {
		this.props.virtualDeckStore.currentSlice = [];
		this.props.virtualDeckStore.currentIndex = 0;
		this.setState({ currentDeck: this.props.virtualDeckStore.currentSlice, currentIndex: this.props.virtualDeckStore.currentIndex});
	},
	pollCards: function(amount) {
		var virtualDeckStore = this.props.virtualDeckStore;
		var currentIndex = this.state.currentIndex;
		var slice = virtualDeckStore.pollCards(currentIndex, amount);
		currentIndex += slice.length;

		var compactSlice = [];
		var currentSet = null;
		var count = 0;

		for (var i = 0; i < slice.length; i++) {
			var set = slice[i];
	    if (currentSet == null) {
	      currentSet = set;
	      count = 1;
	    } else if (currentSet == set) {
	      count++;
	    } else {
	      compactSlice.push(currentSet + " x " + count);
	      currentSet = set;
	      count = 1;
	    }
		}
		if (currentSet) {
			compactSlice.push(currentSet + " x " + count);
		}

    this.props.virtualDeckStore.currentSlice = compactSlice;
		this.props.virtualDeckStore.currentIndex = currentIndex;
		this.setState({ currentDeck: this.props.virtualDeckStore.currentSlice, currentIndex: this.props.virtualDeckStore.currentIndex});
	},
	render: function () {
		var { dispatcher, virtualDeckStore } = this.props;
		var currentDeck = this.state.currentDeck;
		var currentIndex = this.state.currentIndex;

		var listContent = [React.createElement("li", { key: "currentIndex", className: "virtual-store--currentIndex" }, "Current card: " + currentIndex)];
		listContent = listContent.concat(currentDeck.map((item, index) => React.createElement("li", { className: "virtual-store--item", key: index }, item)));

		return React.createElement("div", { className: "virtual-store" },
			React.createElement("div", { className: "virtual-store--header" }, [
					React.createElement(
						"button",
						{
							className: "btn btn-primary virtual-store--button",
							key: "draw20Button",
							onClick: () => this.pollCards(20)
						},
						"Draw 20 cards"
					),
					React.createElement(
						"button",
						{
							className: "btn btn-primary virtual-store--button",
							key: "draw50Button",
							onClick: () => this.pollCards(50)
						},
						"Draw 50 cards"
					),
					React.createElement(
						"button",
						{
							className: "btn btn-primary virtual-store--button",
							key: "draw70Button",
							onClick: () => this.pollCards(70)
						},
						"Draw 70 cards"
					),
					React.createElement(
						"button",
						{
							className: "btn btn-primary virtual-store--button",
							key: "resetButton",
							onClick: this.resetDeck
						},
						"Reset deck"
					)
				]
			),
			React.createElement("div", { className: "virtual-store--draw" },
				React.createElement("ul", { key: "name", className: "virtual-store--list" }, listContent)
			)
		);
	},
});

module.exports = VirtualStoreDeck;
