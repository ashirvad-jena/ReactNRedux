const logger = (store) => (next) => (action) => {
	console.group(action.type);
	console.log("the action: ", action);
	console.log("the old state: ", store.getState());
	const result = next(action);
	console.log("the updated state: ", store.getState());
	console.groupEnd();
	return result;
};

export default logger;
