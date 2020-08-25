import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import { PetSnippet } from "components";

const useStyles = makeStyles((theme) => ({
	link: {
		textDecoration: "none",
	},
	alert: {
		marginTop: theme.spacing(2),
		alignItems: "center",
	},
}));

export const Head = ({ pet, clinicIsSet, userHasPhone }) => {
	const clx = useStyles();

	return (
		// separte content from parent's grid layout
		<div>
			<PetSnippet pet={pet} small />
			{!clinicIsSet ? (
				<Link to="/my-clinic" className={clx.link}>
					<Alert
						severity="error"
						children="You haven't chosen a clinic to send reports to. Click here to add one."
						className={clx.alert}
					/>
				</Link>
			) : !userHasPhone ? (
				<Link to="/profile" className={clx.link}>
					<Alert
						severity="warning"
						children="Add a phone number so that your clinic can contact you."
						className={clx.alert}
					/>
				</Link>
			) : null}
		</div>
	);
};