import {
  PanelRightOpen,
  Star,
  Sun,
  Moon,
  Bell,
  Search,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import Avatar from "react-avatar";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  {
    title: "Dashboards",
    links: [
      {
        id: "#1",
        link_name: "Default",
        link_path: "/",
        active_paths: ["/", "/home"],
        icon: PanelRightOpen,
      },
      {
        id: "#2",
        link_name: "Features",
        icon: PanelRightOpen,
        sub_links: [
          {
            id: "#3",
            link_name: "Settings",
            active_paths: ["/setting"],
            link_path: "/setting",
          },
        ],
      },
    ],
  },
];

const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  const isActive = (linkPaths) => linkPaths.includes(location.pathname);

  return (
    <main className="layout-wrapper">
      <aside className="sidebar">
        <div className="space-y-8 w-full">
          <Menu>
            <MenuButton className="flex items-center gap-3 text-sm">
              <Avatar name="Jeet Kasundra" size="28" round={true} />
              Jeet Kasundra
            </MenuButton>
            <MenuItems
              anchor="bottom start"
              className="w-52 origin-top-right rounded-md border backdrop-blur-md border-white/5 bg-white/5 py-1 text-sm/6 mt-1.5 text-white transition duration-100 ease-out"
            >
              <MenuItem>
                <Button className="flex items-center px-4 py-1.5 text-sm hover:bg-dark text-red-600 w-full">
                  <LogOut className="w-4 h-4 mr-3" />
                  Log Out
                </Button>
              </MenuItem>
            </MenuItems>
          </Menu>
          <div className="w-full space-y-4">
            {navLinks &&
              navLinks.length > 0 &&
              navLinks.map((nav) => (
                <div className="space-y-2 w-full" key={nav.id}>
                  <p className="text-sm opacity-40">{nav.title}</p>
                  <ul className="space-y-1 w-full nav-link">
                    {nav.links &&
                      nav.links.map((link) => {
                        return link.sub_links && link.sub_links.length > 0 ? (
                          <li className="w-full" key={link.id}>
                            <button className="w-full">
                              <div className="flex items-center gap-2.5">
                                {link.icon && (
                                  <link.icon className="w-5 h-5 text-white" />
                                )}
                                <span>{link.link_name}</span>
                              </div>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            <ul className="space-y-1 w-full pl-10 mt-2">
                              {link.sub_links.map((sub_link) => (
                                <li className="w-full" key={sub_link.id}>
                                  <Link
                                    to={sub_link.link_path}
                                    className={`${
                                      isActive(sub_link.active_paths)
                                        ? "active-link"
                                        : ""
                                    }`}
                                  >
                                    {sub_link.link_name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ) : (
                          <li className="w-full" key={link.id}>
                            <Link
                              to={link.link_path}
                              className={`${
                                isActive(link.active_paths) ? "active-link" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                {link.icon && (
                                  <link.icon className="w-5 h-5 text-white" />
                                )}
                                <span>{link.link_name}</span>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              ))}
          </div>
        </div>
        <p className="font-mono lowercase text-center w-full">TWILIO</p>
      </aside>
      <section className="main-layout">
        <header className="header">
          <div className="flex items-center gap-2.5">
            <Button>
              <PanelRightOpen />
            </Button>
            <Button>
              <Star />
            </Button>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="bg-white bg-opacity-10 rounded-md py-1 pl-1 pr-1.5">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-white  opacity-20" />
                <p className="text-sm text-white  opacity-20 mr-10">Search</p>
                <p className="text-xs text-white opacity-20">⌘</p>
              </div>
            </div>
            <Button>
              <Sun className=" dark:block hidden" />
              <Moon className=" dark:hidden block" />
            </Button>
            <Button>
              <Bell />
            </Button>
          </div>
        </header>
        <section>{children}</section>
      </section>
    </main>
  );
};

export default LayoutWrapper;
