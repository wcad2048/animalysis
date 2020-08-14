import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Button } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import { summaryData } from "./Summary-data";

const useStyles = makeStyles((theme) => ({
	page: {
		display: "flex",
		flexFlow: "column nowrap",
		justifyContent: "space-between",
		padding: theme.spacing(3),
	},
	head: {
		display: "flex",
		justifyContent: "space-evenly",
		alignItems: "center",
	},
	alert: ({ color, backgroundColor }) => ({
		border: `2px solid ${color}`,
		background: backgroundColor,
	}),
	alertText: {
		margin: 0,
		textTransform: "uppercase",
	},
	main: {
		display: "grid",
		gridGap: theme.spacing(3),
	},
	nav: {
		display: "flex",
		justifyContent: "space-between",
	},
}));

// TEMP
const pet = { name: "Bobo" };

const Summary = ({
	alertLevel,
	optionalQueueExists,
	callClinic,
	continueSurvey,
	endSurvey,
}) => {
	const data = summaryData[alertLevel];
	const clx = useStyles(data);

	const canContinue = optionalQueueExists && alertLevel < 4;

	return (
		<Container className={clx.page}>
			<div className={clx.head}>
				<Typography children="Urgency Level: " variant="h5" />
				<Alert className={clx.alert} icon={false}>
					<AlertTitle className={clx.alertText}>{data.urgency}</AlertTitle>
				</Alert>
			</div>

			<Container className={clx.main}>
				<Typography children={data.textMain(pet)} />
				{canContinue && !!data.textContinue && (
					<Typography children={data.textContinue(pet)} />
				)}
				{!!data.textEnd && <Typography children={data.textEnd(pet)} />}

				<Button
					fullWidth
					variant={alertLevel ? "contained" : "outlined"}
					color="primary"
					children="Call Clinic"
					className={clx.callButton}
					onClick={callClinic}
				/>
			</Container>

			<div className={clx.nav}>
				{canContinue && (
					<Button
						color="default"
						children="Continue Analysis"
						className={clx.navButton}
						onClick={continueSurvey}
					/>
				)}
				<Button
					fullWidth={!canContinue}
					color="default"
					children="Submit report"
					className={clx.navButton}
					onClick={endSurvey}
				/>
			</div>
		</Container>
	);
};

export default Summary;