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

store.dispatch(removeTodoAction(1));

store.dispatch(toggleTodoAction(0));

store.dispatch(removeGoalAction(0));

const generateId = () =>
	Math.random().toString(36).substring(2) + new Date().getTime().toString(36);

const createDeleteBtn = (click) => {
	const removeBtn = document.createElement("button");
	removeBtn.innerHTML = "X";
	removeBtn.addEventListener("click", click);
	return removeBtn;
};

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

const addTodoToDOM = (todo) => {
	console.log(todo);
	const node = document.createElement("li");
	const textNode = document.createTextNode(todo.name);
	const removeBtn = createDeleteBtn(() => {
		store.dispatch(removeTodoAction(todo.id));
	});
	node.style.textDecoration = todo.complete ? "line-through" : "none";
	node.addEventListener("click", () => {
		store.dispatch(toggleTodoAction(todo.id));
	});
	node.appendChild(textNode);
	node.appendChild(removeBtn);
	document.getElementById("todos").appendChild(node);
};

const addGoalToDOM = (goal) => {
	const node = document.createElement("li");
	const textNode = document.createTextNode(goal.name);
	const removeBtn = createDeleteBtn(() => {
		store.dispatch(removeGoalAction(goal.id));
	});
	node.appendChild(textNode);
	node.appendChild(removeBtn);
	document.getElementById("goals").appendChild(node);
};

store.subscribe(() => {
	document.getElementById("goals").innerHTML = "";
	document.getElementById("todos").innerHTML = "";
	const { todos, goals } = store.getState();
	todos.forEach((todo) => addTodoToDOM(todo));
	goals.forEach((goal) => addGoalToDOM(goal));
});

document.getElementById("todoBtn").addEventListener("click", addTodo);
document.getElementById("goalBtn").addEventListener("click", addGoal);
