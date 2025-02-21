import PropTypes from "prop-types";
import { useTurnstile } from "../hooks/useTurnstile";

const TurnstileWidget = (props) => {
  const { containerRef } = useTurnstile({
    onVerify: props.onVerify,
    onError: props.onError,
    onExpire: props.onExpire,
    ...props.options,
  });

  return (
    <div
      ref={containerRef}
      style={props?.style}
      aria-label="Cloudflare Turnstile CAPTCHA"
    />
  );
};

TurnstileWidget.propTypes = {
  onVerify: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onExpire: PropTypes.func,
  options: PropTypes.shape({
    sitekey: PropTypes.string,
    theme: PropTypes.oneOf(["light", "dark", "auto"]),
    action: PropTypes.string,
    cData: PropTypes.string,
    execution: PropTypes.oneOf(["execute", "render"]),
    appearance: PropTypes.oneOf(["always", "execute", "interaction-only"]),
    language: PropTypes.string,
    tabIndex: PropTypes.number,
  }),
  style: PropTypes.object,
};

export default TurnstileWidget;
