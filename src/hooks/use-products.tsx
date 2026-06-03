import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  type: string;
  size: string;
  price: string; // formatted "₹2,280"
  priceNumber: number;
  img: string;
  images: string[];
  benefit: string;
  badges: string[];
  isBestSeller: boolean;
};

const formatINR = (n: number) =>
  `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const resolveImg = (url: string | null) => {
  return url; // assume external URL
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((p) => {
        const urls = (p.image_urls ?? []) as string[];
        const primary = urls[0] ?? p.image_url ?? null;
        const allImages = (urls.length ? urls : [primary]).filter(Boolean).map((u) => resolveImg(u as string));
        return {
          id: p.id as number,
          name: p.name,
          brand: p.brand,
          category: p.category,
          type: p.type,
          size: p.size,
          priceNumber: Number(p.price),
          price: formatINR(Number(p.price)),
          img: resolveImg(primary),
          images: allImages,
          benefit: p.benefit ?? "Pure & wholesome goodness",
          badges: (p.badges ?? []) as string[],
          isBestSeller: !!p.is_best_seller,
        };
      });
    },
  });
};
