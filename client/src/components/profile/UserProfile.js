import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Navbar";
import { BeatLoader, PuffLoader } from "react-spinners";
import { getUser } from "../../helpers";
import { Link, useNavigate } from "react-router-dom";
import PostCard from "../home/post/PostCard";
import {
  dataURItoBlob,
  uplaodImages,
  uploadProfilePicture,
  getfollowercount,
  getfollowingcount,
  showbookmarks,
  getallpostdata,
  showmyposts,
  fetchfollowing,
  changeabout,
  getallLikes,
  getallBookmarks,
  showLikemarks
} from "../../helpers";
import InfiniteScroll from "react-infinite-scroll-component";
import Footer from "../footer/Footer";

function UserProfile() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const img_ref = useRef();
  const [image, setimage] = useState("");
  const [about, setAbout] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbPic, setDbPic] = useState("");
  const [folc, setfollc] = useState(0);
  const [folcd, setfollcd] = useState(0);
  const [books, setbooklist] = useState([]);
  const [likedp, setlikedp] = useState([]);
  const [sb, ssb] = useState(false);
  const [sbl, ssbl] = useState(false);
  const [posts, setpostlist] = useState([]);
  const [sp, ssp] = useState(false);
  const [rawDbAbout, setrawDbAbout] = useState("");
  const [view, setview] = useState("");
  const [follow1, setfollow1list] = useState([]);
  const [sf, ssf] = useState(false);
  const [dbAbout, setDbAbout] = useState("");
  const [bookmarkmap, setbookmarkmap] = useState(new Set());

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const myprofile = await getUser(user.id);
        setDbPic(myprofile._doc.picture);
        setrawDbAbout(myprofile._doc.about);
        setDbAbout(myprofile._doc.about);
        setAbout(myprofile._doc.about);
        const data = await getfollowercount(user.id);
        const data2 = await getfollowingcount(user.id);
        setfollcd(data2.data.msg);
        setfollc(data.data.msg);
      } catch (error) {
        // console.log("error in profile", error)
      }
    };
    fetchMyProfile();
  }, []);

  const handlebook = async () => {
    try {
      const data = await showbookmarks(user.id);
      setbooklist(data.data.msg);
    } catch (error) {
      // console.log("error in showbookmarks")
    }
  }

  const handlelike = async () => {
    try {
      const data = await showLikemarks(user.id);
      setlikedp(data.data.msg);
    } catch (error) {
      // console.log(error);
      // console.log("error in hearting fetching")
    }
  }

  const handlefoll = async () => {
    try {
      const data = await fetchfollowing(user.id);
      if (data.msg && data.msg.length > 0) {
        setfollow1list(data.msg)
      }
      else {
        setfollow1list([]);
      }
      ssf(!sf);
    } catch (error) {
      // console.log(error);
      // console.log("error in fetching followers")
    }
  }

  const handleposts = async () => {
    try {
      const data = await showmyposts(user.id);
      setpostlist(data.msg);
      ssp(true);
    }
    catch (err) {
      // console.log(err);
    }
  }

  const handlePhotoChange = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (readerEvent) {
        setimage(readerEvent.target.result);
        setError("");
      };
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!image && !about) {
        return;
      }
      if (!image) {
        const data = await changeabout(about, user.id);
        if (data) {
          // Success
        }
        window.location.reload();
        navigate("/profile")
        return;
      }
      if (!about) {
        setAbout(rawDbAbout)
      }
      if (!image || !about) {
        setError("Add image and tell something about yourself");
        return;
      } else setError("");
      if (about.length > 120) {
        setError("Maximum 120 characters allowed");
        return;
      } else setError("");
      if (image !== "") {
        setLoading(true);
        const path = `${user.name}/profile_image`;
        const img = dataURItoBlob(image);
        let formData = new FormData();
        formData.append("path", path);
        formData.append("file", img);
        const profile_img = await uplaodImages(formData, user.token);
        const data = await uploadProfilePicture(
          profile_img[0].url,
          about,
          user.token
        );
        Cookies.set(
          "user",
          JSON.stringify({
            ...user,
            picture: profile_img[0].url,
            about: data.about,
          })
        );
        dispatch({ type: "UPDATEPICTURE", payload: data });
      }
      window.location.reload();
      navigate("/profile");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  const navigateToArticle = async (id) => {
    try {
      const data = await getallpostdata(id);
      var ooo = data.data.msg
      navigate('/article', { state: { ooo } })
    } catch (error) {
      // console.log("error in linkbook")
    }
  }

  // Refined theme with more subtle color scheme
  const subtleThemeStyles = {
    container: {
      backgroundColor: "#f5f5f7", // Light background
      color: "#333333",
      minHeight: "100vh",
    },
    card: {
      backgroundColor: "#ffffff", // White card background
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      padding: "24px",
      marginBottom: "24px",
      border: "1px solid #e8e8e8",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    profileImage: {
      width: "128px",
      height: "128px",
      objectFit: "cover",
      borderRadius: "50%",
      border: "4px solid #61dafb", // Subtle purple border
      marginBottom: "16px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    profileImagePlaceholder: {
      width: "128px",
      height: "128px",
      borderRadius: "50%",
      backgroundColor: "#e0e0e0", // Light gray placeholder
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "16px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    button: {
      backgroundColor: "#7e57c2", // Subtle purple button
      color: "white",
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      marginBottom: "24px",
      transition: "background-color 0.2s",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      fontWeight: "500",
    },
    buttonHover: {
      backgroundColor: "#9575cd", // Lighter purple on hover
    },
    form: {
      width: "100%",
      maxWidth: "32rem",
    },
    label: {
      display: "block",
      color: "#555555",
      fontWeight: "500",
      marginBottom: "8px",
    },
    textarea: {
      width: "100%",
      padding: "12px",
      border: "1px solid #d0d0d0",
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      color: "#333333",
      outline: "none",
      fontFamily: "inherit",
    },
    textareaFocus: {
      borderColor: "#7e57c2",
      boxShadow: "0 0 0 2px rgba(126, 87, 194, 0.1)",
    },
    aboutText: {
      backgroundColor: "#f9f9f9",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
      color: "#333333",
      lineHeight: "1.5",
    },
    errorText: {
      color: "#d32f2f",
      fontSize: "14px",
      marginTop: "4px",
      display: "block",
    },
    changeButton: {
      color: "#7e57c2",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      marginTop: "8px",
      display: "inline-block",
      fontWeight: "500",
    },
    changeButtonHover: {
      color: "#9575cd",
    },
    statsContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "48px",
      padding: "16px 0",
    },
    statBox: {
      textAlign: "center",
    },
    statNumber: {
      display: "block",
      fontSize: "24px",
      fontWeight: "700",
      color: "#333333",
    },
    statLabel: {
      color: "#757575",
      fontSize: "14px",
      fontWeight: "500",
    },
    contentGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "24px",
      marginBottom: "32px",
    },
    contentCard: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      border: "1px solid #e8e8e8",
    },
    cardHeader: {
      fontSize: "16px",
      fontWeight: "600",
      padding: "16px 24px",
      borderBottom: "1px solid #e8e8e8",
      cursor: "pointer",
      transition: "background-color 0.2s",
      display: "flex",
      alignItems: "center",
      color: "#333333",
    },
    cardHeaderHover: {
      backgroundColor: "#f5f5f7",
    },
    cardIcon: {
      marginRight: "12px",
      color: "#7e57c2",
    },
    cardContent: {
      padding: "16px 24px",
    },
    emptyMessage: {
      color: "#757575",
      textAlign: "center",
      padding: "32px 0",
      fontSize: "15px",
    },
    scrollContent: {
      margin: "0",
    },
    scrollEndMessage: {
      textAlign: "center",
      color: "#757575",
      marginTop: "16px",
      fontSize: "14px",
    },
    userItem: {
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
      transition: "background-color 0.2s",
      borderBottom: "1px solid #f0f0f0",
      borderRadius: "6px",
    },
    userItemHover: {
      backgroundColor: "#f5f5f7",
    },
    userAvatar: {
      width: "40px",
      height: "40px",
      objectFit: "cover",
      borderRadius: "50%",
      border: "1px solid #e0e0e0",
    },
    userName: {
      marginLeft: "12px",
      fontWeight: "500",
      color: "#333333",
    },
    maxWidth: {
      maxWidth: "1024px",
      margin: "0 auto",
      padding: "24px 16px",
    },
    loaderContainer: {
      display: "flex",
      justifyContent: "center",
      padding: "16px 0",
    }
  };

  // Media query styles
  if (window.innerWidth >= 768) {
    subtleThemeStyles.contentGrid.gridTemplateColumns = "repeat(2, 1fr)";
  }

  return (
    <div style={subtleThemeStyles.container}>
      <Navbar />
      <div style={subtleThemeStyles.maxWidth}>
        {/* Profile Header */}
        <div style={subtleThemeStyles.card}>
          <div style={subtleThemeStyles.header}>
            <div style={{ position: "relative", marginBottom: "16px" }}>
              {dbPic ? (
                <img 
                  src={dbPic} 
                  referrerPolicy="no-referrer" 
                  style={subtleThemeStyles.profileImage}
                  alt="Profile"
                />
              ) : image ? (
                <img 
                  src={image} 
                  referrerPolicy="no-referrer" 
                  style={subtleThemeStyles.profileImage}
                  alt="Profile"
                />
              ) : (
                <div style={subtleThemeStyles.profileImagePlaceholder}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "64px", height: "64px", color: "#9e9e9e" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                img_ref.current.click();
                setDbPic("");
              }}
              style={subtleThemeStyles.button}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = subtleThemeStyles.buttonHover.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = subtleThemeStyles.button.backgroundColor}
            >
              Change or Add an Image
            </button>

            <form
              onSubmit={handleSubmit}
              method="post"
              encType="multipart/form-data"
              style={subtleThemeStyles.form}
            >
              <input
                ref={img_ref}
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />
              
              <div style={{ marginBottom: "16px" }}>
                <label style={subtleThemeStyles.label} htmlFor="about">
                  About Me:
                </label>
                {dbAbout ? (
                  <div style={subtleThemeStyles.aboutText}>
                    {dbAbout}
                  </div>
                ) : (
                  <textarea
                    id="about"
                    name="about"
                    rows="5"
                    value={about}
                    placeholder="Write something about yourself..."
                    onChange={(e) => {
                      setAbout(e.target.value);
                      setDbAbout(null);
                    }}
                    style={subtleThemeStyles.textarea}
                    onFocus={(e) => {
                      e.target.style.borderColor = subtleThemeStyles.textareaFocus.borderColor;
                      e.target.style.boxShadow = subtleThemeStyles.textareaFocus.boxShadow;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = subtleThemeStyles.textarea.border.split(" ")[2];
                      e.target.style.boxShadow = "none";
                    }}
                  ></textarea>
                )}
                
                {error && (
                  <div style={subtleThemeStyles.errorText}>
                    {error}
                  </div>
                )}
                
                {dbAbout && (
                  <button 
                    type="button"
                    onClick={() => { setDbAbout(''); setAbout(rawDbAbout) }}
                    style={subtleThemeStyles.changeButton}
                    onMouseOver={(e) => e.currentTarget.style.color = subtleThemeStyles.changeButtonHover.color}
                    onMouseOut={(e) => e.currentTarget.style.color = subtleThemeStyles.changeButton.color}
                  >
                    Change Bio
                  </button>
                )}
              </div>
              
              <button 
                disabled={loading} 
                type="submit"
                style={{
                  ...subtleThemeStyles.button,
                  width: "100%"
                }}
                onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = subtleThemeStyles.buttonHover.backgroundColor)}
                onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = subtleThemeStyles.button.backgroundColor)}
              >
                {loading ? <BeatLoader size={10} color="#ffffff" /> : "Save"}
              </button>
            </form>
          </div>
        </div>

        {/* Profile Stats */}
        <div style={subtleThemeStyles.card}>
          <div style={subtleThemeStyles.statsContainer}>
            <div style={subtleThemeStyles.statBox}>
              <span style={subtleThemeStyles.statNumber}>{folcd}</span>
              <span style={subtleThemeStyles.statLabel}>Following</span>
            </div>
            <div style={subtleThemeStyles.statBox}>
              <span style={subtleThemeStyles.statNumber}>{folc}</span>
              <span style={subtleThemeStyles.statLabel}>Followers</span>
            </div>
          </div>
        </div>

        {/* Profile Content Sections */}
        <div style={subtleThemeStyles.contentGrid}>
          {/* Liked Posts Section */}
          <div style={subtleThemeStyles.contentCard}>
            <div 
              style={subtleThemeStyles.cardHeader}
              onClick={() => { handlelike(); ssbl(true); }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = subtleThemeStyles.cardHeaderHover.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "20px", width: "20px", marginRight: "8px", color: "#7e57c2" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Liked Posts
            </div>
            
            <div style={subtleThemeStyles.cardContent}>
              {sbl ? (
                likedp.length === 0 ? (
                  <div style={subtleThemeStyles.emptyMessage}>No Liked Posts</div>
                ) : (
                  <InfiniteScroll
                    dataLength={1}
                    hasMore={false}
                    loader={
                      <div style={subtleThemeStyles.loaderContainer}>
                        <PuffLoader color="#7e57c2" size={40} />
                      </div>
                    }
                    endMessage={
                      likedp.length > 0 && (
                        <div style={subtleThemeStyles.scrollEndMessage}>
                          No More Liked Posts!
                        </div>
                      )
                    }
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {likedp.map((post, i) => (
                        <PostCard post={post} key={i} type={"profile_bookmark"} />
                      ))}
                    </div>
                  </InfiniteScroll>
                )
              ) : (
                <div style={subtleThemeStyles.emptyMessage}>Click above to show Liked posts</div>
              )}
            </div>
          </div>

          {/* Bookmarks Section */}
          <div style={subtleThemeStyles.contentCard}>
            <div 
              style={subtleThemeStyles.cardHeader}
              onClick={() => { handlebook(); ssb(true); }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = subtleThemeStyles.cardHeaderHover.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "20px", width: "20px", marginRight: "8px", color: "#7e57c2" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Bookmarks
            </div>
            
            <div style={subtleThemeStyles.cardContent}>
              {sb ? (
                !books || books.length === 0 || !books[0]?.user || !books[0]?.user?._id ? (
                  <div style={subtleThemeStyles.emptyMessage}>No Bookmarks</div>
                ) : (
                  <InfiniteScroll
                    dataLength={1}
                    hasMore={false}
                    loader={
                      <div style={subtleThemeStyles.loaderContainer}>
                        <PuffLoader color="#7e57c2" size={40} />
                      </div>
                    }
                    endMessage={
                      books.length > 0 && (
                        <div style={subtleThemeStyles.scrollEndMessage}>
                          No More Bookmarks!
                        </div>
                      )
                    }
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {books.map((post, i) => {
                        if (!books || !books[0]?.user || !books[0]?.user?._id) {
                          return <div key={i} style={subtleThemeStyles.emptyMessage}>Loading...</div>;
                        } else {
                          return <PostCard post={post} key={i} type={"profile_bookmark"} />;
                        }
                      })}
                    </div>
                  </InfiniteScroll>
                )
              ) : (
                <div style={subtleThemeStyles.emptyMessage}>Click above to show bookmarks</div>
              )}
            </div>
          </div>
          
          {/* Your Posts Section */}
          <div style={subtleThemeStyles.contentCard}>
            <div 
              style={subtleThemeStyles.cardHeader}
              onClick={() => handleposts()}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = subtleThemeStyles.cardHeaderHover.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "20px", width: "20px", marginRight: "8px", color: "#7e57c2" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Your Posts
            </div>
            
            <div style={subtleThemeStyles.cardContent}>
              {sp ? (
                !posts || posts.length === 0 ? (
                  <div style={subtleThemeStyles.emptyMessage}>You have not uploaded any posts!</div>
                ) : (
                  <InfiniteScroll
                    dataLength={1}
                    hasMore={false}
                    loader={
                      <div style={subtleThemeStyles.loaderContainer}>
                        <PuffLoader color="#7e57c2" size={40} />
                      </div>
                    }
                    endMessage={
                      posts.length > 0 && (
                        <div style={subtleThemeStyles.scrollEndMessage}>
                          No More posts!
                        </div>
                      )
                    }
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {posts.map((post, i) => (
                        <PostCard post={post} key={i} type={"powner"} />
                      ))}
                    </div>
                  </InfiniteScroll>
                )
              ) : (
                <div style={subtleThemeStyles.emptyMessage}>Click above to show Your Posts</div>
              )}
            </div>
          </div>
          
          {/* People You Follow Section */}
          <div style={subtleThemeStyles.contentCard}>
            <div 
              style={subtleThemeStyles.cardHeader}
              onClick={() => handlefoll()}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = subtleThemeStyles.cardHeaderHover.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "20px", width: "20px", marginRight: "8px", color: "#7e57c2" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              People You Follow
            </div>
            
            <div style={subtleThemeStyles.cardContent}>
              {sf ? (
                !follow1 || follow1.length === 0 ? (
                  <div style={subtleThemeStyles.emptyMessage}>You are not following anyone</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {follow1.map((dat, index) => (
                      <div key={index} style={subtleThemeStyles.userItem}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = subtleThemeStyles.userItemHover.backgroundColor}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                        <Link to={`/ProfileRedirect/${dat.pid}`} style={{ display: "flex", alignItems: "center", width: "100%", textDecoration: "none" }}>
                          <div style={{ flexShrink: 0 }}>
                            <img 
                              style={subtleThemeStyles.userAvatar} 
                              src={dat.pic} 
                              alt={dat.name} 
                            />
                          </div>
                          <div style={subtleThemeStyles.userName}>{dat.name}</div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div style={subtleThemeStyles.emptyMessage}>Click above to show who you follow</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserProfile;