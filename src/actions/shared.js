import API from "goals-todos-api";

export const RECEIVE_ITEMS = "RECEIVE_ITEMS";

const receiveItems = (todos, goals) => {
	return {
		type: RECEIVE_ITEMS,
		todos,
		goals,
	};
};

export const handleInitialData = () => {
	return (dispatch) => {
		return Promise.all([API.fetchTodos(), API.fetchGoals()]).then(
			([todos, goals]) => {
				dispatch(receiveItems(todos, goals));
			}
		);
	};
};
