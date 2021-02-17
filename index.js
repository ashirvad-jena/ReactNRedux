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

const handleInitialData = () => {
	return (dispatch) => {
		return Promise.all([API.fetchTodos(), API.fetchGoals()]).then(
			([todos, goals]) => {
				dispatch(receiveItems(todos, goals));
			}
		);
	};
};

const handleAddTodo = (name, reset) => {
	return (dispatch) => {
		return API.saveTodo(name)
			.then((todo) => {
				dispatch(addTodoAction(todo));
				reset();
			})
			.catch(() => {
				alert("Something went wrong. Please try later. :(");
			});
	};
};

const handleToggleItem = (id) => {
	return (dispatch) => {
		dispatch(toggleTodoAction(id));
		return API.saveTodoToggle(id).catch(() => {
			dispatch(toggleTodoAction(id));
			alert("Something went wrong. Please try later. :(");
		});
	};
};

const handleDeleteTodo = (todo) => {
	return (dispatch) => {
		dispatch(removeTodoAction(todo.id));
		return API.deleteTodo(todo.id).catch(() => {
			dispatch(addTodoAction(todo));
			alert("Something went wrong. Please try later. :(");
		});
	};
};

const handleAddGoal = (input, reset) => {
	return (dispatch) => {
		return API.saveGoal(input)
			.then((goal) => {
				dispatch(addGoalAction(goal));
				reset();
			})
			.catch(() => {
				alert("Something went wrong. Please try later. :(");
			});
	};
};

const handleRemoveGoal = (goal) => {
	return (dispatch) => {
		dispatch(removeGoalAction(goal.id));
		return API.deleteGoal(goal.id).catch(() => {
			dispatch(addGoalAction(goal));
			alert("Something went wrong. Please try later. :(");
		});
	};
};

// Reducers
const todos = (state = [], action) => {
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
};

const goals = (state = [], action) => {
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
};

const loading = (state = true, action) => {
	switch (action.type) {
		case RECEIVE_ITEMS:
			return false;
		default:
			return state;
	}
};

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
// Middlewares
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

/* Replaced by ReduxThunk.default middleware
const thunk = (store) => (next) => (action) => {
	if (typeof action === "function") {
		action(store.dispatch);
	}
	return next(action);
};
*/

const store = Redux.createStore(
	Redux.combineReducers({
		todos,
		goals,
		loading,
	}),
	Redux.applyMiddleware(ReduxThunk.default, checker, logger)
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

// class ConnectedTodo extends React.Component {
// 	render() {
// 		return (
// 			<Context.Consumer>
// 				{(store) => {
// 					const { todos } = store.getState();
// 					const dispatch = store.dispatch;
// 					return <Todo todos={todos} dispatch={dispatch} />;
// 				}}
// 			</Context.Consumer>
// 		);
// 	}
// }

class Todo extends React.Component {
	addItem = (event) => {
		event.preventDefault();
		this.props.dispatch(
			handleAddTodo(this.input.value, () => (this.input.value = ""))
		);
	};

	removeItem = (todo) => {
		this.props.dispatch(handleDeleteTodo(todo));
	};

	toggleItem = (id) => {
		this.props.dispatch(handleToggleItem(id));
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

// class ConnectedGoal extends React.Component {
// 	render() {
// 		return (
// 			<Context.Consumer>
// 				{(store) => {
// 					const { goals } = store.getState();
// 					return <Goal goals={goals} dispatch={store.dispatch} />;
// 				}}
// 			</Context.Consumer>
// 		);
// 	}
// }

class Goal extends React.Component {
	addGoal = (event) => {
		event.preventDefault();
		console.log(this.props);
		this.props.dispatch(
			handleAddGoal(this.input.value, () => (this.input.value = ""))
		);
	};

	removeItem = (goal) => {
		this.props.dispatch(handleRemoveGoal(goal));
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

/*
class ConnectedApp extends React.Component {
	render() {
		return (
			<Context.Consumer>
				{(store) => <App store={store} />}
			</Context.Consumer>
		);
	}
}
*/

class App extends React.Component {
	componentDidMount() {
		this.props.dispatch(handleInitialData());
	}

	render() {
		if (this.props.loading) {
			return <h3>Loading...</h3>;
		}
		return (
			<div>
				<ConnectedTodo />
				<ConnectedGoal />
			</div>
		);
	}
}

const ConnectedApp = connect((state) => ({
	loading: state.loading,
}))(App);

const ConnectedTodo = connect((state) => ({
	todos: state.todos,
}))(Todo);

const ConnectedGoal = connect((state) => ({
	goals: state.goals,
}))(Goal);

const Context = React.createContext();

function connect(mapStateToProps) {
	return (Component) => {
		class Reciever extends React.Component {
			componentDidMount() {
				const { subscribe } = this.props.store;
				this.unsubscribe = subscribe(() => {
					this.forceUpdate();
				});
			}

			componentWillUnmount() {
				this.unsubscribe();
			}

			render() {
				const { getState, dispatch } = this.props.store;
				const stateNeeded = mapStateToProps(getState());
				return <Component {...stateNeeded} dispatch={dispatch} />;
			}
		}

		class ConnectedComponent extends React.Component {
			render() {
				return (
					<Context.Consumer>
						{(store) => <Reciever store={store} />}
					</Context.Consumer>
				);
			}
		}
		return ConnectedComponent;
	};
}

class Provider extends React.Component {
	render() {
		return (
			<Context.Provider value={this.props.store}>
				{this.props.children}
			</Context.Provider>
		);
	}
}

ReactDOM.render(
	<Provider store={store}>
		<ConnectedApp />
	</Provider>,
	document.getElementById("app")
);
