import React from "react";
import { connect } from "react-redux";

import { getFormData } from "redux/profile/profile-selectors";
import { updateProfile } from "redux/profile/profile-operations";
import { getIsDemo } from "redux/user/user-selectors";

import { ProfileForm } from "./ProfileForm";

const mapStateToProps = (state) => ({
	currentProfile: getFormData(state),
	isDemo: getIsDemo(state),
});

const mapDispatchToProps = (dispatch) => ({
	update: (data) => dispatch(updateProfile(data)),
});

const ProfileFormContainer = (props) => <ProfileForm {...props} />;

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfileFormContainer);
