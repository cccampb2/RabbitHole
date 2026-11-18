import Container from "../layout/Container";
import { Link, NavLink } from "react-router";
import Wordmark from "../ui/Wordmark";
import { LuChevronDown } from "react-icons/lu";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { LuX } from "react-icons/lu";

type MenuName = "Algorithms" | "Data Structures" | "Patterns" | "Concepts";

export default function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<MenuName | null>(null);
  const [isMobileMenuOpen, setIsMobileViewOpen] = useState(false);

  const navRef = useRef<HTMLElement | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);

  const headerNav: {
    label: MenuName;
    route: string;
    dropdown: { label: string; route: string }[];
  }[] = [
    {
      label: "Algorithms",
      route: "/algorithms",
      dropdown: [
        {
          label: "Sorting",
          route: "/sorting",
        },
        {
          label: "Searching",
          route: "/searching",
        },
        {
          label: "Graph Algorithms",
          route: "/graph-algorithms",
        },

        {
          label: "Pathfinding",
          route: "/pathfinding",
        },
        { label: "Dynamic Programming", route: "/dynamic-programming" },
        { label: "Recursion", route: "/recursion" },
      ],
    },
    {
      label: "Data Structures",
      route: "/data-structures",
      dropdown: [
        {
          label: "Arrays",
          route: "/arrays",
        },
        {
          label: "Linked List",
          route: "/linked-list",
        },
        {
          label: "Stacks",
          route: "/stacks",
        },

        {
          label: "Queues",
          route: "/queues",
        },
        {
          label: "Graphs",
          route: "/graphs",
        },
        {
          label: "Trees",
          route: "/trees",
        },
        {
          label: "Hash Maps",
          route: "/hash-maps",
        },
        {
          label: "Heaps",
          route: "/heaps",
        },
      ],
    },
    {
      label: "Patterns",
      route: "/patterns",
      dropdown: [
        {
          label: "Two Pointers",
          route: "/two-pointers",
        },
        {
          label: "Sliding Window",
          route: "/sliding-window",
        },
        {
          label: "Fast & Slow Pointers",
          route: "/fast-slow-pointers",
        },
        {
          label: "Prefix Sums",
          route: "/prefix-sums",
        },
        {
          label: "Backtracking",
          route: "/backtracking",
        },
        {
          label: "Greedy",
          route: "/greedy",
        },
      ],
    },
    {
      label: "Concepts",
      route: "/concepts",
      dropdown: [
        {
          label: "Big O Notation",
          route: "/big-o-notation",
        },
        {
          label: "Time Complexity",
          route: "/time-complexity",
        },
        {
          label: "Space Complexity",
          route: "/space-complexity",
        },

        {
          label: "Complexity Analysis",
          route: "/complexity-analysis",
        },
      ],
    },
  ];

  useEffect(() => {
    if (openMenu === null && !isMobileMenuOpen) return;

    function handleOutsidePointer(event: PointerEvent) {
      const nav = navRef.current;

      if (nav && event.target instanceof Node && !nav.contains(event.target)) {
        setOpenMenu(null);
        setIsMobileViewOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointer);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
    };
  }, [openMenu, isMobileMenuOpen]);

  return (
    <header className="z-30 pointer-events-none flex justify-center fixed top-4.5 left-0 right-0  ">
      <Container>
        <nav
          onKeyDown={(event) => {
            if (event.key === "Escape" && isMobileMenuOpen) {
              setOpenMenu(null);
              setIsMobileViewOpen(false);
              mobileToggleRef.current?.focus();
            }
          }}
          ref={navRef}
          aria-label="Primary"
          className="shadow-navbar w-full justify-between md:justify-start md:w-fit mx-auto pointer-events-auto backdrop-blur-[18px] bg-[#08090aeb] border border-[#2b2d33] rounded-[999px] items-center gap-6.5 min-h-13.5 p-[7px_20px_7px_20px] flex relative "
        >
          <Link
            onClick={() => {
              setOpenMenu(null);
              setIsMobileViewOpen(false);
            }}
            aria-label="RabbitNotation home"
            to="/"
            className="inline-block py-2.5"
          >
            <Wordmark />
          </Link>
          <ul className=" items-center gap-0.5 hidden md:flex">
            {headerNav.map((menu) => (
              <li
                key={menu.label}
                onKeyDown={(event) => {
                  if (event.key === "Escape" && openMenu === menu.label) {
                    setOpenMenu(null);
                    event.currentTarget.querySelector("button")?.focus();
                  }
                }}
                className="relative"
              >
                <button
                  type="button"
                  aria-controls={`${menu.route.slice(1)}-dropdown`}
                  className="transition-colors duration-200 text-[#a9adb7] cursor-pointer bg-transparent border-none rounded-[999px] justify-center items-center gap-1.25 min-h-9.5 flex py-0 px-2.5 text-[12px] hover:text-white hover:bg-[#ffffff0d] "
                  aria-expanded={openMenu === menu.label}
                  onClick={() => {
                    setOpenMenu((current) =>
                      current === menu.label ? null : menu.label,
                    );
                  }}
                >
                  {menu.label}
                  <LuChevronDown aria-hidden="true" />
                </button>{" "}
                {openMenu === menu.label && (
                  <div
                    id={`${menu.route.slice(1)}-dropdown`}
                    className="motion-safe:animate-menu-in absolute top-12 left-1/2 -translate-x-1/2 w-52 p-[7px] rounded-2xl border border-[#2b2e36] bg-[#0d0f12f5] backdrop-blur-[20px] shadow-dropdown"
                  >
                    {menu.dropdown.map((page) => (
                      <NavLink
                        key={page.label}
                        to={`${menu.route}${page.route}`}
                        onClick={() => setOpenMenu(null)}
                        className="aria-[current=page]:text-brand flex justify-between text-[#989eab] rounded-[9px] py-[9px] px-2.5 text-[12px] items-center hover:text-white hover:bg-[#ffffff0b]"
                      >
                        {page.label}
                        <LiaLongArrowAltRightSolid
                          className="-rotate-45"
                          aria-hidden="true"
                        />
                      </NavLink>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="flex gap-px md:border-l md:border-l-[#ffffff12] md:pl-2.25">
            <a
              href="https://github.com/cccampb2/RabbitHole"
              target="_blank"
              aria-label="RabbitNotation on GitHub"
              className="hidden md:flex w-9 text-[#a9adb7] cursor-pointer bg-transparent border-0 rounded-[999px] justify-center items-center gap-1.25 min-h-9.5 transition-colors duration-200 hover:text-white hover:bg-[#ffffff0c]"
            >
              {" "}
              <FaGithub aria-hidden="true" className="w-4.25 h-4.25 " />
            </a>
            <button
              ref={mobileToggleRef}
              type="button"
              aria-controls="mobile-navigation"
              onClick={() => setIsMobileViewOpen((current) => !current)}
              aria-label={
                isMobileMenuOpen ? "Close navigation" : "Open navigation"
              }

              aria-expanded={isMobileMenuOpen}

              className="md:hidden w-9 text-[#a9adb7] cursor-pointer bg-transparent border-0 rounded-[999px] justify-center items-center gap-1.25 min-h-9.5 transition-colors duration-200 flex hover:text-white hover:bg-[#ffffff0c]"
            >
              {" "}
              <span
                aria-hidden="true"
                className="relative inline-block size-4.25"
              >
                <GiHamburgerMenu
                  className={`absolute inset-0 size-full transition-[opacity,rotate] duration-200 ease-out motion-reduce:transition-none ${
                    isMobileMenuOpen
                      ? "opacity-0 -rotate-90"
                      : "opacity-100 rotate-0"
                  }`}
                />
                <LuX
                  className={`absolute inset-0 size-full transition-[opacity,rotate] duration-200 ease-out motion-reduce:transition-none ${
                    isMobileMenuOpen
                      ? "opacity-100 rotate-0"
                      : "opacity-0 rotate-90"
                  }`}
                />
              </span>
            </button>
          </div>
          {isMobileMenuOpen && (
            <div
              id="mobile-navigation"
              className="absolute top-15.5 inset-x-0 block md:hidden backdrop-blur-[20px] bg-[#0d0f12f7] border border-[#2b2e36] rounded-[19px] p-2 motion-safe:animate-menu-in shadow-[0_18px_50px_#0009]"
            >
              <ul>
                {headerNav.map((menu) => (
                  <li
                    key={menu.label}
                    className="list-none border-b border-b-[#ffffff0d]"
                  >
                    <button
                      aria-controls={`mobile-${menu.route.slice(1)}-dropdown`}
                      onClick={() => {
                        setOpenMenu((current) =>
                          current === menu.label ? null : menu.label,
                        );
                      }}
                      aria-expanded={openMenu === menu.label}
                      type="button"
                      className="w-full flex justify-between items-center text-[#d7d9de] cursor-pointer py-3.5 px-3 text-[13px]"
                    >
                      {menu.label}
                      <LuChevronDown />
                    </button>
                    {openMenu === menu.label && (
                      <ul
                        className="grid grid-cols-2 pt-0 px-3 pb-2.5"
                        id={`mobile-${menu.route.slice(1)}-dropdown`}
                      >
                        {menu.dropdown.map((page) => (
                          <li
                            key={page.label}
                            className="text-[#818894] py-1.75 px-0 text-[12px]"
                          >
                            <NavLink
                              onClick={() => {
                                setOpenMenu(null);
                                setIsMobileViewOpen(false);
                              }}
                              to={`${menu.route}${page.route}`}
                            >
                              {page.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <a
                href="https://github.com/cccampb2/RabbitHole"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setOpenMenu(null);
                  setIsMobileViewOpen(false);
                }}
                className="flex items-center gap-2 rounded-[9px] px-3 py-3.5 text-[13px] text-[#a9adb7] transition-colors duration-200 hover:bg-[#ffffff0c] hover:text-white"
              >
                <FaGithub aria-hidden="true" className="size-4.25 shrink-0" />
                Contribute on GitHub
              </a>
            </div>
          )}
        </nav>
      </Container>
    </header>
  );
}
