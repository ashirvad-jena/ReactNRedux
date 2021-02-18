import { RECEIVE_ITEMS } from "../actions/shared";

export default function loading(state = true, action) {
	switch (action.type) {
		case RECEIVE_ITEMS:
			return false;
		default:
			return state;
	}
}
