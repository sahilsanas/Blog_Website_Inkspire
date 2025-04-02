import { useState, useEffect } from "react";
import { TfiEmail } from "react-icons/tfi";
import { CiLock } from "react-icons/ci";
import { TiUser } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import {
  checkifverify,
  sendmail,
  checkotpv
} from "../helpers/index"
import "./Auth.css"; // Add this for the custom CSS

function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [otpv, cotpv] = useState("");
  const [vo, svo] = useState(false);
  const [cs, scs] = useState("");
  const [isFlipping, setIsFlipping] = useState(false);
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
      setIsFlipping(true);
      setTimeout(() => {
        setState(newState);
        setError("");
        setIsFlipping(false);
      }, 400); // Half of animation duration
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

        }
        else if (
          data.msg === 'ne'
        ) {
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

  const checkotp = async () => {
    try {
      var temail = email.toLowerCase()
      const data = await checkotpv(temail, otpv);
    } catch (error) {
      setError('An Error Occurred')
      // console.log("cannot verify otp")
    }
  }

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
    <div className="container">
      <div className={`auth-card ${isFlipping ? 'flipping' : ''}`}>
        <div className="auth-header">
          <div className="logo-container">
            <img src="/sp.gif" alt="Logo" className="logo" />
          </div>
          <h2 className="auth-title">{state}</h2>
        </div>
        
        <div className="tab-container">
          <span 
            className={`tab ${state === "Log In" ? 'active' : ''}`}
            onClick={() => toggleState("Log In")}
          >
            Log In
          </span>
          <span 
            className={`tab ${state === "Sign Up" ? 'active' : ''}`}
            onClick={() => toggleState("Sign Up")}
          >
            Sign Up
          </span>
        </div>
        
        <div className="auth-content">
          {state === "Log In" ? (
            <div>
              <button
                onClick={() => signUpWithGoogle()}
                className="social-button"
              >
                Sign In with Google
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => signUpWithGoogle()}
                className="social-button"
              >
                Sign Up with Google
              </button>
            </div>
          )}
          
          <div className="divider">
            <span className="divider-text">OR</span>
          </div>
          
          <form className="auth-form">
            {state === "Sign Up" && (
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
            )}
            
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
          
          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="success-message">
              <span>{success}</span>
            </div>
          )}
          
          {state === "Sign Up" ? (
            <div className="tos-text">
              By signing up, you agree to our <span className="highlight">terms of service</span> and
              <span className="highlight"> privacy policy</span>. No credit card required.
            </div>
          ) : (
            <div className="forgot-password">
              <Link to="/resetPassword">Don't remember your password?</Link>
            </div>
          )}
          
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
                {state === "Sign Up" ? "SIGN UP FOR FREE" : "LOG IN"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;