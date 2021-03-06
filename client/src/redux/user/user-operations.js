import axios from "axios";

import * as $ from "./user-actions";
import * as profileActions from "redux/profile/profile-actions";
import * as userActions from "redux/user/user-actions";
import * as clinicActions from "redux/clinic/clinic-actions";
import * as petsActions from "redux/pets/pets-actions";
import * as surveyActions from "redux/survey/survey-actions";
// import * as surveyDataActions from "redux/survey-data/survey-data-actions";

import { getDateModified, getIsAuthenticated } from "./user-selectors";
import { getAllPets } from "redux/pets/pets-selectors";
import { fetchOrganisation } from "redux/clinic/clinic-operations";
import { syncPets, deletePet } from "redux/pets/pets-operations";
import { syncSurvey } from "redux/survey-data/survey-data-operations";
import { error } from "redux/error/error-operations";
import { getConfig, getTokenConfig } from "utils/ajax";
import { getSearchParams } from "utils/window";

// ------------------- createUser (sing-up) ----------------------

// Create new User and get token
// Spread data in user and profile store
// If error, sign out (clear all stores)
export const signUp = (formData) => async (dispatch) => {
	const { firstName } = formData;
	const endpoint = "/api/user/sign-up";
	const data = JSON.stringify(formData);
	const config = getConfig();
	dispatch($.createStart());
	return axios
		.post(endpoint, data, config)
		.then((res) => {
			dispatch($.createSuccess(res.data));
			dispatch(profileActions.modify({ firstName }));
			dispatch(syncSurvey());
		})
		.catch((err) => {
			dispatch($.createFail());
			dispatch(signOut());
			dispatch(error(err));
		});
};

// ------------------- signIn -----------------------

// Exchange credentials for token
// Set (replace) received data in user, profile, clinic, pets store
// Vet: fetch full clinic doc
// Sync survey
export const signIn = (formData) => (dispatch) => {
	const endpoint = "/api/user/sign-in";
	const data = JSON.stringify(formData);
	const config = getConfig();
	dispatch($.fetchStart());
	axios
		.post(endpoint, data, config)
		.then((res) => {
			const { type, profile, clinic } = res.data;
			dispatch($.fetchSuccess(res.data));
			dispatch(profileActions.set(profile));
			dispatch(clinicActions.set(clinic));
			if (["vet", "superuser"].includes(type))
				dispatch(fetchOrganisation(clinic.id));
			dispatch(syncPets());
			dispatch(syncSurvey());
		})
		.catch((err) => {
			dispatch($.fetchFail());
			dispatch(error(err));
		});
};

// -------------------------- sendCode ------------------------------

// Send password-reset security code by email
export const sendCode = (formData) => async (dispatch) => {
	const config = getConfig();
	dispatch($.updateStart());
	return axios
		.post("/api/user/send-code", JSON.stringify(formData), config)
		.then(() => dispatch($.updateSuccess()))
		.catch((err) => {
			dispatch($.updateFail());
			dispatch(error(err));
		});
};

// -------------------------- resetPassword ------------------------------

// Change password using previously sent security code
export const resetPassword = (formData) => async (dispatch) => {
	const config = getConfig();
	dispatch($.updateStart());
	return axios
		.post("/api/user/reset-pw", JSON.stringify(formData), config)
		.then(() => dispatch($.updateSuccess()))
		.catch((err) => {
			dispatch($.updateFail());
			dispatch(error(err));
		});
};

// -------------------- syncData -----------------------

// GET user data if newer than local
// Add received data in user, profile, clinic stores
// Sync pets and survey
export const syncData = () => (dispatch, getState) => {
	const state = getState();
	const signedIn = getIsAuthenticated(state);
	if (!signedIn) return;

	const endpoint = "/api/user";
	const dateModified = getDateModified(state);
	const data = JSON.stringify({ dateModified });
	const config = getTokenConfig(state);
	dispatch($.syncStart());
	axios
		.post(endpoint, data, config)
		.then((res) => {
			if (res.status === 201) {
				dispatch($.upToDate());
			} else {
				const { type, profile, clinic } = res.data;
				dispatch($.fetchSuccess(res.data));
				dispatch(profileActions.set(profile));
				dispatch(clinicActions.set(clinic));
				if (["vet", "superuser"].includes(type))
					dispatch(fetchOrganisation(clinic.id));
			}
			dispatch(syncPets());
			dispatch(syncSurvey());
		})
		.catch((err) => {
			// 409 impossible as all changes pass through db
			dispatch($.syncFail());
			dispatch(error(err));
		})
		.finally(() => {
			// Search query "?write" disables demo UI limitations until sign-out
			const { write } = getSearchParams();
			if (write !== undefined) dispatch($.modify({ demo: !write }));
		});
};

// -------------------------- updateUser ------------------------------

// POST user data to db
// Spread data from db in user store
// If changed user type, reset pets store
export const updateUser = (formData) => async (dispatch, getState) => {
	const endpoint = "/api/user/update";
	const data = JSON.stringify(formData);
	const config = getTokenConfig(getState());
	dispatch($.updateStart());
	return axios
		.post(endpoint, data, config)
		.then((res) => {
			dispatch($.updateSuccess(res.data));
			if (!formData.type) return true;
			dispatch(petsActions.clear());
			dispatch(syncPets());
			return true;
		})
		.catch((err) => {
			dispatch($.updateFail());
			dispatch(error(err));
			return false;
		});
};

// -------------------------- fetchUserById ------------------------------

// GET user data
export const fetchUserById = (id) => async (dispatch, getState) => {
	const endpoint = "/api/user/" + id;
	const config = getTokenConfig(getState());
	return axios
		.get(endpoint, config)
		.then((res) => res)
		.catch((err) => {
			dispatch(error(err));
			return false;
		});
};

// -------------------------- deleteUser ------------------------------

// Delete user and pets; Restart app
export const closeAccount = (formData) => async (dispatch, getState) => {
	const token = getTokenConfig(getState());
	const petIds = getAllPets(getState()).map((pet) => pet.id);
	dispatch($.deleteStart());
	await Promise.all(petIds.map((id) => dispatch(deletePet({ id }))));
	axios
		.post("/api/user/delete", JSON.stringify(formData), token)
		.then(() => {
			dispatch($.deleteSuccess());
			dispatch(signOut());
		})
		.catch((err) => {
			dispatch($.deleteFail());
			dispatch(error(err));
		});
};

// ---------------------------- signOut ---------------------------------

// Clear store and persistor;
export const signOut = () => (dispatch) => {
	dispatch(userActions.clear());
	dispatch(profileActions.clear());
	dispatch(clinicActions.clear());
	dispatch(petsActions.clear());
	dispatch(surveyActions.clear());
	// localStorage.clear(); -- don't clear survey-data
};
