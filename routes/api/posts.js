const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/Users");
// eslint-disable-next-line no-unused-vars
const Profile = require("../../models/Profile");

//@route    POST api/post
//@desc     Adding Posts route
//@access   Private
router.post(
	"/",
	[
		auth,
		[
			check("text", "Text is required")
				.not()
				.isEmpty()
		] // eslint-disable-next-line no-unused-vars
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select("-password");

			const newPost = new Post({
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id
			});

			const post = await newPost.save();
			res.json(post);
		} catch (error) {
			console.log(error.message);
			res.status(500).send("Server Error");
		}
	}
);

//@route    GET api/post
//@desc     GET all posts
//@access   Private

router.get("/", auth, async (req, res) => {
	try {
		const post = await Post.find().sort({ date: -1 });
		res.json(post);
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Server Error");
	}
});

//@route    GET api/post/:id
//@desc     Get specific post
//@access   Private
router.get("/:id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ msg: "Post not found" });
		}
	} catch (error) {
		console.error(error.message);
		if (error.kind === "ObjectId") {
			return res.status(404).json({ msg: "Post not found" });
		}
		res.status(500).send("Server Error");
	}
});

//@route    Delete api/posts/:id
//@desc     Delete a post
//@access   Private

router.delete("/:id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: "Post not found" });
		}
		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorized" });
		}

		await post.remove();
		res.json({ msg: "Post removed" });
	} catch (error) {
		console.error(error.message);
		if (error.kind === "ObjectId") {
			return res.status(404).json({ msg: "Post not found" });
		}
		res.status(500).send("Server Error");
	}
});

//@route    PUT api/posts/like/:id
//@desc     Like a post
//@access   Private

router.put("/like/:id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (
			post.likes.filter((like) => like.user.toString() === req.user.id).length >
			0
		) {
			return res.status(400).json({ msg: "Post already liked" });
		}

		post.likes.unshift({ user: req.user.id });

		await post.save();
		res.json(post.likes);
	} catch (error) {
		console.error(error.message);
		if (error.kind === "ObjectId") {
			return res.status(404).json({ msg: "Post not found" });
		}
		res.status(500).send("Server Error");
	}
});
//@route    PUT api/posts/unlike/:id
//@desc     Unlike a post
//@access   Private

router.put("/unlike/:id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (
			post.likes.filter((like) => like.user.toString() === req.user.id)
				.length == 0
		) {
			return res.status(400).json({ msg: "Post has not been liked" });
		}

		const removeIndex = post.likes
			.map((like) => like.user.toString())
			.indexOf(req.user.id);
		post.likes.splice(removeIndex, 1);

		await post.save();
		res.json(post.likes);
	} catch (error) {
		console.error(error.message);
		if (error.kind === "ObjectId") {
			return res.status(404).json({ msg: "Post not found" });
		}
		res.status(500).send("Server Error");
	}
});

//@route    POST api/posts/comment/:id
//@desc     comment on a post
//@access   Private
router.post(
	"/comment/:id",
	[
		auth,
		[
			check("text", "Text is required")
				.not()
				.isEmpty()
		] // eslint-disable-next-line no-unused-vars
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const post = await Post.findById(req.params.id);
			const user = await User.findById(req.user.id).select("-password");

			const newComment = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id
			};

			post.comments.unshift(newComment);

			await post.save();
			res.json(post.comments);
		} catch (error) {
			console.error(error.message);
			if (error.kind === "ObjectId") {
				return res.status(404).json({ msg: "Post not found" });
			}
			res.status(500).send("Server Error");
		}
	}
);

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		const comment = post.comments.find(
			(comment) => comment.id === req.params.comment_id
		);

		if (!comment) {
			return res.status(404).json({ msg: "Comment not found" });
		}
		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorized" });
		}
		const removeIndex = post.comments
			.map((comment) => comment.user.toString())
			.indexOf(req.user.id);

		post.comments.splice(removeIndex, 1);
		await post.save();
		res.json({ msg: "Comment removed" });
	} catch (error) {
		console.error(error.message);
		if (error.kind === "ObjectId") {
			return res.status(404).json({ msg: "Comment not found" });
		}
		res.status(500).send("Server Error");
	}
});

module.exports = router;
