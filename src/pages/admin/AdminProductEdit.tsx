import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm, ProductFormValues } from "@/components/admin/ProductForm";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", Number(id)).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (values: ProductFormValues) => {
    const { error } = await supabase
      .from("products")
      .update({ ...values, image_url: values.image_urls[0] ?? null })
      .eq("id", Number(id));
    if (error) {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Product updated" });
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["admin-product", id] });
    qc.invalidateQueries({ queryKey: ["products"] });
    navigate("/admin");
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }
  if (!data) {
    return <div className="text-sm text-muted-foreground">Product not found.</div>;
  }

  const initial: Partial<ProductFormValues> = {
    name: data.name,
    brand: data.brand,
    category: data.category,
    type: data.type,
    size: data.size,
    price: Number(data.price),
    benefit: data.benefit ?? "",
    badges: (data.badges ?? []) as string[],
    image_urls: ((data.image_urls ?? []) as string[]).length > 0
      ? (data.image_urls as string[])
      : (data.image_url ? [data.image_url] : []),
    is_best_seller: data.is_best_seller,
    is_active: data.is_active,
    sort_order: data.sort_order,
  };

  return (
    <div className="max-w-3xl">
      <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Edit product</h1>
      <ProductForm initial={initial} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  );
};

export default AdminProductEdit;