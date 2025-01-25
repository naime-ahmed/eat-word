import { useEffect, useState } from "react";
import Skeleton from "../../ui/loader/Skeleton/Skeleton";
import { getProportionalWidth } from "../utils";
import styles from "./Table.module.css";

const TableSkeletonLoader = () => {
  const [milestoneContentWidth, setMilestoneContentWidth] = useState(1250);

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      const width = getMilestoneContentWidth(viewportWidth);
      setMilestoneContentWidth(width);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const proportionalWidths = getProportionalWidth(milestoneContentWidth);

  return (
    <div className={styles.tableSkeleton}>
      {Array.from({ length: 10 }, (_, i) => (
        <div className={styles.rowSkeleton} key={i}>
          <Skeleton width={proportionalWidths.skeleton1} height={25} />
          <Skeleton width={proportionalWidths.skeleton2} height={25} />
          <Skeleton width={proportionalWidths.skeleton3} height={25} />
          <Skeleton width={proportionalWidths.skeleton4} height={25} />
          <Skeleton width={proportionalWidths.skeleton5} height={25} />
        </div>
      ))}
    </div>
  );
};

const getMilestoneContentWidth = (viewportWidth) => {
  if (viewportWidth >= 1200 && viewportWidth <= 1400) {
    return 1150;
  } else if (viewportWidth >= 1000 && viewportWidth < 1200) {
    return 950;
  } else {
    return 1250;
  }
};

export default TableSkeletonLoader;
