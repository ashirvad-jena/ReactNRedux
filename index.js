// import React, { Component } from "react";

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
const RECEIVE_ITEMS = "RECEIVE_ITEMS";

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

const receiveItems = (todos, goals) => {
	return {
		type: RECEIVE_ITEMS,
		todos,
		goals,
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

		case RECEIVE_ITEMS:
			return action.todos;

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

		case RECEIVE_ITEMS:
			return action.goals;

		default:
			return state;
	}
}

/* // Commenting this due to additon of Redux.applyMiddleware
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
*/
const checker = (store) => (next) => (action) => {
	if (
		action.type === ADD_TODO &&
		action.todo.name.toLowerCase().includes("bitcoin")
	) {
		return alert("Nope. That's a bad idea.");
	}

	if (
		action.type === ADD_GOAL &&
		action.goal.name.toLowerCase().includes("bitcoin")
	) {
		return alert("Nope. That's a bad idea.");
	}
	return next(action);
};

const logger = (store) => (next) => (action) => {
	console.group(action.type);
	console.log("the action: ", action);
	console.log("the old state: ", store.getState());
	const result = next(action);
	console.log("the updated state: ", store.getState());
	console.groupEnd();
	return result;
};
/*
		// root reducer Replaced by Redux.combineReducers
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
	}),
	Redux.applyMiddleware(checker, logger)
);

const generateId = () =>
	Math.random().toString(36).substring(2) + new Date().getTime().toString(36);

/*
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
*/
const List = (props) => {
	return (
		<ul>
			{props.items.map((item) => (
				<li key={item.id}>
					<span
						onClick={() => props.toggle && props.toggle(item.id)}
						style={{
							textDecoration: item.complete
								? "line-through"
								: "none",
						}}
					>
						{item.name}
					</span>
					<button onClick={() => props.remove(item)}>X</button>
				</li>
			))}
		</ul>
	);
};

class Todo extends React.Component {
	addItem = (event) => {
		event.preventDefault();
		const name = this.input.value;
		this.input.value = "";
		this.props.store.dispatch(
			addTodoAction({
				id: generateId(),
				complete: false,
				name,
			})
		);
	};

	removeItem = (todo) => {
		this.props.store.dispatch(removeTodoAction(todo.id));
	};

	toggleItem = (id) => {
		this.props.store.dispatch(toggleTodoAction(id));
	};

	render() {
		return (
			<div>
				<h1>Todo List</h1>
				<input
					type="text"
					placeholder="Add Todo"
					ref={(input) => (this.input = input)}
				></input>
				<button onClick={this.addItem}>Add Todo</button>
				<List
					items={this.props.todos}
					remove={this.removeItem}
					toggle={this.toggleItem}
				/>
			</div>
		);
	}
}

class Goal extends React.Component {
	addGoal = (event) => {
		event.preventDefault();
		const name = this.input.value;
		this.input.value = "";
		this.props.store.dispatch(
			addGoalAction({
				id: generateId(),
				name,
			})
		);
	};

	removeItem = (goal) => {
		this.props.store.dispatch(removeGoalAction(goal.id));
	};

	render() {
		return (
			<div>
				<h1>Goals</h1>
				<input
					type="text"
					placeholder="Add Goals"
					ref={(input) => (this.input = input)}
				></input>
				<button onClick={this.addGoal}>Add Goal</button>
				<List items={this.props.goals} remove={this.removeItem} />
			</div>
		);
	}
}

class App extends React.Component {
	componentDidMount() {
		const { store } = this.props;
		store.subscribe(() => {
			this.forceUpdate();
		});
		Promise.all([API.fetchTodos(), API.fetchGoals()]).then(
			([todos, goals]) => {
				console.log(todos);
				console.log(goals);
				store.dispatch(receiveItems(todos, goals));
			}
		);
	}

	render() {
		const { store } = this.props;
		const { todos, goals } = store.getState();
		return (
			<div>
				<Todo todos={todos} store={store} />
				<Goal goals={goals} store={store} />
			</div>
		);
	}
}
ReactDOM.render(<App store={store} />, document.getElementById("app"));
