const express = require("express");
const auth = require("../../middleware/auth");
const Profile = require("../../models/profile");
const profileUtils = require("./profile-utils");
const utils = require("../../utils");

const { filterProfile } = profileUtils;
const { isEmpty } = utils;

const router = express.Router();

// ------------------- Create profile -------------------

router.post("/create", auth, async (req, res) => {
	try {
		const { userId, body } = req;
		const submittedData = filterProfile(body);

		// Validate
		if (isEmpty(submittedData)) return res.status(400).json("No data");
		const profile = await Profile.findOne({ userId });
		if (profile) return res.status(403).json("Profile already exists");

		// Create profile
		const newProfile = new Profile({ userId, ...submittedData });
		const savedProfile = await newProfile.save();
		if (!savedProfile) throw Error("Error saving profile");

		res.status(200).json(filterProfile(savedProfile));
	} catch (e) {
		res.status(500).json(e.message);
	}
});

// ------------------ Sync user -----------------

// router.post("/", auth, async (req, res) => {
// 	try {
// 		const { userId, body } = req;

// 		// Validate
// 		const user = await User.findById(userId).select("-password");
// 		if (!user) return res.status(404).json({ note: "User doesn't exist" });

// 		// Record action (non-blocking; for analytics only)
// 		user.dateSynced = new Date();
// 		user.save();

// 		// Compare local and remote versions and determine response
// 		const dateLocal = new Date(body.dateModified).getTime();
// 		const dateRemote = new Date(user.dateModified).getTime();

// 		if (dateLocal == dateRemote) return res.status(201).send();
// 		return res.status(200).json(getFilteredUserData(user));
// 	} catch (e) {
// 		res.status(400).json({ note: e.message });
// 	}
// });

// ----------------- Update user ----------------
// acces: token & password

// router.post("/update", auth, async (req, res) => {
// 	try {
// 		const { userId, body } = req;
// 		const { password, newEmail, newPassword, type } = body;

// 		// Validate credentials
// 		if (!password) throw Error("Missing credentials");
// 		const user = await User.findById(userId);
// 		if (!user) return res.status(404).json({ note: "User doesn't exist" });
// 		const passwordsMatch = await bcrypt.compare(password, user.password);
// 		if (!passwordsMatch)
// 			return res.status(403).json({
// 				target: "password",
// 				msg: "Invalid credentials",
// 			});

// 		// Update rest and save
// 		if (type && type !== "superuser") user.type = type;
// 		user.dateModified = new Date();
// 		await user.save();

// 		return res.status(200).json(getFilteredUserData(user));
// 	} catch (e) {
// 		res.status(400).json({ note: e.message });
// 	}
// });

// ---------------- Delete profile ----------------

router.delete("/", auth, async (req, res) => {
	try {
		const { userId } = req;
		const profile = await Profile.findOneAndRemove({ userId });
		if (!profile) throw Error("Profile doesn't exist");
		res.status(200).send();
	} catch (e) {
		res.status(400).json(e.message);
	}
});

// ----------------------------------------------------------------

module.exports = router;