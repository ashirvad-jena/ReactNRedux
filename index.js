// Library Code
function createStore(reducer) {
	// The store should have four parts
	// 1. The state
	// 2. Get the state.
	// 3. Listen to changes on the state.
	// 4. Update the state

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

	return {
		getState,
		subscribe,
		dispatch,
	};
}

// App Code
// action types
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";

// Action creators
const addTodoAction = (todo) => {
	return {
		type: ADD_TODO,
		todo,
	};
};

const removeTodoAction = (id) => {
	return {
		type: REMOVE_TODO,
		id,
	};
};

const toggleTodoAction = (id) => {
	return {
		type: TOGGLE_TODO,
		id,
	};
};

const addGoalAction = (goal) => {
	return {
		type: ADD_GOAL,
		goal,
	};
};

const removeGoalAction = (id) => {
	return {
		type: REMOVE_GOAL,
		id,
	};
};

// Reducers
function todos(state = [], action) {
	switch (action.type) {
		case ADD_TODO:
			return state.concat([action.todo]);

		case REMOVE_TODO:
			return state.filter((todo) => todo.id !== action.id);

		case TOGGLE_TODO:
			return state.map((todo) =>
				todo.id !== action.id
					? todo
					: Object.assign({}, todo, { complete: !todo.complete })
			);

		default:
			return state;
	}
}

function goals(state = [], action) {
	switch (action.type) {
		case ADD_GOAL:
			return state.concat([action.goal]);

		case REMOVE_GOAL:
			return state.filter((goal) => goal.id !== action.id);

		default:
			return state;
	}
}
// root reducer
function app(state = {}, action) {
	return {
		todos: todos(state.todos, action),
		goals: goals(state.goals, action),
	};
}

const store = createStore(app);

store.subscribe(() => {
	console.log("The new state is: ", store.getState());
});

store.dispatch(
	addTodoAction({
		id: 1,
		name: "Wash the car",
		complete: false,
	})
);

store.dispatch(
	addTodoAction({
		id: 2,
		name: "Go to the gym",
		complete: true,
	})
);

store.dispatch(removeTodoAction(1));

store.dispatch(toggleTodoAction(0));

store.dispatch(
	addGoalAction({
		id: 0,
		name: "Learn Redux",
	})
);

store.dispatch(removeGoalAction(0));

const generateId = () =>
	Math.random().toString(36).substring(2) + new Date().getTime().toString(36);

const addTodo = () => {
	const input = document.getElementById("todo");
	const name = input.value;
	input.value = "";
	store.dispatch(
		addTodoAction({
			id: generateId(),
			complete: false,
			name,
		})
	);
};

const addGoal = () => {
	const input = document.getElementById("goal");
	const name = input.value;
	input.value = "";
	store.dispatch(
		addGoalAction({
			id: generateId(),
			name,
		})
	);
};

document.getElementById("todoBtn").addEventListener("click", addTodo);
document.getElementById("goalBtn").addEventListener("click", addGoal);
console.log(document);
