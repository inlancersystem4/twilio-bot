import {
  PanelRightOpen,
  Sun,
  Moon,
  Bell,
  Search,
  LogOut,
  ChevronRight,
  House,
  User,
  ContactRound,
  Languages,
  MessageCircle,
} from "lucide-react";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import Avatar from "react-avatar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useDispatch } from "react-redux";
import { post } from "../../../utils/apiHelper";
import { setLogging } from "../../../redux/actions/actions";
import { toast } from "sonner";

const navLinks = [
  {
    title: "Dashboards",
    links: [
      {
        id: "#1",
        link_name: "Home",
        link_path: "/",
        active_paths: ["/"],
        icon: House,
      },
      {
        id: "#2",
        link_name: "User",
        icon: User,
        sub_links: [
          {
            id: "#2_1",
            link_name: "List",
            active_paths: ["/users"],
            link_path: "/users",
          },
          {
            id: "#2_2",
            link_name: "Add",
            active_paths: ["/user-add-edit"],
            link_path: "/user-add-edit",
          },
        ],
      },
      {
        id: "#4",
        link_name: "language",
        link_path: "/language",
        active_paths: ["/language"],
        icon: Languages,
      },
      {
        id: "#3",
        link_name: "Contacts",
        link_path: "/contacts",
        active_paths: ["/contacts"],
        icon: ContactRound,
      },
      {
        id: "#5",
        link_name: "whatsapp",
        link_path: "/whatsapp",
        active_paths: ["/whatsapp"],
        icon: MessageCircle,
      },
    ],
  },
];

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isActive = (linkPaths) => {
    if (!Array.isArray(linkPaths)) return false;
    return linkPaths.includes(location.pathname);
  };

  const logOut = async () => {
    try {
      const response = await post("/logout", {
        session_token: localStorage.getItem("token"),
      });
      if (response.success === 2) {
        toast.success(response.message);
        dispatch(setLogging(false));
        localStorage.removeItem("token");
        return navigate("/login");
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error("Error logout", e);
    }
  };

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
                <Button
                  onClick={logOut}
                  className="flex items-center px-4 py-1.5 text-sm hover:bg-dark text-red-600 w-full"
                >
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
                        const isLinkActive = isActive(link.active_paths);
                        const hasActiveSubLink = link.sub_links?.some(
                          (sub_link) => isActive(sub_link.active_paths)
                        );

                        return link.sub_links && link.sub_links.length > 0 ? (
                          <Disclosure
                            as="li"
                            className="w-full"
                            defaultOpen={isLinkActive || hasActiveSubLink}
                            key={link.id}
                          >
                            <DisclosureButton className="w-full group">
                              <div className="flex items-center gap-2.5">
                                {link.icon && (
                                  <link.icon className="w-4 h-4 text-white" />
                                )}
                                <span>{link.link_name}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 group-data-[open]:rotate-90 transition-transform" />
                            </DisclosureButton>
                            <DisclosurePanel className="space-y-1 w-full pl-10 mt-1">
                              {link.sub_links.map((sub_link) => (
                                <div className="w-full" key={sub_link.id}>
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
                                </div>
                              ))}
                            </DisclosurePanel>
                          </Disclosure>
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
                                  <link.icon className="w-4 h-4 text-white" />
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
        <section className="px-3 w-full h-full">{children}</section>
      </section>
    </main>
  );
};

export default LayoutWrapper;
