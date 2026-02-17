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
 
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NjcwOTBjMDQwMTBlMDMxODU5ZDBkOSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM1NzI2MTUzfQ.KnYFOx9YGSwuxpH-4vOPXkN2dPGDDPh9qt0gnuXJUI4"
  return token;
};

