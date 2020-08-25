import React from "react";
import { Switch, Route, Link, NavLink } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import PetsIcon from "@material-ui/icons/Pets";

import { routes } from "routes";
import { useStyles } from "./Navbar-styles";

// ----------------------------------------------------------------

export const Navbar = () => {
	const clx = useStyles();

	const titles = routes.map(({ path, title, exact }) => (
		<Route exact={exact} path={path} render={() => title} key={path} />
	));

	const [menuOpen, setMenuOpen] = React.useState(false);
	const toggleMenu = () => setMenuOpen(!menuOpen);

	return (
		<div>
			<AppBar position="static">
				{/* <AppBar position="fixed" className={clx.appBar}> */}
				<Toolbar className={clx.toolbar}>
					<IconButton
						color="inherit"
						aria-label="logo"
						children={
							<Link to="/" className={clx.appLogo}>
								<PetsIcon />
							</Link>
						}
					/>

					<Typography variant="h6" align="center" className={clx.title}>
						<Switch>{titles}</Switch>
					</Typography>

					<IconButton
						aria-label="Open menu"
						children={<MenuIcon fontSize="large" />}
						onClick={toggleMenu}
						color="inherit"
					/>
				</Toolbar>
			</AppBar>

			<nav>
				<Hidden implementation="css">
					<Drawer
						variant="temporary"
						anchor="right"
						open={menuOpen}
						onClose={toggleMenu}
						classes={{ paper: clx.drawerPaper }}
						ModalProps={{ keepMounted: true }} // Better mobile performance
					>
						<IconButton
							aria-label="Close menu"
							children={<CloseIcon fontSize="large" />}
							onClick={toggleMenu}
							className={clx.closeMenuButton}
						/>
						<List>
							{routes.map(
								({ path, title, linkText, exact, inNav }) =>
									inNav && (
										<ListItem
											button
											component={NavLink}
											to={path}
											exact={exact}
											className={clx.navLink}
											activeClassName={clx.navLinkActive}
											onClick={toggleMenu}
											key={path}
										>
											<ListItemText
												primary={linkText || title}
												primaryTypographyProps={{ variant: "h4" }}
											/>
										</ListItem>
									)
							)}
						</List>
					</Drawer>
				</Hidden>
			</nav>
		</div>
	);
};