type NewsDetailBodyFrameProps = {
  paragraphs: string[];
};

export default function NewsDetailBodyFrame({ paragraphs }: NewsDetailBodyFrameProps) {
  return (
    <div className="grid gap-4 text-base leading-[1.4] font-light">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="m-0">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

