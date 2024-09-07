import { Link, useRouteError } from "react-router-dom";
import style from "./NotFound.module.css";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className={style.errorPage}>
      <div>
        <h1>Oops!</h1>

        <p>Sorry, an unexpected error has occurred.</p>

        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <p>
          Go back to <Link to="/">Home</Link>
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
