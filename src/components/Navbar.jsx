import { Bars3Icon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router";

export function Navbar() {
  return (
    <div className="navbar top-0 left-0 right-0 z-50 bg-base-200 px-5">
      <div className="flex-1 flex items-center">
        <a className="btn btn-ghost text-xl">
          Households spending over 30% of income on housing
        </a>
      </div>

      <div className="flex-none hidden md:block">
        <ul className="menu menu-horizontal px-1">
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
  );
}
