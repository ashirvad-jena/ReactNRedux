import API from "goals-todos-api";

export const ADD_GOAL = "ADD_GOAL";
export const REMOVE_GOAL = "REMOVE_GOAL";

const addGoal = (goal) => {
	return {
		type: ADD_GOAL,
		goal,
	};
};

const removeGoal = (id) => {
	return {
		type: REMOVE_GOAL,
		id,
	};
};

export const handleAddGoal = (input, reset) => {
	return (dispatch) => {
		return API.saveGoal(input)
			.then((goal) => {
				dispatch(addGoal(goal));
				reset();
			})
			.catch(() => {
				alert("Something went wrong. Please try later. :(");
			});
	};
};

export const handleRemoveGoal = (goal) => {
	return (dispatch) => {
		dispatch(removeGoal(goal.id));
		return API.deleteGoal(goal.id).catch(() => {
			dispatch(addGoal(goal));
			alert("Something went wrong. Please try later. :(");
		});
	};
};
