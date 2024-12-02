export function isAuth  (req, res, Done)  {
    if (req.user) {
      Done();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  }

  export function sanatizeUser  (user) {
    return {
      id: user.id,
      
      role: user.role,
    }
}