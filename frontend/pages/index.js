import styles from "../styles/login.module.css";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "@/method/auth";
import { getUserByEmail } from "@/method/user";
import { useRouter } from "next/router";
import { setCookie } from "@/utils/cookies";

const Home = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = await getUserByEmail(email, password);
    sessionStorage.setItem("reloadCount", 1);

    if (email.trim() == "" || password.trim() == "") {
      toast.error("Enter the required credentials", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 3000,
      });
    }
    else if (user.status == 200) {
      if (user.data.role_id === 1) {
        router.push(`/hr/dashboard?id=${user.data.id}`);
      } else if (user.data.role_id === 2) {
        router.push(`/leader/view_test?id=${user.data.id}`);
      } else {
        router.push(`/candidate/instructions?id=${router.query.id}`);
      }
      toast.success("User Logged in Successfully", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 3000,
      });
    } else {
      toast.error("Invalid email or password", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 3000,
      });
    }
  };
  return (
    <>
      <div className={styles.cntr}>
        <div className={styles.left}>
          <img src="/image/Hirewatch.png" className={styles.logo_image} />
          <img src="/image/loginimg.png" className={styles.new_image} />
        </div>
        <div className={styles.right}>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className={styles.text}>Email</div>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
            />
            <div className={styles.text}>Password</div>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
            />
            <Link href="/">
              <button className={styles.fpButton} type="button">
                Forgot password?
              </button>
            </Link>
            <button className={styles.LoginButton} type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
