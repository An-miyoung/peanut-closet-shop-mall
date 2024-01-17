import Image from "next/image";
import { rgbDataURL } from "../utils/blurDataUrl";

interface Props {
  src?: string;
}

const SelectedImageThumb = ({ src }: Props) => {
  if (!src) return null;

  return (
    <div className="w-20 h-20 relative">
      <Image
        src={src}
        alt="product"
        fill
        className="object-fill rounded bg-blue-gray-200"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
        placeholder="blur"
        blurDataURL={rgbDataURL(237, 181, 6)}
      />
    </div>
  );
};

export default SelectedImageThumb;
