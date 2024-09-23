import styles from "./layout.module.scss";
import { menuItems } from "@/constants/menuItems";
import Link from "next/link";

const Header = ({}) => {
  return (
    <header className={styles["header-wrap"]}>
      <Link href="/" className={styles["logo-wrap"]}>
        <p className="logo">Domi's Blog</p>
      </Link>
      <div className={styles["nav-wrap"]}>
        {menuItems.map((item) => {
          return (
            <div className={styles["nav-item"]}>
              <Link href={item.link}>{item.name}</Link>
            </div>
          );
        })}
      </div>
    </header>
  );
};
export default Header;
