import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";

import { Navbar } from "./components";
import { Spinner } from "components";
import { Account } from "pages";

import { useStyles } from "./App-styles";
import { routes } from "routes";

/*******************************
 * App layout
 * Show Spinner when user is loading
 * Root-level Routing
 * Trigger user sync
 *******************************/

export const App = ({ loading, authenticated, syncUser }) => {
	const c = useStyles();

	// TEMP
	useEffect(() => {
		const ESCAPE_KEY = 27;
		const clearStorage = (e) =>
			e.keyCode === ESCAPE_KEY ? localStorage.clear() : null;
		window.addEventListener("keydown", clearStorage);
		return () => window.removeEventListener("keydown", clearStorage);
	}, []);

	useEffect(() => {
		syncUser();
	}, [syncUser]);

	// Create Routes from routes array
	const mainRoutes = routes.map((route) => {
		const { path, component, exact } = route;
		return <Route exact={exact} path={path} component={component} key={path} />;
	});

	// Enforce authentication
	const authRoutes = (
		<>
			<Route path="/account/:mode" component={Account} />
			<Route component={Account} />
		</>
	);

	if (loading) return <Spinner />;
	return (
		<div className={c.app}>
			{authenticated && (
				<header className={c.header}>
					<Navbar />
				</header>
			)}
			<main className={c.main}>
				<Switch>{!authenticated ? authRoutes : mainRoutes}</Switch>
			</main>
		</div>
	);
};