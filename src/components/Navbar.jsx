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
      <div className="top-4 z-50 bg-base-200 border-b-2 mx-12 mt-10 max-w-7xl border-primary p-0">
        <div className="flex-none hidden md:block">
          <ul className="menu menu-horizontal px-0 py-0 ml-12 my-0">
            <li>
              <NavLink className="rounded-none" to="/">
                <button className="btn btn-ghost btn-xl w-80">
                  <MapIcon className="h-6 w-6 inline-block mr-2" />
                  By Region
                </button>
              </NavLink>
            </li>
            <li>
              <NavLink className="rounded-none" to="/demographic">
                <button className="btn btn-ghost btn-xl w-80">
                  <UserIcon className="h-6 w-6 inline-block mr-2" />
                  By Demographic
                </button>
              </NavLink>
            </li>
            <li>
              <NavLink className="rounded-none" to="/housing-type">
                <button className="btn btn-ghost btn-xl w-80">
                  <MapIcon className="h-6 w-6 inline-block mr-2" />
                  By Housing Type
                </button>
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
