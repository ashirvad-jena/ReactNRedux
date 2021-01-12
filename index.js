// Library Code
function createStore(reducer) {
	// It consists of 4 parts
	// 1. The state
	// 2. Getting the state
	// 3. Listening to state
	// 4. updating the state

	let state;
	let listeners = [];

	const getState = () => state;

	const subscribe = (listener) => {
		listeners.push(listener);
		return () => {
			listeners = listeners.filter((l) => l !== listener);
		};
	};

	const dispatch = (action) => {
		state = reducer(state, action);
		listeners.forEach((listener) => listener());
	};

	return { getState, subscribe, dispatch };
}

// App Code
function todos(state = [], action) {
	console.log(state);
	switch (action.type) {
		case "ADD_ITEM":
			return state.concat([action.todo]);

		case "DELETE_ITEM":
			return state.filter((todo) => todo.id !== action.todo.id);

		case "TOGGLE_ITEM":
			return state.map((todo) =>
				todo.id !== action.todo.id
					? todo
					: Object.assign({}, todo, { completed: !todo.id })
			);

		default:
			return state;
	}
}

function goals(state = [], action) {
	console.log(state);
	switch (action.type) {
		case "ADD_GOAL":
			return state.concat([action.todo]);

		case "DELETE_GOAL":
			return state.filter((goal) => goal.id !== action.goal.id);

		default:
			return state;
	}
}

function app(state = {}, action) {
	return {
		todos: todos(state.todos, action),
		goals: goals(state.goals, action),
	};
}

const store = createStore(app);

store.subscribe(() => {
	console.log("the updated State is:", store.getState());
});

store.dispatch({
	type: "ADD_ITEM",
	todo: { id: 0, name: "Learning redux", status: true },
});
store.dispatch({
	type: "ADD_ITEM",
	todo: { id: 2, name: "Learning dispatch", completed: false },
});
store.dispatch({
	type: "DELETE_ITEM",
	todo: { id: 0, name: "Learning redux", status: true },
});
