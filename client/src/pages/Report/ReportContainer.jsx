import React from "react";
import { connect } from "react-redux";
import { getReportById, getPetById } from "redux/pets/pets-selectors";
import { convertPet } from "redux/pets/pets-utils";
import { getIsVet } from "redux/user/user-selectors";
import Report from "./Report";

const mapStateToProps = (state) => ({
	getReport: (id) => getReportById(state, id),
	getPet: (id) => convertPet(getPetById(state, id)),
	isVet: getIsVet(state),
});

const ReportContainer = (props) => <Report {...props} />;

export default connect(mapStateToProps)(ReportContainer);
