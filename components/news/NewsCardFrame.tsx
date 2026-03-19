import Image from "next/image";
import Link from "next/link";

type NewsCardFrameProps = {
  href: string;
  title: string;
  image: string;
  cardClassName?: string;
  imageWrapClassName?: string;
  titleClassName?: string;
};

export default function NewsCardFrame({
  href,
  title,
  image,
  cardClassName,
  imageWrapClassName = "h-[200px]",
  titleClassName,
}: NewsCardFrameProps) {
  return (
    <article className={`overflow-hidden rounded-[32px] border border-secondary ${cardClassName ?? ""}`}>
      <Link href={href} className="group flex h-full flex-col bg-primary text-secondary no-underline">
        <div className={`relative w-full shrink-0 overflow-hidden ${imageWrapClassName}`}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 bg-primary p-6">
          <h3
            className={`m-0 overflow-hidden text-[15px] leading-[1.2] font-medium uppercase ${titleClassName ?? ""}`}
          >
            {title}
          </h3>
          <span className="text-[14px] leading-[1.2] font-bold uppercase underline underline-offset-2">
            Learn more
          </span>
        </div>
      </Link>
    </article>
  );
}

