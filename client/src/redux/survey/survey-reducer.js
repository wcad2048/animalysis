import { surveyData } from "./survey-data";

import * as $ from "./survey-actions";
import { getDataWithAddedAnswer } from "./survey-utils";

// Answers get added to surveyData and submitted altogether
// pageStack (FILO) keeps track of pages to return to upon completing current page (which is at the top of the stack)

const INITIAL_STATE = {
	data: surveyData,
	pageStack: null,
};

const surveyReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case $.SUBMIT_ANSWER: {
			return {
				...state,
				data: getDataWithAddedAnswer(state.data, action.payload),
			};
		}
		default:
			return state;
	}
};

export default surveyReducer;