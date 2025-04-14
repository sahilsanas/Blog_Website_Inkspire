import { TfiWrite } from "react-icons/tfi";
import { RiShieldUserLine } from "react-icons/ri";
import { ImMenu } from "react-icons/im";
import { GiSplitCross } from "react-icons/gi";
import { BsSearch, BsPencilSquare } from "react-icons/bs";

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Cookies from "js-cookie";

import { useState } from "react";
import axios from "axios";
import { clearCookie } from "../helpers";
import { useMediaQuery } from "react-responsive";
import {
  searchresult
} from "../helpers/index";
function Navbar({ postpage }) {
  const view1 = useMediaQuery({ query: "(max-width: 564px)" });
  const view2 = useMediaQuery({ query: "(max-width: 420px)" });
  const view3 = useMediaQuery({ query: "(max-width: 825px)" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchsel, setsearchsel] = useState(true);
  const [sres, searchf] = useState([]);
  const [ssw, cssw] = useState(false)
  const [scontent, cscontent] = useState("")

  const navigateToHome = () => {
    navigate("/");
  };
  const onsearchc = async () => {
    try {
      if (scontent === "") {
        return;
      }
      const data = await searchresult(scontent)
      if (data.msg == []) {
        return;
      }
      searchf(data.msg);
    } catch (error) {
      // console.log("error in search result");
    }
  }
  const { user } = useSelector((state) => ({ ...state }));
  const handleLoad = () => {
    if (user === null || user === undefined) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/login/success`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("Authentication Failed!");
        })
        .then((resObject) => {
          dispatch({ type: "LOGIN", payload: resObject.user });
          Cookies.set("user", JSON.stringify(resObject.user), {
            expires: 15,
          });
        })
        .catch((err) => {
          // console.log(err);
        });
    }
  };

  const logoutFunction = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/logout`, { withCredentials: true }
      );
      if (data) {
        Cookies.set("user", "");
        Cookies.remove("sessionId");
        clearCookie("sessionId");
        dispatch({
          type: "LOGOUT",
        });
      }
    } catch (error) {
      // console.log("error", error);
    }
  };
  const select_action = async () => {
    setsearchsel((prev) => !prev);
  };

  return (
    <nav className="navbar" style={{
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      padding: "8px 16px",
      position: "sticky",
      top: "0",
      backgroundColor: "#1a1a1a", // Dark background
      zIndex: "50",
      color: "#ffffff" // White text for dark theme
    }}>
      {ssw ?
        <div className="btnsrch" onClick={() => { cssw(false); }} style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0,0,0,0.5)", // Darker overlay
          zIndex: "40"
        }}>
        </div>
        :
        <></>}
      <div className="rocket" onClick={() => navigateToHome()} style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "transform 0.2s ease"
      }} onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
         onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}>
        <div className="img" style={{
          width: "36px",
          height: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <img src="/OIG.svg" alt="HOME" style={{
            maxWidth: "100%",
            maxHeight: "100%"
          }} />
        </div>
        <span style={{ 
          color: "#61dafb", // Bright blue for contrast
          fontWeight: "600",
          fontSize: "20px",
          letterSpacing: "1px",
          fontFamily: "'Montserrat', sans-serif", // Changed font
          textShadow: "0 0 8px rgba(97, 218, 251, 0.5)" // Subtle glow effect
        }}>InkSpire</span>
      </div>
      <div className="search" style={{display:`${view3?"none":""}`, position: "relative"}}>
        <div className="search_wrap">
          <input 
            className="inputnav" 
            onClick={() => { cssw(true) }} 
            onChange={(e) => { cscontent(e.target.value); cssw(true); onsearchc() }} 
            type="text" 
            name="" 
            value={scontent} 
            id="" 
            placeholder="Search..." 
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "1px solid #444",
              width: "100%",
              backgroundColor: "#2a2a2a", // Dark input
              color: "#ffffff", // White text
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              outline: "none",
              transition: "all 0.3s ease"
            }}
            onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px rgba(97, 218, 251, 0.4)"}
            onBlur={(e) => e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)"}
          />
          {ssw ?
            <div className="search-result" style={{
              position: "absolute",
              top: "100%",
              left: "0",
              right: "0",
              backgroundColor: "#2a2a2a", // Dark results background
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              borderRadius: "8px",
              marginTop: "8px",
              maxHeight: "300px",
              overflowY: "auto",
              zIndex: "100"
            }}>
              <ul className="search-list" style={{
                listStyle: "none",
                padding: "0",
                margin: "0"
              }}>
                {sres.map((i, index) => {
                  return (
                    <li key={index} className="lis-item noun" style={{
                      padding: "10px 15px",
                      borderBottom: "1px solid #444",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      transition: "background-color 0.2s ease",
                      cursor: "pointer"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#3a3a3a"} // Darker hover
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      {user ?
                        <>
                          <img 
                            className="imgscp" 
                            src={i.pic} 
                            alt="" 
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "1px solid #444" // Border for dark theme
                            }}
                          />
                          <Link className="noun" to={`/ProfileRedirect/${i.id}`} style={{textDecoration: "none"}}>
                            <p className="blackclr" style={{margin: "0", color: "#e0e0e0", fontWeight: "500"}}>
                              {i.name}
                            </p>
                          </Link>
                        </>
                        :
                        <>
                          <img 
                            className="imgscp" 
                            src={i.pic} 
                            alt="" 
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "1px solid #444" // Border for dark theme
                            }}
                          />
                          <Link className="noun" to={`/auth`} style={{textDecoration: "none"}}>
                            <p className="blackclr" style={{margin: "0", color: "#e0e0e0", fontWeight: "500"}}>
                              {i.name}
                            </p>
                          </Link>
                        </>
                      }
                    </li>
                  )
                })}
                <li className="lis-item">
                </li>
              </ul>
            </div>
            : <></>
          }
        </div>
        <div className="imagesearch" onClick={() => { cssw(true); onsearchc() }} style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px",
          cursor: "pointer",
          color: "#aaa", // Light gray for icons
          backgroundColor: "#2a2a2a", // Button background
          borderRadius: "50%", // Circular background
          marginLeft: "8px",
          transition: "all 0.2s ease"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = "#61dafb";
          e.currentTarget.style.backgroundColor = "#333"; 
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = "#aaa";
          e.currentTarget.style.backgroundColor = "#2a2a2a";
        }}>
          <BsSearch size={view1 ? 15 : 20} />
          {view2 ? (
            <div className="searchsel" onClick={select_action} style={{
              backgroundColor: "#2a2a2a",
              borderRadius: "50%",
              padding: "4px",
              marginLeft: "8px"
            }}>
              {searchsel ? <ImMenu size={22} /> : <GiSplitCross size={22} />}
            </div>
          ) : null}
        </div>
      </div>
      {user ? (
        <div className="links write2 for-mid-screen2" style={{ 
          marginRight: '20px',
          display: "flex",
          alignItems: "center",
          gap: "16px"
        }}>
          <Link
            className={view1 ? "write extra" : "write"}
            to="/write"
            style={{ 
              visibility: `${postpage && "hidden"}`, 
              display: "flex", 
              alignItems: 'center', 
              gap: '4px',
              backgroundColor: "#61dafb", // Bright blue button
              color: "#000", // Black text for contrast
              padding: "8px 16px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "500",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#4dc4f8";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(97, 218, 251, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#61dafb";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <BsPencilSquare className="pencill" style={{ marginBottom: '-2px' }} />
            <span>Add</span>
          </Link>
          <Link className="user" to="/profile" style={{
            textDecoration: "none"
          }}>
            <div className="user_image" style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid #333", // Dark border
              backgroundColor: "#2a2a2a", // Background for avatar
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#61dafb";
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 0 0 2px rgba(97, 218, 251, 0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#333";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}>
              <img 
                src={user.picture} 
                alt="" 
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>
          </Link>
          <Link
            to=""
            className={view1 ? "logout extra" : "logout"}
            onClick={logoutFunction}
            style={{ 
              marginTop: '-2px',
              color: "#aaa", // Light gray text
              fontWeight: "500",
              textDecoration: "none",
              backgroundColor: "#2a2a2a", // Button background
              padding: "6px 12px",
              borderRadius: "4px",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.backgroundColor = "#333";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#aaa";
              e.currentTarget.style.backgroundColor = "#2a2a2a";
            }}
          >
            Log Out
          </Link>
        </div>
      ) : (
        <div style={{ 
          marginRight: '20px',
          display: "flex",
          alignItems: "center"
        }} className="for-mid-screen">
          <div className="links" style={{ gap: '20px', display: "flex", alignItems: "center" }}>
            <Link 
              className="add-button" 
              to="/auth" 
              style={{ 
                display: "flex", 
                alignItems: 'center', 
                gap: '4px',
                backgroundColor: "#61dafb", // Bright blue button
                color: "#000", // Black text for contrast
                padding: "8px 16px",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "500",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#4dc4f8";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(97, 218, 251, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#61dafb";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <BsPencilSquare className="BsPencilSquare" style={{ marginBottom: '-2px' }} />
              <span>Add</span>
            </Link>
            <Link 
              to="/auth" 
              className="logout" 
              style={{ 
                marginTop: '-2px',
                color: "#aaa", // Light gray text
                fontWeight: "500",
                textDecoration: "none",
                backgroundColor: "#2a2a2a", // Button background
                padding: "6px 12px",
                borderRadius: "4px",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.backgroundColor = "#333";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "#aaa";
                e.currentTarget.style.backgroundColor = "#2a2a2a";
              }}
            >
              SignUp | LogIn
            </Link>
          </div>
        </div>
      )}
      {view2 && (
        <div className={!searchsel ? "sidebar" : "sidebar2"} style={{
          position: "fixed",
          top: "0",
          right: !searchsel ? "0" : "-100%",
          width: "240px",
          height: "100vh",
          backgroundColor: "#1a1a1a", // Dark background
          boxShadow: "-4px 0 12px rgba(0,0,0,0.3)",
          zIndex: "1000",
          transition: "right 0.3s ease",
          padding: "20px",
          color: "#ffffff" // White text
        }}>
          {/* Sidebar content remains the same but with dark styling */}
        </div>
      )}
    </nav>
  );
}

export default Navbar;