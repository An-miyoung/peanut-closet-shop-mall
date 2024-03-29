"use client";

import { PencilIcon } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  Typography,
  CardBody,
  CardFooter,
  Avatar,
  IconButton,
  Button,
} from "@material-tailwind/react";
import truncate from "truncate";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SearchForm from "@components/SearchForm";
import { Product } from "@app/types";
import { formatPrice } from "@utils/formatPrice";
import { DeleteConfirmDialog } from "@components/DeleteConfirmDialog";
import { useCallback, useEffect, useState } from "react";
import { deleteProduct } from "../(admin_routes)/products/action";

const TABLE_HEAD = [
  "상품명",
  "가격",
  "세일가격",
  "재고수량",
  "카테고리",
  "수정하기",
  "삭제하기",
];

interface Props {
  products: Product[];
  currentPageNo: number;
  hasMore?: boolean;
  showPageNavigator?: boolean;
}

export default function ProductTable(props: Props) {
  const router = useRouter();
  const [toDeletedPID, setToDeletedPID] = useState("");

  const {
    products = [],
    currentPageNo,
    hasMore,
    showPageNavigator = true,
  } = props;

  const handleOnPrevPress = () => {
    const prevPage = currentPageNo - 1;
    if (prevPage > 0) router.push(`/products?page=${prevPage}`);
  };

  const handleOnNextPress = () => {
    const nextPage = currentPageNo + 1;
    router.push(`/products?page=${nextPage}`);
  };

  const handleDeleteProduct = useCallback(
    async (id: string) => {
      try {
        const res = await deleteProduct(id);
        router.refresh();
      } catch (error: any) {
        console.log(error.message);
        throw new Error(error);
      }
    },
    [router]
  );

  useEffect(() => {
    if (toDeletedPID !== "") handleDeleteProduct(toDeletedPID);
  }, [handleDeleteProduct, toDeletedPID]);

  return (
    <div className="py-5">
      <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <Typography placeholder="" variant="h5" color="blue-gray">
            상품 목록
          </Typography>
        </div>
        <div className="flex w-full shrink-0 gap-2 md:w-max">
          <SearchForm submitTo="/products/search?query=" />
          <Link
            href="/products/create"
            className="select-none font-bold text-center uppercase transition-all text-xs py-2 px-4 rounded-lg bg-blue-500 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3"
          >
            <PlusIcon strokeWidth={2} className="h-4 w-4" />{" "}
            <span>새상품추가</span>
          </Link>
        </div>
      </div>
      <CardBody placeholder="" className="px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    placeholder=""
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => {
              const { id, thumbnail, title, price, quantity, category } = item;
              const isLast = index === products.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={id}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <Avatar
                        placeholder=""
                        src={thumbnail}
                        alt={title}
                        size="md"
                        variant="rounded"
                      />
                      <Link href={`/${title}/${id}`}>
                        <Typography
                          placeholder=""
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {truncate(title, 20)}
                        </Typography>
                      </Link>
                    </div>
                  </td>
                  <td className={classes}>
                    <Typography
                      placeholder=""
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {formatPrice(price.mrp)}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      placeholder=""
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {formatPrice(price.salePrice)}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <div className="w-max">
                      <Typography
                        placeholder=""
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {quantity}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="w-max">
                      <Typography
                        placeholder=""
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {category}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <Link href={`/products/update/${id}`}>
                      <IconButton
                        placeholder=""
                        variant="text"
                        color="blue-gray"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Link>
                  </td>
                  <td className={classes}>
                    <DeleteConfirmDialog
                      id={id}
                      setToDeletedPID={setToDeletedPID}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      {showPageNavigator ? (
        <CardFooter
          placeholder=""
          className="flex items-center justify-center border-t border-blue-gray-50 p-4"
        >
          <div className="flex items-center gap-2">
            <Button
              placeholder=""
              disabled={currentPageNo === 1}
              onClick={handleOnPrevPress}
              variant="text"
              color="blue"
            >
              이전
            </Button>
            <Button
              placeholder=""
              disabled={!hasMore}
              onClick={handleOnNextPress}
              variant="text"
              color="blue"
            >
              다음
            </Button>
          </div>
        </CardFooter>
      ) : null}
    </div>
  );
}
