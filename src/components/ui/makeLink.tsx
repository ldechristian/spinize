import { FontAwesomeIcon, type FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export function makeLink(
  href: string, 
  label: string, 
  icon: FontAwesomeIconProps['icon'], 
  currentPath: string, 
  onSmallSize: boolean = true
) {
  // Adjust the href to include '/app' if necessary
  const adjustedHref = `/app/${href}`;

  return (
    <Link
      to={adjustedHref}
      className={`flex flex-col justify-center items-center ${onSmallSize ? "" : "hidden md:flex"}`}
    >
      <p
        className={`text-md md:text-lg xl:text-xl font-bold px-4 md:px-2 xl:px- rounded-md w-fit transition-all duration-200
          ${currentPath === href && 'bg-600'}`}
      >
        <FontAwesomeIcon icon={icon} />
      </p>
      <small>{label}</small>
    </Link>
  );
}
