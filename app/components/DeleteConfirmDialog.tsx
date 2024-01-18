"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Props {
  id: string;
  setToDeletedPID: React.Dispatch<React.SetStateAction<string>>;
}

export function DeleteConfirmDialog({ id, setToDeletedPID }: Props) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <IconButton
        placeholder=""
        variant="text"
        color="blue-gray"
        onClick={handleOpen}
      >
        <TrashIcon className="h-4 w-4" />
      </IconButton>

      <Dialog
        placeholder={undefined}
        open={open}
        handler={handleOpen}
        size="xs"
      >
        <DialogHeader placeholder={undefined}>
          이 상품을 정말 삭제하시겠습니까?
        </DialogHeader>
        <DialogBody
          style={{ fontSize: "20px", color: "black" }}
          placeholder={undefined}
        >
          이 상품을 삭제하면 다시 복구할 수 없습니다.
        </DialogBody>
        <DialogFooter placeholder={undefined}>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              handleOpen();
            }}
            className="mr-1"
            placeholder={undefined}
          >
            <span>취소</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => {
              handleOpen();
              setToDeletedPID(id);
            }}
            placeholder={undefined}
          >
            <span>삭제</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
