import { Home } from "pages/Home";
import { Profile } from "pages/Profile";
import { ProfileForm } from "pages/ProfileForm";
import { Survey } from "pages/Survey";
import { Report } from "pages/Report";
import { Account } from "pages/Account";
import { Summary } from "pages/Summary";

export const routes = [
	{
		path: "/", // URL
		title: "Home", // Appers in header
		component: Home, // To render
		exact: true, // Router Switch match
		inNav: true, // Is listed in Nav Menu
	},
	// --- Pet profile ---
	{
		path: "/profile/:name",
		title: "Pet Profile",
		component: Profile,
		exact: true,
		inNav: false,
	},
	// --- Add/edit pet profile ---
	{
		path: "/add-profile",
		title: "Edit Profile",
		component: ProfileForm,
		exact: true,
		inNav: false,
	},
	{
		path: "/edit-profile/:name",
		title: "Edit Profile",
		component: ProfileForm,
		exact: true,
		inNav: false,
	},
	// --- Analysis ---
	{
		path: "/analysis",
		title: "New Analysis",
		component: Survey,
		exact: true,
		inNav: true,
	},
	{
		path: "/analysis/summary",
		title: "Analysis Summary",
		component: Summary,
		exact: true,
		inNav: false,
	},
	{
		path: "/analysis/alert",
		title: "Alert",
		component: Summary,
		exact: true,
		inNav: false,
	},
	// --- Report ---
	{
		path: "/report",
		title: "Report",
		component: Report,
		exact: true,
		inNav: false,
	},
	{
		path: "/report/:id",
		title: "Report",
		component: Report,
		exact: true,
		inNav: false,
	},
	// --- Account ---
	{
		path: "/account",
		title: "My Account",
		component: Account,
		exact: true,
		inNav: true,
	},
	{
		path: "/account/:mode",
		title: "My Account",
		component: Account,
		exact: true,
		inNav: false,
	},
];
