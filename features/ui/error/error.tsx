import styles from "./error.module.scss";

export default function Error() {
  return (
    <div className={styles.projectError}>
      <div className={styles.projectErrorLeft}>
        <div className={styles.warningCircle}>!</div>
        <p>There was a problem while loading the project data</p>
      </div>
      <div
        className={styles.projectErrorRight}
        onClick={() => window.location.reload()}
      >
        Try again ➜
      </div>
    </div>
  );
}
