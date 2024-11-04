"use client";

import styles from "./main.module.scss";
import GitHubIcon from "@mui/icons-material/GitHub";

const Home = () => {
  return (
    <div className={styles["home-wrap"]}>
      <div className={styles["welcome-title"]}>
        Welcome to My BLOG!
        <div className={styles["go-git-hub"]}>
          <a href="https://github.com/HDomi" target="_blank">
            <GitHubIcon /> Go Github
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
