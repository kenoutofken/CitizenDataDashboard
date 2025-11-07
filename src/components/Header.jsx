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
      <div className="w-full bg-primary p-12">
        <div className="flex justify-start">
          <img
            src="images/logo.png"
            alt="Vancouver Healthy City Dashboard"
            className="h-16"
          />
        </div>
      </div>
    </>
  );
}
