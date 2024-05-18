import { Link } from "react-router-dom";
import { headerLinks } from "@/constant";
import { useLocation } from "react-router-dom";

const NavItems = () => {
  let location = useLocation();
  return (
    <ul className="flex flex-col gap-5 items-start md:items-center md:justify-between w-full md:flex-row">
      {headerLinks.map((link) => {
        const isActive = location.pathname === link.route;

        return (
          <li
            key={link.route}
            className={`${
              isActive && "text-purple-700/95"
            } flex items-center justify-center font-medium text-xl whitespace-nowrap`}
          >
            <Link to={link.route}>{link.label} </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
