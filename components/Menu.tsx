import React, { useContext, useEffect, useReducer, useRef } from "react";
import classNames from "classnames";
import Bars from "./icons/Bars";
import Navigation from "./Navigation";
import MenuContext from "../contexts/MenuContext";
import SubLinkContext from "../contexts/SubLinkContext";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { useRouter } from "next/router";
import NavigationFollower, { updateNavReducer } from "./NavigationFollower";

export default function Menu() {
  const ref = useRef(null);
  const router = useRouter();
  const { open, setClose } = useContext(MenuContext);
  const [activeSubLink, setActiveSubLink] = useReducer(updateNavReducer, "");

	const classes = classNames(
		[
			"text-theme-light-text absolute -left-full pr-16 md:pr-0 top-0 w-full h-full flex z-40 transition-transform duration-300 transform-gpu",
			"md:flex md:flex-shrink-0 md:left-auto md:relative md:w-auto md:transform-none md:transition-none",
		],
		{
			"translate-x-full ": open,
			"translate-x-none md:flex": !open,
		}
	);

	useEffect(() => {
		const handler = () => {
			if (open) {
				setClose();
			}
		};

		router.events.on("routeChangeComplete", handler);
		return () => router.events.on("routeChangeComplete", handler);
	}, [router.events, open, setClose]);

	useOnClickOutside(ref, setClose);

  return (
    <div className={classes}>
      <div
        className="flex flex-col w-full dark:bg-sidebar-tertiary-dark bg-sidebar-tertiary-light md:w-80"
        ref={ref}
      >
        <div className="flex flex-col flex-grow pb-4 pt-5 overflow-y-auto">
          <div className="flex flex-1 flex-col items-start">
            <Bars
              onClick={setClose}
              className="ml-6 h-7 text-black dark:text-white cursor-pointer md:hidden"
            />
            <SubLinkContext.Provider
              value={{ active: activeSubLink, setActive: setActiveSubLink }}
            >
              <Navigation />
              <NavigationFollower />
            </SubLinkContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}
