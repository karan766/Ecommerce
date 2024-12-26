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
 
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NjgzNzBiODM2NDk2YzcwMzI4YzBjYSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNDk0NTk0Mn0.StzY3rbyICcbspyYdMDJ_Mh_4ewN24Jgw8t5Dg5wEeQ"
  return token;
};

