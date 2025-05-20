import styles from "./header.module.css";
import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { getUserById, updateOneTimePassword } from "@/method/user";
import { use } from "echarts";
import { getCandidateResponse } from "@/method/report";
import { getApplicationById } from "@/method/application";

const Header = () => {
  const router = useRouter();
  const initials = router.asPath.split("/")[1];
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState([]);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const getCandidateData = async () => {
      if (router.query.id) {
        const application = await getApplicationById(router.query.id);
        const user = await getUserById(application[0].user_id);
        user.email = user.email.substring(0, 15) + "...";
        setUser(user);
      }
    };
    const getData = async () => {
      const user = await getUserById(router.query.id);
      user.email = user.email.substring(0, 15) + "...";
      setUser(user);
    };
    if (initials !== "candidate") getData();
    else getCandidateData();
  }, [router.query.id]);

  const logoutHandler = () => {
    if (initials === "candidate") updateOneTimePassword(router.query.id);
    router.push("/");
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.head}>
        <img src="/image/eye.png" alt="icon" className={styles.icon} />
        <h1 className={styles.title}>HireWatch</h1>
      </div>
      <div
        className={styles.card}
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.imgcontainer}>
          <img
            src="/image/user.png"
            alt="card image"
            className={styles.cardImage}
          />
          <img
            src="/image/hashedin.png"
            alt="card image"
            className={styles.cardImg}
          />
        </div>
      </div>
      {isHovered && (
        <div
          className={styles.hoverBox}
          onMouseEnter={handleHover}
          onMouseLeave={handleMouseLeave}
        >
          <div className={styles.indiv}>
            <div className={styles.ione}>
              <img
                src="/image/user.png"
                alt="Profile Pic"
                className={styles.profilePic}
              />
              <div className={styles.userD}>
                <p className={styles.name}>
                  {user.last_name}, {user.first_name}
                </p>
                <p className={styles.email}>{user.email}</p>
                {/* <button className={styles.editButton}>Edit Profile</button> */}
              </div>
            </div>
            <div className={styles.itwo}>
              <p className={styles.company}>HashedIn</p>
              <div className={styles.iconContainer}>
                <div className={styles.greenCircle}>
                  <svg
                    className={styles.tickIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#FFFFFF"
                      d="M20.7 6.3l-10 10c-.2.2-.4.3-.7.3s-.5-.1-.7-.3l-5-5c-.4-.4-.4-1 0-1.4s1-.4 1.4 0L10 14.6l9.3-9.3c.4-.4 1-.4 1.4 0s.4 1 0 1.4z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className={styles.ithree}>
              <button className={styles.logoutButton} onClick={logoutHandler}>
                <img
                  className={styles.logoutIcon}
                  src="/image/log.svg"
                  alt="Power Off"
                />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
