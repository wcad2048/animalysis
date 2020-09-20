import React, { useState, useEffect, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import { Spinner } from "components";
import { Navbar, ErrorAlert } from "./components";
import { Account, Demo, NotFound } from "pages";
import { clientRoutes, vetRoutes, suRoutes } from "routes";
import { useStyles } from "./App-styles";

/*******************************
 * App layout
 * Trigger user sync
 * Show Spinner when user or page is loading
 * Root-level Routing
 *******************************/

// TEMP
const isDemo = false;

export const App = ({
	loading,
	authenticated,
	isVet,
	isSuperuser,
	syncData,
	isError,
	clearError,
}) => {
	// TEMP
	useEffect(() => {
		const ESCAPE_KEY = 27;
		const clearStorage = (e) =>
			e.keyCode === ESCAPE_KEY ? localStorage.clear() : null;
		window.addEventListener("keydown", clearStorage);
		return () => window.removeEventListener("keydown", clearStorage);
	}, []);

	// Trigger sync
	useEffect(() => {
		syncData();
	}, [syncData]);

	// Clear error on all clicks (if there's error)
	const handleMainClick = () => (isError ? clearError() : null);

	// ----------- Ensure <main> fills screen on mobile ------------

	const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

	useEffect(() => {
		const handleResize = () => setViewportHeight(window.innerHeight);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const c = useStyles({ viewportHeight });

	// -------------------------- View -----------------------------

	// Create user-relevant Routes from routes array
	const routes = isSuperuser ? suRoutes : isVet ? vetRoutes : clientRoutes;

	const mainRoutes = routes.map((route) => {
		const { path, component, exact, demoOnly } = route;
		if (demoOnly && !isDemo) return null; // TEMP <<<<<<<<<<<<<<<<<<<<<<
		return <Route key={path} {...{ exact, path, component }} />;
	});
	mainRoutes.push(<Route key={404} component={NotFound} />);

	// Enforce authentication
	const authRoutes = (
		<>
			<Route path="/demo" component={Demo} />
			<Route path="/account/:mode" component={Account} />
			<Route component={Account} />
		</>
	);

	if (loading) return <Spinner />;
	return (
		<div className={c.app}>
			<Suspense fallback={Spinner}>
				{authenticated && (
					<header className={c.item}>
						<Navbar {...{ routes, isSuperuser, isDemo }} />
					</header>
				)}
				{isError && (
					<div className={c.item}>
						<ErrorAlert />
					</div>
				)}
				<main className={c.main} onClick={handleMainClick}>
					<Switch>{!authenticated ? authRoutes : mainRoutes}</Switch>
				</main>
			</Suspense>
		</div>
	);
};
