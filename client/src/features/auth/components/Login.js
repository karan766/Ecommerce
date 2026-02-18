import { useSelector, useDispatch } from "react-redux";
import { selectAuthError, selectLoggedInUser, resetUser, resetUserError , loginUserAsync} from "../authSlice";
import { Link, Navigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { useEffect } from "react";

export default function Login() {
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const user = useSelector(selectLoggedInUser);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(resetUser());
    dispatch(resetUserError());
  }, [dispatch]);

  return (
    <>
      {user && <Navigate to="/" replace={true}></Navigate>}
      <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          <img
            className="mx-auto h-16 w-auto sm:h-20"
            src="../../../logo.png"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-xl font-bold leading-8 tracking-tight text-gray-900 sm:mt-10 sm:text-2xl sm:leading-9">
            Log in to your account
          </h2>
        </div>

        <div className="mt-6 mx-auto w-full max-w-sm sm:mt-10">
          <form
            noValidate
            onSubmit={handleSubmit((data) => {
              dispatch(
                loginUserAsync({ email: data.email, password: data.password })
              );
            })}
            className="space-y-4 sm:space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  {...register("email", {
                    required: "email is required",
                    pattern: {
                      value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                      message: "email not valid",
                    },
                  })}
                  type="email"
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 text-base sm:text-sm sm:leading-6"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-amber-600 hover:text-amber-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  {...register("password", {
                    required: "password is required",
                  })}
                  type="password"
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 text-base sm:text-sm sm:leading-6"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2">
                  {typeof error === 'string' ? error : error.message || 'Login failed'}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-amber-600 px-3 py-2.5 text-base font-semibold leading-6 text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 sm:text-sm sm:py-1.5"
              >
                Log in
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 sm:mt-10">
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-semibold leading-6 text-amber-600 hover:text-amber-500"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
