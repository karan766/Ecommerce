import passport from "passport";

export function isAuth  (req, res, Done)  {
   return passport.authenticate('jwt')
  }

  export function sanatizeUser  (user) {
    return {
      id: user.id,
      role: user.role,
    }
}
export const cookieExtracter = function(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"]
  }
  return token;
};

