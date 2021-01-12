"use-strict";

function createStore() {
	// It consists of 4 parts
	// 1. The state
	// 2. Getting the state
	// 3. Listening to state
	// 4. updating the state

	let state = { hello: "hi" };
	let listeners = [];

	const getState = () => state;

	const subscribe = (listener) => {
		listeners.push(listener);
		return () => {
			listeners = listeners.filter((l) => l !== listener);
			console.log(listeners.length);
		};
	};

	return { getState, subscribe, listeners };
}

// const store = createStore();
// store.subscribe(() => {
// 	console.log(`The updated state is ${store.getState()}`);
// });
// const secondSubscribtion = store.subscribe(() => {
// 	console.log(`The updated state 2 is ${store.getState()}`);
// });

// secondSubscribtion();

// console.log(store.listeners.length);

// store.listeners.forEach((element) => {
// 	element();
// });
