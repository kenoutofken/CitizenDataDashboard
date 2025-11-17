import {
  Bars3Icon,
  HomeIcon,
  MapIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router";

export function Header() {
  return (
    <>
      <div className="flex items-center justify-between w-full bg-primary p-12">
        <Bars3Icon className="h-8 w-8 text-white md:hidden" />
        <div className="flex justify-start">
          <img
            src="images/logo.png"
            alt="Vancouver Healthy City Dashboard"
            className="h-16"
          />
          <ul className="hidden lg:flex gap-12 items-end text-white xs:text-xs sm:text-sm md:text-base ml-12">
            <li>Catalogue</li>
            <li>Dashboards</li>
            <li>Chart Builder</li>
            <li>Map Builder</li>
            <li>Help & API</li>
          </ul>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary mt-4">
            Sign Up
          </button>
          <button className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary mt-4">
            Sign In
          </button>
        </div>
      </div>
    </>
  );
}
