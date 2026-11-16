import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Bookmark, Briefcase, ChevronDown, FileText, GraduationCap, LayoutDashboard, LogOut, Menu, Settings, User, X, Compass, Laptop, ClipboardList, Map, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "./Logo";
import { displayName, useAuth, useSignOut } from "@/lib/auth";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof Compass };

const publicNav: NavItem[] = [
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/internships", label: "Internships", icon: GraduationCap },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/freelancing", label: "Freelancing", icon: Laptop },
  { to: "/resume-builder", label: "Resume Builder", icon: FileText },
  { to: "/roadmaps", label: "Career Roadmaps", icon: Map },
  { to: "/resources", label: "Resources", icon: BookOpen },
];

const appNav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/internships", label: "Internships", icon: GraduationCap },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/freelancing", label: "Freelancing", icon: Laptop },
  { to: "/resume-builder", label: "Resume Builder", icon: FileText },
];

const accountNav: NavItem[] = [
  { to: "/applications", label: "My Applications", icon: ClipboardList },
  { to: "/saved", label: "Saved Opportunities", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

function NavLink({ item, onClick, className }: { item: NavItem; onClick?: () => void; className?: string }) {
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={cn(
        "relative rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
        "after:absolute after:inset-x-2.5 after:-bottom-[13px] after:h-0.5 after:scale-x-0 after:bg-primary after:transition-transform after:duration-200",
        "data-[status=active]:text-foreground data-[status=active]:after:scale-x-100",
        className,
      )}
    >
      {item.label}
    </Link>
  );
}

export function Navbar() {
  const { user, loading } = useAuth();
  const signOut = useSignOut();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const items = user ? appNav : publicNav;
  const name = displayName(user);

  return (
    <header className="sticky top-0 z-40 border-b bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <div className="container-page flex h-16 items-center gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden flex-1 items-center gap-0.5 xl:flex">
          {items.map((i) => (
            <NavLink key={i.to} item={i} />
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {loading ? (
            <div className="h-9 w-40 animate-pulse rounded-md bg-muted" aria-hidden="true" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden items-center gap-2 rounded-md py-1 pl-1 pr-2 text-sm transition-colors hover:bg-muted sm:flex" aria-label="Account menu">
                  <span className="grid size-8 place-items-center rounded-full bg-navy text-xs font-semibold uppercase text-navy-foreground">
                    {name.slice(0, 2)}
                  </span>
                  <span className="max-w-[9rem] truncate font-medium">{name}</span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="font-normal">
                  <div className="text-sm font-medium">{name}</div>
                  <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {accountNav.map((i) => (
                  <DropdownMenuItem key={i.to} asChild>
                    <Link to={i.to} className="cursor-pointer">
                      <i.icon className="size-4 text-muted-foreground" />
                      {i.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void signOut()} className="cursor-pointer">
                  <LogOut className="size-4 text-muted-foreground" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/auth" search={{ mode: "signin" }}>Sign In</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link to="/auth" search={{ mode: "signup" }}>Get Started</Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t bg-surface animate-in fade-in slide-in-from-top-2 duration-200 xl:hidden">
          <nav aria-label="Mobile" className="container-page grid gap-1 py-4">
            {items.map((i) => (
              <Link key={i.to} to={i.to} className="flex items-center gap-3 rounded-md px-3 py-3 text-[0.9375rem] hover:bg-muted data-[status=active]:bg-blue-soft data-[status=active]:text-primary">
                <i.icon className="size-4 text-muted-foreground" />
                {i.label}
              </Link>
            ))}
            {user && (
              <>
                <div className="mt-3 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Your account</div>
                {accountNav.map((i) => (
                  <Link key={i.to} to={i.to} className="flex items-center gap-3 rounded-md px-3 py-3 text-[0.9375rem] hover:bg-muted data-[status=active]:bg-blue-soft data-[status=active]:text-primary">
                    <i.icon className="size-4 text-muted-foreground" />
                    {i.label}
                  </Link>
                ))}
              </>
            )}
            <div className="mt-4 grid gap-2 border-t pt-4">
              {user ? (
                <Button variant="outline" onClick={() => void signOut()}>
                  <LogOut /> Sign out
                </Button>
              ) : (
                <>
                  <Button asChild size="lg"><Link to="/auth" search={{ mode: "signup" }}>Get Started</Link></Button>
                  <Button asChild size="lg" variant="outline"><Link to="/auth" search={{ mode: "signin" }}>Sign In</Link></Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
