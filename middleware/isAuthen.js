const jwt = require("jsonwebtoken");

const isAuthen = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  console.log(token)

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, `${process.env.secretKey}`);
    req.user = decoded;
    console.log(req.user);
  } catch (err) {
    
    return res.status(401).send("Invalid Token");
  }
  next();
};

module.exports = isAuthen;
