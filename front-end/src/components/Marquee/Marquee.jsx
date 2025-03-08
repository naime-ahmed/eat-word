import styles from "./Marquee.module.css";

export default function Marquee({
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  children,
  ...props
}) {
  return (
    <div
      {...props}
      className={`${styles.marqueeContainer} ${
        vertical ? styles.vertical : styles.horizontal
      } ${pauseOnHover ? styles.pauseOnHover : ""}`}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`${styles.marqueeItem} ${
              vertical ? styles.marqueeItemVertical : ""
            } ${reverse ? styles.reverse : ""}`}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
