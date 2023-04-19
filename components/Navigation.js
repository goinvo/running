import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./Navigation.module.scss";
import cx from "classnames";
import { standardizePageId } from "../utils/format";

export const Navigation = ({ menuData, isMenuOpen, setIsMenuOpen }) => {
  const { asPath } = useRouter();

  return (
    <>
      <div
        className={cx(styles.mobileNavigationBar, {
          [styles.open]: isMenuOpen,
        })}
      >
        <span className={styles.mobileNavigationBarTitle}>GoInvo</span>
        <span className={styles.mobileNavigationBarSubtitle}>Playbook</span>
        <div
          className={cx(styles.hitArea, {
            [styles.open]: isMenuOpen,
          })}
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <span className={styles.hotDog1}></span>
          <span className={styles.hotDog2}></span>
        </div>
      </div>
      <div
        className={cx(styles.navigation, {
          [styles.open]: isMenuOpen,
        })}
      >
        <div className={styles.header}>
          <Link href="/">
            <h1>Running.GoInvo</h1>
            <h2>Playbook 3.0</h2>
          </Link>
        </div>
        <div className={styles.menuContent}>
          {menuData &&
            menuData?.map((item, key) => {
              const fullName = item.name;
              const pageTitle = item.name;

              const url =
                pageTitle.toLowerCase() === "home" ||
                  pageTitle.toLowerCase() === "index"
                  ? "/"
                  : `/${standardizePageId(pageTitle)}`;

              // Don't show the first menu item because we're assuming that
              // it's the home page.
              if (key === 0) {
                return;
              }

              return (
                <div
                  key={item.id}
                  className={cx({
                    [styles.subHeading]: fullName.match(/[0-9].([a-z].) /),
                    [styles.active]: asPath === url,
                  })}
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                >
                  <Link href={url}>
                    {pageTitle.replace(/[0-9].([a-z].)? /, "")}
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
