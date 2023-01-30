import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./Navigation.module.scss";
import cx from "classnames";

export const Navigation = ({ menuData }) => {
  const { asPath } = useRouter();

  return (
    <div className={styles.navigation}>
      <h1>GoInvo</h1>
      <h2>Playbook</h2>
      {menuData &&
        menuData?.map((item) => {
          const fullName = item.name;
          const parsedName = item.name.replace(/[0-9].([a-z].)? /, "").trim();

          const url =
            parsedName.toLowerCase() === "home" ||
            parsedName.toLowerCase() === "index"
              ? "/"
              : `/${parsedName.split(" ").join("-").toLowerCase()}`;

          return (
            <div
              key={item.id}
              className={cx({
                [styles.subHeading]: fullName.match(/[0-9].([a-z].) /),
                [styles.active]: asPath === url,
              })}
            >
              <Link href={url}>{parsedName}</Link>
            </div>
          );
        })}
    </div>
  );
};
