const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const blog = require("../model/blog");
const comment = require("../model/comment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, path.join(__dirname, `../public/uploads`));
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", { user: req.user });
});
router.get("/:id", async (req, res) => {
  const blogs = await blog.findById(req.params.id).populate("createdBy");
  const comments = await comment.find({blogId:req.params.id}).populate("createdBy");
  res.render("blog", {
    user: req.user,
    blog: blogs,
    comments
  });
});
router.post("/", upload.single("coverImage"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const { title, body } = req.body;
  const blogs = await blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  res.redirect(`blog/${blog._id}`);
});

router.post("/comment/:blogId", async (req, res) => {
  await comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});
module.exports = router;
