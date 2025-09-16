import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosinstance from "../../utils/axiosinstance";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState(null);

  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      seterror("Please enter a valid email address.");
      return;
    }
    if (!password) {
      seterror("Please enter the password");
      return;
    }
    seterror("");

    try {
      const response = await axiosinstance.post("/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        seterror(error.response.data.message);
      } else {
        seterror("An unexpected error occured, Please try again");
      }
    }
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40" />
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2" />

      <div className="container h-screen flex flex-col md:flex-row items-center justify-center px-4 sm:px-10 md:px-20 mx-auto gap-6">
        {/* Left Image Section */}
        <div className="w-full md:w-2/4 h-48 sm:h-64 md:h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-6 sm:p-10 z-50">
          <div>
            <h4 className="text-2xl sm:text-3xl md:text-5xl text-white font-semibold leading-tight md:leading-[58px]">
              Capture Your <br /> Journeys
            </h4>
            <p className="text-sm md:text-[15px] text-white leading-6 pr-3 md:pr-7 mt-4">
              Record your travel experience and memories in your personal travel
              journal.
            </p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-2/4 bg-white rounded-lg md:rounded-r-lg relative p-6 sm:p-10 md:p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handlelogin}>
            <h4 className="text-xl md:text-2xl font-semibold mb-7">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={({ target }) => {
                setemail(target.value);
              }}
            />
            <PasswordInput
              value={password}
              onChange={({ target }) => {
                setpassword(target.value);
              }}
            />
            {error && <p className="text-red-500 text-center my-4">{error}</p>}
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
            <p className="text-xs text-slate-500 text-center my-4">Or</p>
            <button
              type="button"
              className="btn-primary btn-light w-full"
              onClick={() => {
                navigate("/");
              }}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
