import { useRouteError } from "react-router-dom";

import "./ErrorPage.css";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="errorPage">
      <div>
        <h1>Oops!</h1>

        <p>Sorry, an unexpected error has occurred.</p>

        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
