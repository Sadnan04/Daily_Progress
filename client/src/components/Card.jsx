import { classNames } from "../utils/helpers.js";

export default function Card({ children, className = "", padding = "p-6" }) {
  return (
    <div className={classNames("glass", padding, className)}>{children}</div>
  );
}
