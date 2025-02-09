import styles from "./Testimonial.module.css";

const Testimonial = ({ name, review, profession, photo, rating }) => {
  const getStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push("full");
      } else if (rating >= i - 0.5) {
        stars.push("half");
      } else {
        stars.push("empty");
      }
    }
    return stars;
  };

  const renderStar = (type, index) => {
    switch (type) {
      case "full":
        return (
          <svg className={styles.star} viewBox="0 0 24 24" fill="#ffd700">
            <path d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 16l-6.18 3.02L7 12.14 2 7.27l6.91-1.01L12 0z" />
          </svg>
        );
      case "half":
        return (
          <svg className={styles.star} viewBox="0 0 24 24">
            <defs>
              <clipPath id={`half-${index}`}>
                <rect x="0" y="0" width="12" height="24" />
              </clipPath>
            </defs>
            <path
              d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 16l-6.18 3.02L7 12.14 2 7.27l6.91-1.01L12 0z"
              fill="#e4e5e9"
            />
            <path
              d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 16l-6.18 3.02L7 12.14 2 7.27l6.91-1.01L12 0z"
              fill="#ffd700"
              clipPath={`url(#half-${index})`}
            />
          </svg>
        );
      case "empty":
        return (
          <svg className={styles.star} viewBox="0 0 24 24" fill="#e4e5e9">
            <path d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 16l-6.18 3.02L7 12.14 2 7.27l6.91-1.01L12 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <figure className={styles.card}>
      <div className={styles.content}>
        <img
          className={styles.avatar}
          width="40"
          height="40"
          alt={name}
          src={photo}
        />
        <div className={styles.userInfo}>
          <figcaption className={styles.name}>{name}</figcaption>
          <p className={styles.username}>{profession}</p>
        </div>
      </div>
      <div className={styles.stars}>
        {getStars(rating).map((type, index) => (
          <span key={index}>{renderStar(type, index)}</span>
        ))}
      </div>
      <blockquote className={styles.quote}>{review}</blockquote>
    </figure>
  );
};

export default Testimonial;
