const jwt = require("jsonwebtoken");

exports.verifyJwtAuth = (req, res, next) => {
  const getAuthfromheader = req.headers.authorization;
  const token = getAuthfromheader.substr(getAuthfromheader.indexOf(" ") + 1);
  console.log(token);
  try {
    const user = jwt.verify(token, process.env.My_SECRET);
    console.log(user);
    next();
  } catch (error) {
    res.clearCookie("token");
    res.json({ status: error });
  }
};
