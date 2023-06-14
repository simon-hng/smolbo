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

export const Navigation: React.FC = () => {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className="flex items-center border-b-2 border-b-slate-500 px-6 py-4">
        <NavigationMenu.Item asChild>
          <Button href="/decks" border="none" color="primary">
            <CardStackIcon className="mr-2" aria-hidden />
            Decks
          </Button>
        </NavigationMenu.Item>

        <NavigationMenu.Item className="ml-auto">
          <NavigationMenu.Trigger className="flex items-center">
            <UserAvatar className="w-8" />
            <CaretDownIcon className="ml-2" aria-hidden />
          </NavigationMenu.Trigger>

          <NavigationMenu.Content className="absolute right-2 z-50 mt-2 rounded border-2 border-slate-500 bg-slate-900 px-2">
            <ul className="space-y-2 py-2">
              <li>
                <Button color="primary" border="none" href="/user">
                  <PersonIcon aria-hidden className="mr-2" />
                  Account
                </Button>
              </li>
              <li>
                <Button
                  color="primary"
                  border="none"
                  onClick={() => void signOut()}
                >
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
