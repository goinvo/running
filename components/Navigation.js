import Link from "next/link";
import styles from "./Navigation.module.scss";

export const Navigation = ({ menuData }) => {
  return (
    <div className={styles.navigation}>
      {menuData &&
        menuData?.map((item) => {
          return (
            <div key={item.id}>
              <Link href={`/${item.name.split(" ").join("-").toLowerCase()}`}>
                {item.name}
              </Link>
            </div>
          );
        })}
    </div>
  );
};
