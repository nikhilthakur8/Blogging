const express = require("express");
const User = require("../model/user");
const router = express.Router();
router.get("/signin", (req, res) => {
  return res.render("signin");
});
router.get("/signup", (req, res) => {
  return res.render("signup");
});
router.get("/logout",(req,res)=>{
  res.clearCookie("token").redirect("/");
})
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    res.status(404).render("signin", { error });
  }
});
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  const user = await User.create({
    fullName,
    email,
    password,
  });
  console.log(user.fullName);
  return res.redirect("/");
});

module.exports = router;