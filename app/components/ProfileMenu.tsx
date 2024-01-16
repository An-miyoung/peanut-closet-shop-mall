"use client";

import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  PowerIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import Link from "next/link";
import useAuth from "@hooks/useAuth";
import { MenuItems } from "@app/types";
import SignOutButton from "@components/SignOut";

interface Props {
  menuItems: MenuItems[];
  avatar?: string;
}

export default function ProfileMenu({ menuItems, avatar }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const { isAdmin } = useAuth();

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        {/* button 으로 감싸서 아바타와 ^ 표시가 같이 움직이도록 */}
        <Button
          placeholder=""
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto no-underline hover:no-underline active:no-underline "
        >
          <Avatar
            placeholder=""
            variant="circular"
            size="sm"
            alt="candice wu"
            className="border border-blue-500 p-0.5"
            src={avatar || "/guest.jpeg"}
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>

      <MenuList placeholder="" className="p-1">
        {menuItems.map(({ href, icon, label }) => {
          return (
            <Link key={href} href={href} className="outline-none">
              <MenuItem
                placeholder=""
                onClick={closeMenu}
                className="flex items-center gap-2 rounded"
              >
                {icon}
                <span>{label}</span>
              </MenuItem>
            </Link>
          );
        })}

        {isAdmin ? (
          <Link href="/dashboard" className="outline-none">
            <MenuItem
              placeholder=""
              onClick={closeMenu}
              className="flex items-center gap-2 rounded"
            >
              <RectangleGroupIcon className="h-4 w-4" />
              <span>관리자전용</span>
            </MenuItem>
          </Link>
        ) : null}

        <MenuItem placeholder="">
          <SignOutButton>
            <div className="flex items-center gap-2 rounded">
              <PowerIcon className="h-4 w-4" />
              <span>로그아웃</span>
            </div>
          </SignOutButton>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
