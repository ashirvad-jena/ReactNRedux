import API from "goals-todos-api";

export const ADD_TODO = "ADD_TODO";
export const REMOVE_TODO = "REMOVE_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";

const addTodo = (todo) => {
	return {
		type: ADD_TODO,
		todo,
	};
};

const removeTodo = (id) => {
	return {
		type: REMOVE_TODO,
		id,
	};
};

const toggleTodo = (id) => {
	return {
		type: TOGGLE_TODO,
		id,
	};
};

export function handleAddTodo(name, reset) {
	return (dispatch) => {
		return API.saveTodo(name)
			.then((todo) => {
				dispatch(addTodo(todo));
				reset();
			})
			.catch(() => {
				alert("Something went wrong. Please try later. :(");
			});
	};
}

export function handleToggle(id) {
	return (dispatch) => {
		dispatch(toggleTodo(id));
		return API.saveTodoToggle(id).catch(() => {
			dispatch(toggleTodo(id));
			alert("Something went wrong. Please try later. :(");
		});
	};
}

export function handleDeleteTodo(todo) {
	return (dispatch) => {
		dispatch(removeTodo(todo.id));
		return API.deleteTodo(todo.id).catch(() => {
			dispatch(addTodo(todo));
			alert("Something went wrong. Please try later. :(");
		});
	};
}
