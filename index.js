"use-strict";

function createState() {
	// It consists of 4 parts
	// 1. The state
	// 2. Getting the state
	// 3. Listening to state
	// 4. updating the state

	let state = { hello: "hi" };

	const getState = () => state;

	return { getState };
}

// x = createState();
// console.log(x.getState());
