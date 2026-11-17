import { Link } from "react-router";
import Icon, { type IconName } from "./Icon";
export default function EmptyState({
  icon,
  title,
  description,
  to = "/products",
  action = "Explorer le catalogue",
  children,
}: {
  icon: IconName;
  title: string;
  description: string;
  to?: string;
  action?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="state-icon">
        <Icon name={icon} />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
      <Link className="btn" to={to}>
        {action}
        <Icon name="arrow" />
      </Link>
    </div>
  );
}
