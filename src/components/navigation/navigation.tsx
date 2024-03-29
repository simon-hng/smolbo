import {
  CardStackIcon,
  CaretDownIcon,
  ExitIcon,
  HomeIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { signOut } from "next-auth/react";
import { UserAvatar } from "../userAvatar";
import { Button } from "@ui/button";
import Link from "next/link";
import { Card } from "../ui/card";

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

          <NavigationMenu.Content
            className="absolute right-2 z-50 mt-2 min-w-[12rem]"
            asChild
          >
            <Card variant="glass" padding="none">
              <ul className="space-y-2 py-2">
                <li>
                  <NavigationMenu.Link asChild>
                    <Link
                      className="flex w-full items-center px-4 py-2 duration-500 hover:bg-slate-500"
                      href="/user"
                    >
                      <PersonIcon aria-hidden className="mr-2" />
                      Account
                    </Link>
                  </NavigationMenu.Link>
                </li>
                <li>
                  <NavigationMenu.Link asChild>
                    <button
                      className="flex w-full items-center px-4 py-2 duration-500 hover:bg-slate-500"
                      onClick={() => void signOut()}
                    >
                      <ExitIcon aria-hidden className="mr-2" />
                      Logout
                    </button>
                  </NavigationMenu.Link>
                </li>
              </ul>
            </Card>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};
