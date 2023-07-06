import {
  CardStackIcon,
  CaretDownIcon,
  ExitIcon,
  HomeIcon,
  PersonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { signOut } from "next-auth/react";
import { UserAvatar } from "../userAvatar";
import { Button } from "@ui/button";
import Link from "next/link";

export const Navigation: React.FC = () => {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className="absolute z-50 flex w-full items-center px-6 py-4">
        <NavigationMenu.Item asChild>
          <Button border="none" asChild>
            <Link href="/">
              <HomeIcon className="mr-2" aria-hidden />
              Home
            </Link>
          </Button>
        </NavigationMenu.Item>

        <NavigationMenu.Item asChild>
          <Button border="none" asChild>
            <Link href="/modules">
              <CardStackIcon className="mr-2" aria-hidden />
              Modules
            </Link>
          </Button>
        </NavigationMenu.Item>

        <NavigationMenu.Item className="ml-auto duration-500 hover:scale-110">
          <NavigationMenu.Trigger className="flex items-center">
            <UserAvatar className="w-8" />
            <CaretDownIcon className="ml-2" aria-hidden />
          </NavigationMenu.Trigger>

          <NavigationMenu.Content className="absolute right-2 z-50 mt-2 min-w-[12rem] rounded-2xl border-2 border-slate-500 bg-slate-900">
            <ul className="space-y-2 py-2">
              <li>
                <Link
                  className="flex w-full items-center px-4 py-2 hover:bg-slate-500"
                  href="/user"
                >
                  <PersonIcon aria-hidden className="mr-2" />
                  Account
                </Link>
              </li>
              <li>
                <button className="flex w-full items-center px-4 py-2 hover:bg-slate-500">
                  <SunIcon aria-hidden className="mr-2" />
                  Theme
                </button>
              </li>
              <li>
                <button
                  className="flex w-full items-center px-4 py-2 hover:bg-slate-500"
                  onClick={() => void signOut()}
                >
                  <ExitIcon aria-hidden className="mr-2" />
                  Logout
                </button>
              </li>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};
