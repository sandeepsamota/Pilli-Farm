import { useNavigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm, ProductFormValues } from "@/components/admin/ProductForm";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const AdminProductNew = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const handleSubmit = async (values: ProductFormValues) => {
    const { error } = await supabase.from("products").insert({
      ...values,
      image_url: values.image_urls[0] ?? null,
    });
    if (error) {
      toast({ title: "Failed to create", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Product created" });
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
    navigate("/admin");
  };

  return (
    <div className="max-w-3xl">
      <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h1 className="text-2xl font-semibold mb-6">New product</h1>
      <ProductForm onSubmit={handleSubmit} submitLabel="Create product" />
    </div>
  );
};

export default AdminProductNew;