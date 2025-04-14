import { useState, useEffect } from "react";
import { TfiEmail } from "react-icons/tfi";
import { CiLock } from "react-icons/ci";
import { TiUser } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { checkifverify, sendmail, checkotpv } from "../helpers/index"
import "./Auth.css"; 

function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [otpv, cotpv] = useState("");
  const [vo, svo] = useState(false);
  const [cs, scs] = useState("");
  const userInfos = {
    email: "",
    password: "",
    name: "",
  };

  const [user, setUser] = useState(userInfos);
  const { email, password, name } = user;

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const toggleState = (newState) => {
    if (state !== newState) {
      setState(newState);
      setError("");
    }
  };

  const handleSubmit = async () => {
    var temail = email.toLowerCase();

    if (state === "Log In") {
      try {
        if (!temail || !password) {
          setError('All fields are required!')
          return;
        }
        const data = await checkifverify(temail);
        if (data.msg === "ok") {
          // Continue with login
        }
        else if (data.msg === 'ne') {
          setError("Please Sign Up First");
          return;
        }
        else {
          setError("Please Sign up and Verify Your Email");
          return;
        }
      } catch (error) {
        // console.log(error);
      }
      logIn();
    } else {
      if (!name || !temail || !password) {
        setError('All fields are required!')
        return;
      }
      if (vo === false) {
        setError('An OTP has been sent to your email for verification')
        const datas = await sendmail(temail, name);
        scs(true);
      }
    }
  };

  const logIn = async () => {
    try {
      var temail = email.toLowerCase()
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          temail,
          password,
        }
      ); 
      setError('')
      setSuccess("Success!")
      setTimeout(() => {
        dispatch({ type: "LOGIN", payload: data });
        Cookies.set("user", JSON.stringify(data), { expires: 15 });
        navigate("/");
      }, 2000);
    } catch (error) {
      // console.log(error)
      setError(error.response.data.message);
    }
  };

  const signUp = async () => {
    try {
      var temail = email.toLowerCase()
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/register`,
        {
          name,
          temail,
          password,
        }
      );

      setError('')
      setSuccess(data.message)
      const { message, ...rest } = data;
      setTimeout(() => {
        dispatch({ type: "LOGIN", payload: rest });
        Cookies.set("user", JSON.stringify(rest), { expires: 15 });
        navigate("/");
      }, 2000);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const verifyOTP = async () => {
    try {
      var temail = email.toLowerCase()
      const data = await checkotpv(temail, otpv);
      if (data.msg === 'ok') {
        setError("OTP Matched");
        signUp();
      }
      else {
        setError("OTP does not match");
      }
    } catch (error) {
      setError("ERROR OCCURRED!");
      // console.log("error in matching")
    }
  }

  const signUpWithGoogle = () => {
    window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, "_self");
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-tabs">
          <div 
            className={`auth-tab ${state === "Log In" ? 'active' : ''}`}
            onClick={() => toggleState("Log In")}
          >
            Log In
          </div>
          <div 
            className={`auth-tab ${state === "Sign Up" ? 'active' : ''}`}
            onClick={() => toggleState("Sign Up")}
          >
            Sign Up
          </div>
          <div className="tab-slider" style={{ 
            transform: state === "Log In" ? 'translateX(0)' : 'translateX(100%)'
          }}></div>
        </div>

        <div className="auth-forms-container">
          <div 
            className="auth-forms-slider"
            style={{ 
              transform: state === "Log In" ? 'translateX(0)' : 'translateX(-50%)'
            }}
          >
            {/* Login Form */}
            <div className="auth-form-panel">
              <div className="logo-container">
                <img src="/sp.gif" alt="Logo" className="logo" />
              </div>
              <h2 className="auth-title">Log In</h2>

              <button
                onClick={() => signUpWithGoogle()}
                className="social-button"
              >
                Sign In with Google
              </button>

              <div className="divider">
                <span className="divider-text">OR</span>
              </div>

              <form className="auth-form">
                <div className="input-group">
                  <span className="input-icon"><TfiEmail /></span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={handleRegisterChange}
                    className="input-field"
                  />
                </div>
                
                <div className="input-group">
                  <span className="input-icon"><CiLock /></span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={handleRegisterChange}
                    className="input-field"
                  />
                </div>
              </form>

              {state === "Log In" && error && (
                <div className="error-message">
                  <span>{error}</span>
                </div>
              )}
              
              {state === "Log In" && success && (
                <div className="success-message">
                  <span>{success}</span>
                </div>
              )}

              <div className="forgot-password">
                <Link to="/resetPassword">Don't remember your password?</Link>
              </div>
              
              <div className="button-container">
                <button
                  onClick={handleSubmit}
                  className="auth-button"
                >
                  LOG IN
                </button>
              </div>
            </div>

            {/* Sign Up Form */}
            <div className="auth-form-panel">
              <div className="logo-container">
                <img src="/sp.gif" alt="Logo" className="logo" />
              </div>
              <h2 className="auth-title">Sign Up</h2>

              <button
                onClick={() => signUpWithGoogle()}
                className="social-button"
              >
                Sign Up with Google
              </button>

              <div className="divider">
                <span className="divider-text">OR</span>
              </div>

              <form className="auth-form">
                <div className="input-group">
                  <span className="input-icon"><TiUser /></span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={name}
                    onChange={handleRegisterChange}
                    className="input-field"
                  />
                </div>
                
                <div className="input-group">
                  <span className="input-icon"><TfiEmail /></span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={handleRegisterChange}
                    className="input-field"
                  />
                </div>
                
                <div className="input-group">
                  <span className="input-icon"><CiLock /></span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={handleRegisterChange}
                    className="input-field"
                  />
                </div>
                
                {cs && state === "Sign Up" && (
                  <div className="input-group">
                    <input
                      type="number"
                      name="OTP"
                      placeholder="Enter OTP"
                      value={otpv}
                      onChange={(e) => cotpv(e.target.value)}
                      className="input-field otp-field"
                    />
                  </div>
                )}
              </form>

              {state === "Sign Up" && error && (
                <div className="error-message">
                  <span>{error}</span>
                </div>
              )}
              
              {state === "Sign Up" && success && (
                <div className="success-message">
                  <span>{success}</span>
                </div>
              )}

              <div className="tos-text">
                By signing up, you agree to our <span className="highlight">terms of service</span> and
                <span className="highlight"> privacy policy</span>. No credit card required.
              </div>
              
              <div className="button-container">
                {cs && state === "Sign Up" ? (
                  <button
                    onClick={verifyOTP}
                    className="auth-button"
                  >
                    Verify OTP
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="auth-button"
                  >
                    SIGN UP FOR FREE
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;