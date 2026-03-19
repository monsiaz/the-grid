import Image from "next/image";

type NewsDetailGalleryFrameProps = {
  images: string[];
  title: string;
};

export default function NewsDetailGalleryFrame({ images, title }: NewsDetailGalleryFrameProps) {
  return (
    <div className="grid grid-cols-2 gap-5 min-[900px]:grid-cols-5">
      {images.map((image, index) => (
        <div key={`${image}-${index}`} className="relative aspect-[321/380] w-full overflow-hidden">
          <Image
            src={image}
            alt={`${title} gallery image ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 899px) 50vw, 20vw"
          />
        </div>
      ))}
    </div>
  );
}

