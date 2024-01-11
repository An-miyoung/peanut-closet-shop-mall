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
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto no-underline "
        >
          <Avatar
            placeholder=""
            variant="circular"
            size="sm"
            alt="candice wu"
            className="border border-blue-500 p-0.5"
            src={
              avatar || "/guest.jpeg"
              // "data:image/png;base64,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"
            }
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
