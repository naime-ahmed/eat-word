import { useNavigate, useRouteError } from "react-router-dom";
import style from "./NotFound.module.css";

const ErrorPage = () => {
  const error = useRouteError();

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    window.location.reload();
  };
  return (
    <div className={style.errorPage}>
      <div>
        <h1>Oops!</h1>

        <p>Sorry, an unexpected error has occurred.</p>

        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <div className={style.buttons}>
          <button onClick={handleGoBack}>
            <i className="fa-solid fa-arrow-left"></i> Go Back
          </button>
          <button onClick={handleRetry}>Retry</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
