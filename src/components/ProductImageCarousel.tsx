import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Props = {
  images: string[];
  alt: string;
};

export const ProductImageCarousel = ({ images, alt }: Props) => {
  const [viewer, setViewer] = useState<string | null>(null);
  const imgs = images.length ? images : [];

  const openViewer = (e: React.MouseEvent, src: string) => {
    e.preventDefault();
    setViewer(src);
  };

  return (
    <>
      <Carousel opts={{ loop: true }} className="h-full w-full">
        <CarouselContent className="ml-0 h-full">
          {imgs.map((src, idx) => (
            <CarouselItem key={idx} className="pl-0 h-full">
              <img
                src={src}
                alt={`${alt} ${idx + 1}`}
                loading="lazy"
                onContextMenu={(e) => openViewer(e, src)}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 cursor-zoom-in"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {imgs.length > 1 && (
          <>
            <CarouselPrevious className="left-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext className="right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        )}
      </Carousel>

      <Dialog open={!!viewer} onOpenChange={(o) => !o && setViewer(null)}>
        <DialogContent className="max-w-4xl p-2 bg-background">
          {viewer && (
            <img src={viewer} alt={alt} className="w-full h-auto max-h-[85vh] object-contain rounded-md" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};