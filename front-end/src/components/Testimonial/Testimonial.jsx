import styles from "./Testimonial.module.css";

const Testimonial = ({ name, review, profession, image }) => {
  return (
    <figure className={styles.card}>
      <div className={styles.content}>
        <img
          className={styles.avatar}
          width="32"
          height="32"
          alt=""
          src={image}
        />
        <div>
          <figcaption className={styles.name}>{name}</figcaption>
          <p className={styles.username}>{profession}</p>
        </div>
      </div>
      <blockquote className={styles.quote}>{review}</blockquote>
    </figure>
  );
};

export default Testimonial;
