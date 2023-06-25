import {
  CardStackIcon,
  CaretDownIcon,
  ExitIcon,
  PersonIcon,
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
            <Link href="/decks">
              <CardStackIcon className="mr-2" aria-hidden />
              Decks
            </Link>
          </Button>
        </NavigationMenu.Item>

        <NavigationMenu.Item className="ml-auto duration-500 hover:scale-110">
          <NavigationMenu.Trigger className="flex items-center">
            <UserAvatar className="w-8" />
            <CaretDownIcon className="ml-2" aria-hidden />
          </NavigationMenu.Trigger>

          <NavigationMenu.Content className="absolute right-2 z-50 mt-2 ">
            <ul className="space-y-2 py-2">
              <li>
                <Button variant="primary" asChild>
                  <Link href="/user">
                    <PersonIcon aria-hidden className="mr-2" />
                    Account
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="primary" onClick={() => void signOut()}>
                  <ExitIcon aria-hidden className="mr-2" />
                  Logout
                </Button>
              </li>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};
