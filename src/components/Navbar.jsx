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
        <div className="flex-none hidden md:block">
          <ul className="menu menu-horizontal grid grid-cols-3 px-0 py-0 my-0">
            <li>
              <NavLink
                className="border-b-4 border-primary flex justify-center items-center rounded-none text-lg w-full h-full py-8 px-20"
                to="/"
              >
                <MapIcon className="h-6 w-6 inline-block mr-2" />
                By Region
              </NavLink>
            </li>
            <li>
              <NavLink
                className="border-b-4 border-primary flex items-center rounded-none text-lg h-full py-8 px-20"
                to="/demographic"
              >
                <UserIcon className="h-6 w-6 inline-block mr-2" />
                By Demographic
              </NavLink>
            </li>
            <li>
              <NavLink
                className="border-b-4 border-primary flex items-center rounded-none text-lg h-full py-8 px-20"
                to="/housing-type"
              >
                <UserIcon className="h-6 w-6 inline-block mr-2" />
                By Housing Type
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="flex-none md:hidden">
          <div className="dropdown dropdown-end">
            <label tabIndex="0" className="btn btn-ghost btn-square">
              <Bars3Icon className="h-6 w-6" />
            </label>
            <ul
              tabIndex="0"
              className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <NavLink to="/">By Region</NavLink>
              </li>
              <li>
                <NavLink to="/demographic">By Demographic</NavLink>
              </li>
              <li>
                <NavLink to="/housing-type">By Housing Type</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
