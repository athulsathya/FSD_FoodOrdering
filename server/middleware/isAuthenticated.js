export const isAuthenticated = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({
        success: false,
        message: "Token is missing or invalid",
      });
    }
    const token = authHeader.split(" ")[1];
   

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Access Token has Expired",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Access Token is Missing or Invalid",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    req.id = user._id;

    next();
  } catch (error) {}
};
