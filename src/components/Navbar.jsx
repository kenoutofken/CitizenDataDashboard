import {
  Bars3Icon,
  HomeIcon,
  MapIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router";

export function Navbar() {
  return (
    <>
      <div className="mx-12 mt-12 p-0">
        <div className="flex">
          <ul className="menu menu-horizontal grid grid-cols-1 sm:grid-cols-3 px-0 py-0 my-0">
            <li>
              <NavLink
                className="border-b-4 border-primary flex justify-center items-center rounded-none w-full h-full py-8 px-20"
                to="/"
              >
                <MapIcon className="h-6 w-6 inline-block mr-2" />
                By Region
              </NavLink>
            </li>
            <li>
              <NavLink
                className="border-b-4 border-primary flex items-center rounded-none h-full py-8 px-20"
                to="/demographic"
              >
                <UserIcon className="h-6 w-6 inline-block mr-2" />
                By Demographic
              </NavLink>
            </li>
            <li>
              <NavLink
                className="border-b-4 border-primary flex items-center rounded-none h-full py-8 px-20"
                to="/housing-type"
              >
                <UserIcon className="h-6 w-6 inline-block mr-2" />
                By Housing Type
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
