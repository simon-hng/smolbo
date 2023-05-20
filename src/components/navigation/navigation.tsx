import { CaretDownIcon, ExitIcon } from "@radix-ui/react-icons";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { UserAvatar } from "../userAvatar";
export const Navigation: React.FC = () => {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className="flex items-center px-12 py-8">
        <NavigationMenu.Item>
          <NavigationMenu.Link href="./deck">Decks</NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item className="ml-auto">
          <NavigationMenu.Trigger className="flex items-center">
            <UserAvatar className="w-8" />
            <CaretDownIcon className="ml-2" aria-hidden />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute">
            <ul className="space-y-2 py-2">
              <li>
                <Link href="user">Account</Link>
              </li>
              <li>
                <button
                  className="flex items-center"
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
