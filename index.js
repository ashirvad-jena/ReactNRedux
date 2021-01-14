/* Added Redux library so commenting this out
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
*/

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

const checkAndDispatch = (store, action) => {
	if (
		action.type === ADD_TODO &&
		action.todo.name.toLowerCase().includes("bitcoin")
	) {
		return alert("Nope!!. Bad idea");
	}
	if (
		action.type === ADD_GOAL &&
		action.goal.name.toLowerCase().includes("bitcoin")
	) {
		return alert("Nope!!. Bad idea");
	}
	return store.dispatch(action);
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
/*
// root reducer
function app(state = {}, action) {
	return {
		todos: todos(state.todos, action),
		goals: goals(state.goals, action),
	};
}

const store = createStore(app);
*/

const store = Redux.createStore(
	Redux.combineReducers({
		todos,
		goals,
	})
);

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
	checkAndDispatch(
		store,
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
	checkAndDispatch(
		store,
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
		checkAndDispatch(store, removeTodoAction(todo.id));
	});
	node.style.textDecoration = todo.complete ? "line-through" : "none";
	node.addEventListener("click", () => {
		checkAndDispatch(store, toggleTodoAction(todo.id));
	});
	node.appendChild(textNode);
	node.appendChild(removeBtn);
	document.getElementById("todos").appendChild(node);
};

const addGoalToDOM = (goal) => {
	const node = document.createElement("li");
	const textNode = document.createTextNode(goal.name);
	const removeBtn = createDeleteBtn(() => {
		checkAndDispatch(store, removeGoalAction(goal.id));
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
	console.log(store.getState());
});

document.getElementById("todoBtn").addEventListener("click", addTodo);
document.getElementById("goalBtn").addEventListener("click", addGoal);

const test = {
	users: {},
	setting: {},
	tweets: {
		btyxlj: {
			text: "What is a jQuery?",
			author: {
				name: "Tyler McGinnis",
				id: "tylermcginnis",
				avatar: "twt.com/tm.png",
			},
		},
	},
};

const cat = {
	legs: 4,
	sound: "meow",
	inner: {
		eye: 2,
		tail: 1,
	},
};
const dog = {
	...cat,
	inner: {
		...cat.inner,
		eye: 4,
	},
};

const test2 = {
	...test,
	tweets: {
		...test.tweets,
		btyxlj: {
			...test.tweets.btyxlj,
			author: {
				...test.tweets.btyxlj.author,
				avatar: "newAvatar",
			},
		},
	},
};

console.log(cat);
console.log(dog);
console.log(test);
console.log(test2);

const style = {
	width: 300,
	marginLeft: 10,
	marginRight: 30,
};

const { width, ...margin } = style;

console.log(width);
console.log(margin);
