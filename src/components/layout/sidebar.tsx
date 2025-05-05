import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import { MessageSquare, Settings, Users } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Link } from "react-router-dom";
import { NavUser } from "../ui/nav-user";
import { useApiURL } from "@/context/apiurl-context";

const navItems = [
  {
    url: "/chat",
    title: "Chats",
    icon: MessageSquare,
  },
  {
    url: "/config",
    title: "Configuration",
    icon: Settings,
  },
  { url: "/users", title: "Users", icon: Users },
];

export default function AppSidebar() {
  const { user } = useAuth();
  const {logoImage, nombre} = useApiURL()

  // const { open } = useSidebar();

  if (!user) return null;

  // const initials = user.name
  //   .split(" ")
  //   .map((n) => n[0])
  //   .join("")
  //   .toUpperCase();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  {/* <Command className="size-4" /> */}
                  <img className="rounded-sm" src={logoImage} alt={logoImage}/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{nombre}</span>
                  <span className="truncate text-xs">NabuCore Afiliate</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* <div
          className={`flex ${
            !open ? "justify-center" : "flex-col items-center"
          } p-4`}
        >
          <div className="relative">
            <Avatar className={!open ? "" : "h-20 w-20 mb-4"}>
              <AvatarImage
                className={`rounded-full ${!open ? "min-w-9" : ""}`}
                src={user.avatar}
                alt={user.name}
              />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            {!open && (
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background"></div>
            )}
          </div> */}

        {/* Solo mostrar esta información cuando el sidebar está expandido */}
        {/* {open && (
            <>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2 flex items-center space-x-1">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </>
          )} */}
        {/* </div> */}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={`${item.url}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            email: user.email as string,
            name: user.nombre as string,
            avatar: "",
          }}
        />
        {/* <SidebarMenu
          className={`px-2 py-2 ${
            !open ? "justify-center" : "justify-between"
          }`}
        >
          {!open ? (
            // Versión colapsada - iconos apilados verticalmente
            <div className="flex flex-col space-y-4 items-center">
              <ThemeToggle />
              <Button
                variant="outline"
                size="icon"
                className="rounded-full text-destructive"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            // Versión expandida - iconos uno al lado del otro
            <div className="flex items-center justify-between w-full">
              <ThemeToggle />
              <Button
                variant="outline"
                size="icon"
                className="rounded-full text-destructive"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </SidebarMenu> */}
      </SidebarFooter>
    </Sidebar>
  );
}
