import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsDownload, BsHeartFill, BsThreeDotsVertical } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { RWebShare } from "react-web-share";
import { decreastLike, deletelikes, likes, increaseLike, bookmark, deletebookmark, deletepost, checkbookmark, checklikes } from "../../../helpers";
import { CiBookmark, CiHeart } from "react-icons/ci";
import { BsFillBookmarkFill } from "react-icons/bs";

function PostCard({ post, type }) {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const notify = (notice) => toast({ notice });
  const [book, setbook] = React.useState(false);
  const [heart, setheart] = useState(false);
  const [menus, showmenu] = React.useState(false);
  const [sbook, setsbook] = React.useState(true);
  const [sbook2, setsbook2] = React.useState(true);
  
  const utcTimeString = (post && post.createdAt) ? post.createdAt : "N/A";
  const date = new Date(utcTimeString);
  const localTimeString = date.toLocaleDateString();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    x();
  }, []);
  
  const x = async () => {
    try {
      const checkbook = await checkbookmark(post._id, user.id);
      if (checkbook.msg === "ok") {
        setbook(true);
        setsbook(true);
        setsbook2(false);
      }
      else {
        setsbook(false);
      }
      const checklike = await checklikes(post._id, user.id);
      if (checklike.msg === "ok") {
        setheart(true);
      }
    } catch (error) {
      // console.log(error);
    }
  }
  
  const navigateToArticle = () => {
    navigate(`/article/${post._id}`);
  }
  
  const handleDown = () => {
    navigate(`/article/${post._id}`);
  }
  
  const handleheart = async () => {
    try {
      await increaseLike(post._id);
      await addheart();
      user.likes.push(post._id);
      dispatch({ type: "LIKE", payload: user.likes });
      return;
    } catch (error) {
      alert("ERROR on likening");
      return;
    }
  }
  
  const editposts = async () => {
    navigate(`/edit/${post._id}`);
  }
  
  const addheart = async () => {
    try {
      const data = await likes(
        post._id,
        user.id
      )
      if (data.msg === "exists") {
        setheart(true);
        notify("Liked already");
      }
      else if (
        data.msg === "ok"
      ) {
        notify("liked");
        setheart(true);
      }
      else {
        notify("An Error Occurred while likening");
      }
    } catch (error) {
    }
  }
  
  const handleheartfalse = async () => {
    try {
      await decreastLike(post._id);
      await removeheart();
      setheart(false);
      return;
    } catch (error) {
      alert("ERROR on likening");
      return;
    }
  }
  
  const removeheart = async () => {
    try {
      const data = await deletelikes(
        post._id,
        user.id
      )
      if (data.msg === 'deleted') {
        // Success
      }
      else {
        alert("ERROR OCCURRED");
      }
    } catch (error) {
      // console.log("ERROR REMOVING likes");
    }
  }
  
  const setbookmark = async () => {
    try {
      const data = await bookmark(
        post._id,
        user.id
      )
      if (data.msg === "exists") {
        notify("Bookmark Already Added");
      }
      else if (
        data.msg === "ok"
      ) {
        notify("Bookmark Added");
      }
      else {
        notify("An Error Occurred while Adding Bookmark");
      }
      setbook(true);
      setsbook(true);
      setsbook2(false);
    } catch (error) {
      notify("Error adding bookmark");
    }
  }
  
  const dellbookmarl = async () => {
    try {
      const data = await deletebookmark(
        post._id,
        user.id
      )
      if (data.msg === 'deleted') {
        setbook(false);
        setsbook(false);
      }
      else {
        setsbook(false);
        alert("Does not exists");
        return;
      }
      setsbook2(true);
    } catch (error) {
      // console.log("ERROR REMOVING BOOKMARK");
    }
  }

  const deleteposts = async (postid) => {
    try {
      const data = await deletepost(postid, user.id);
      window.location.reload();
    } catch (error) {
      // console.log("error in deleting");
    }
  }
  
  return (
    <div className="item" style={{
      backgroundColor: '#121212',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
      margin: '16px 0',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    }}>
      {/* Image at the top */}
      <div className="post-image" style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
        <img 
          src={post && post.image ? post.image : ""} 
          alt="" 
          onClick={handleDown} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} 
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        />
      </div>
      
      {/* Content section */}
      <div className="post-content" style={{ padding: '16px' }}>
        {/* Title */}
        <h3 
          onClick={navigateToArticle} 
          style={{ 
            color: '#ffffff', 
            fontSize: '20px', 
            fontWeight: '600', 
            margin: '0 0 12px 0',
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.color = '#3d9df8'} 
          onMouseOut={(e) => e.target.style.color = '#ffffff'}
        >
          {post && post.title}
        </h3>
        
        {/* Stats section (likes and views) */}
        <div className="post-stats" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '12px',
          color: '#9e9e9e',
          fontSize: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="#9e9e9e" width="16px" height="16px" viewBox="-3.5 0 32 32" version="1.1" style={{ marginRight: '4px' }}>
              <path d="M12.406 13.844c1.188 0 2.156 0.969 2.156 2.156s-0.969 2.125-2.156 2.125-2.125-0.938-2.125-2.125 0.938-2.156 2.125-2.156zM12.406 8.531c7.063 0 12.156 6.625 12.156 6.625 0.344 0.438 0.344 1.219 0 1.656 0 0-5.094 6.625-12.156 6.625s-12.156-6.625-12.156-6.625c-0.344-0.438-0.344-1.219 0-1.656 0 0 5.094-6.625 12.156-6.625zM12.406 21.344c2.938 0 5.344-2.406 5.344-5.344s-2.406-5.344-5.344-5.344-5.344 2.406-5.344 5.344 2.406 5.344 5.344 5.344z" />
            </svg>
            {post && post.views}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BsHeartFill color="#9e9e9e" size={14} style={{ marginRight: '4px' }} />
            {post && post.likes ? post.likes : 0}
          </div>
        </div>
        
        {/* User info and actions row */}
        <div className="post-footer" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderTop: '1px solid #333',
          paddingTop: '12px'
        }}>
          {/* User info */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!user ? (
              <Link to={`/auth`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    display: 'block', 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    overflow: 'hidden', 
                    border: '2px solid #3d9df8',
                    marginRight: '8px'
                  }}>
                    <img src={post && post.user ? post.user?.picture : ""} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                      {(post && post.user && post.user.name) ? post.user.name : "N/A"}
                    </span>
                    <span style={{ fontSize: '12px', color: '#9e9e9e' }}>{localTimeString}</span>
                  </div>
                </div>
              </Link>
            ) : (
              <Link to={`/ProfileRedirect/${post && post.user && post.user._id ? post.user._id : -1}`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    display: 'block', 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    overflow: 'hidden', 
                    border: '2px solid #3d9df8',
                    marginRight: '8px'
                  }}>
                    <img src={post && post.user ? post.user?.picture : ""} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                      {(post && post.user && post.user.name) ? post.user.name : "N/A"}
                    </span>
                    <span style={{ fontSize: '12px', color: '#9e9e9e' }}>{localTimeString}</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
          
          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Like button */}
            <span style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }} 
              onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'} 
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            > 
              {!heart ? (
                <CiHeart size={22} color="#e0e0e0" onClick={() => { if (!user) { navigate("/auth") } else handleheart() }} />
              ) : (
                <svg onClick={() => { if (!user) { navigate("/auth") } else handleheartfalse() }} width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z" fill="#ff00f7"></path>
                </svg>
              )}
            </span>
            
            {/* Bookmark button - only show for main and profile_bookmark types */}
            {(type === "main" || type === "profile_bookmark") && (
              <span style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }} 
                onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'} 
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                {(type === "main" && sbook2) || (type === "profile_bookmark" && !sbook) ? (
                  <CiBookmark size={22} color="#e0e0e0" onClick={() => {
                    if (!user) { navigate("/auth") } else { 
                      setbookmark(); 
                      if (type === "main") setsbook2(false);
                    }
                  }} />
                ) : (
                  <BsFillBookmarkFill size={22} color="#3d9df8" onClick={() => { 
                    if (!user) { navigate("/auth") } else {
                      dellbookmarl(); 
                      if (type === "main") setsbook2(true);
                    }
                  }} />
                )}
              </span>
            )}
            
            {/* Share menu */}
            <span className="flex" style={{ position: 'relative' }}>
              <BsThreeDotsVertical 
                size={22} 
                color="#e0e0e0"
                onMouseLeave={() => { showmenu(false) }} 
                onMouseOver={() => { showmenu(true); }} 
                style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
              />
              
              <span 
                className={menus ? 'menus2' : `hidden`} 
                onMouseOver={() => { showmenu(true); }}
                onMouseLeave={() => { showmenu(false) }}
                style={{ 
                  position: 'absolute', 
                  right: '0', 
                  top: '100%', 
                  backgroundColor: '#1e1e1e', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)', 
                  padding: '8px 0', 
                  zIndex: '10',
                  display: menus ? 'block' : 'none'
                }}
              >
                <RWebShare
                  data={{
                    text: "ALL BLOGS",
                    url: `article/` + `${post && post._id ? post._id : -1}`,
                    title: `${post && post.title}`,
                  }}
                  onClick={() => console.log("shared successfully!")}
                >
                  <span 
                    style={{ 
                      display: "flex", 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '8px 16px', 
                      color: '#e0e0e0',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#333'} 
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M14 6C14 3.79086 15.7909 2 18 2C20.2091 2 22 3.79086 22 6C22 8.20914 20.2091 10 18 10C16.7961 10 15.7164 9.46813 14.9831 8.62655L9.91209 11.1621C9.96969 11.4323 10 11.7126 10 12C10 12.2874 9.96969 12.5678 9.91208 12.838L14.9831 15.3735C14.9831 15.3735 16.7961 14 18 14C20.2091 14 22 15.7909 22 18C22 20.2091 20.2091 22 18 22C15.7909 22 14 20.2091 14 18C14 17.7126 14.0303 17.4322 14.0879 17.162L9.01694 14.6265C8.28363 15.4681 7.20393 16 6 16C3.79086 16 2 14.2091 2 12C2 9.79086 3.79086 8 6 8C7.20395 8 8.28367 8.53191 9.01698 9.37354L14.0879 6.83807C14.0303 6.56781 14 6.28744 14 6Z" fill="#e0e0e0"></path>
                    </svg>
                    Share
                  </span>
                </RWebShare>
              </span>
            </span>
          </div>
        </div>
        
        {/* Admin controls for post owner */}
        {(type && type === "powner") && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #333'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', color: '#4dabf7' }}>
                {post && post.views}
                <svg xmlns="http://www.w3.org/2000/svg" fill="#4dabf7" width="18px" height="18px" viewBox="-3.5 0 32 32" version="1.1" style={{ marginLeft: '4px' }}>
                  <path d="M12.406 13.844c1.188 0 2.156 0.969 2.156 2.156s-0.969 2.125-2.156 2.125-2.125-0.938-2.125-2.125 0.938-2.156 2.125-2.156zM12.406 8.531c7.063 0 12.156 6.625 12.156 6.625 0.344 0.438 0.344 1.219 0 1.656 0 0-5.094 6.625-12.156 6.625s-12.156-6.625-12.156-6.625c-0.344-0.438-0.344-1.219 0-1.656 0 0 5.094-6.625 12.156-6.625zM12.406 21.344c2.938 0 5.344-2.406 5.344-5.344s-2.406-5.344-5.344-5.344-5.344 2.406-5.344 5.344 2.406 5.344 5.344 5.344z" />
                </svg>
              </span>
              <span style={{ color: '#555' }}>|</span>
              <span style={{ display: 'flex', alignItems: 'center', color: '#da77f2' }}>
                {post && post.likes ? post.likes : 0}
                <BsHeartFill color="#da77f2" size={13} style={{ marginLeft: '4px' }} />
              </span>
              <span style={{ color: '#555' }}>|</span>
              <span 
                style={{ color: "#4ade80", cursor: 'pointer' }} 
                onClick={() => editposts(post._id)}
                onMouseOver={(e) => e.target.style.opacity = '0.8'} 
                onMouseOut={(e) => e.target.style.opacity = '1'}
              > 
                Edit
              </span>
              <span style={{ color: '#555' }}>|</span>
              <span 
                onClick={() => deleteposts(post._id)} 
                style={{ color: "#ff6b6b", cursor: 'pointer' }}
                onMouseOver={(e) => e.target.style.opacity = '0.8'} 
                onMouseOut={(e) => e.target.style.opacity = '1'}
              > 
                Delete
              </span>
            </div>
            
            <RWebShare
              data={{
                text: "ALL BLOGS",
                url: `article/` + `${post && post._id ? post._id : -1}`,
                title: `${post && post.title ? post.title : "N/A"}`,
              }}
            >
              <span style={{ 
                backgroundColor: '#2563eb', 
                color: 'white', 
                padding: '6px 12px', 
                borderRadius: '4px', 
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'} 
              onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}>
                <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M14 6C14 3.79086 15.7909 2 18 2C20.2091 2 22 3.79086 22 6C22 8.20914 20.2091 10 18 10C16.7961 10 15.7164 9.46813 14.9831 8.62655L9.91209 11.1621C9.96969 11.4323 10 11.7126 10 12C10 12.2874 9.96969 12.5678 9.91208 12.838L14.9831 15.3735C14.9831 15.3735 16.7961 14 18 14C20.2091 14 22 15.7909 22 18C22 20.2091 20.2091 22 18 22C15.7909 22 14 20.2091 14 18C14 17.7126 14.0303 17.4322 14.0879 17.162L9.01694 14.6265C8.28363 15.4681 7.20393 16 6 16C3.79086 16 2 14.2091 2 12C2 9.79086 3.79086 8 6 8C7.20395 8 8.28367 8.53191 9.01698 9.37354L14.0879 6.83807C14.0303 6.56781 14 6.28744 14 6Z" fill="white"/>
                </svg>
                Share
              </span>
            </RWebShare>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCard;