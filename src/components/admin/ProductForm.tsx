import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export type ProductFormValues = {
  name: string;
  brand: string;
  category: string;
  type: string;
  size: string;
  price: number;
  benefit: string;
  badges: string[];
  image_urls: string[];
  is_best_seller: boolean;
  is_active: boolean;
  sort_order: number;
};

type Props = {
  initial?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  submitLabel?: string;
};

export const ProductForm = ({ initial, onSubmit, submitLabel = "Save" }: Props) => {
  const [values, setValues] = useState<ProductFormValues>({
    name: initial?.name ?? "",
    brand: initial?.brand ?? "",
    category: initial?.category ?? "Oils",
    type: initial?.type ?? "",
    size: initial?.size ?? "",
    price: initial?.price ?? 0,
    benefit: initial?.benefit ?? "",
    badges: initial?.badges ?? [],
    image_urls: initial?.image_urls ?? [],
    is_best_seller: initial?.is_best_seller ?? false,
    is_active: initial?.is_active ?? true,
    sort_order: initial?.sort_order ?? 0,
  });
  const fileInputRef = useRef(null);
  const [imgInput, setImgInput] = useState("");
  const [badgeInput, setBadgeInput] = useState("");
  const [busy, setBusy] = useState(false);
  const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudinaryCloudName = 'dpqdeoi5b';
  const [loading, setLoading] = useState(false);
  const [loadingAddUrl, setLoadingAddUrl] = useState(false);
  const update = <K extends keyof ProductFormValues>(k: K, v: ProductFormValues[K]) =>
    setValues((p) => ({ ...p, [k]: v }));

  const addImage = async () => {
    const url = imgInput.trim();
    if (!url) return;
    if (values.image_urls.includes(url)) return;
    setLoadingAddUrl(true);
    const formData = new FormData();

    formData.append(
      "file",
      url
    );

    formData.append("upload_preset", cloudinaryUploadPreset);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if(data.error) {
        console.error("Cloudinary error:", data.error);
        toast({ title: "Image upload failed", description: data.error.message, variant: "destructive" });
        return;
      } 
      console.log(data.secure_url);
      update("image_urls", [...values.image_urls, data.secure_url]);
      setImgInput("");

    } catch (error) {
      console.error("Upload error:", error);
      setImgInput("");
      toast({ title: "Image upload failed", description: error.message, variant: "destructive" });
    } finally {
      setLoadingAddUrl(false);
    } 

  };

  const removeImage = (url: string) => {

    update("image_urls", values.image_urls.filter((u) => u !== url));

  }

  const addBadge = () => {
    const b = badgeInput.trim();
    if (!b || values.badges.includes(b)) return;
    update("badges", [...values.badges, b]);
    setBadgeInput("");
  };

  const removeBadge = (b: string) => update("badges", values.badges.filter((x) => x !== b));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit(values);
    } finally {
      setBusy(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    const formData = new FormData();

    formData.append("file", file);

    formData.append("upload_preset", cloudinaryUploadPreset);
    fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {

        if (data.error) {
          console.error("Cloudinary error:", data.error);
          toast({ title: "Image upload failed", description: data.error.message, variant: "destructive" });
          return;
        }
        update("image_urls", [...(values.image_urls || []), data.secure_url]);
      }).catch((error) => {
        console.error("Upload error:", error);
        toast({ title: "Image upload failed", description: error.message, variant: "destructive" });
      }).finally(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clears the selected file(s)
        }
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name" required>
          <Input value={values.name} onChange={(e) => update("name", e.target.value)} required maxLength={120} />
        </Field>
        <Field label="Brand" required>
          <Input value={values.brand} onChange={(e) => update("brand", e.target.value)} required maxLength={60} />
        </Field>
        <Field label="Category" required>
          <Input value={values.category} onChange={(e) => update("category", e.target.value)} required placeholder="Oils, Ghee..." maxLength={40} />
        </Field>
        <Field label="Type" required>
          <Input value={values.type} onChange={(e) => update("type", e.target.value)} required placeholder="Cottonseed, Groundnut..." maxLength={60} />
        </Field>
        <Field label="Size" required>
          <Input value={values.size} onChange={(e) => update("size", e.target.value)} required placeholder="15 L, 1 kg..." maxLength={30} />
        </Field>
        <Field label="Price (₹)" required>
          <Input type="number" step="0.01" min="0" value={values.price} onChange={(e) => update("price", parseFloat(e.target.value) || 0)} required />
        </Field>
      </div>

      <Field label="Benefit / short description">
        <Textarea value={values.benefit} onChange={(e) => update("benefit", e.target.value)} rows={2} maxLength={200} />
      </Field>

      <div>
        <Label className="mb-2 block">Image URLs</Label>
        <div className="flex gap-2">
          <Input
            placeholder="https://..."
            value={imgInput}
            onChange={(e) => setImgInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
          />
         <Button type="button" variant="outline" disabled={loadingAddUrl} onClick={addImage}>{loadingAddUrl ? <Loader2 className="h-4 w-4 animate-spin" /> :<Plus className="w-4 h-4" /> }</Button>
        </div>

        <div className="text-sm text-muted-foreground my-2 flex justify-center">Or</div>

        <div className="flex items-center gap-2 relative">
          <Input ref={fileInputRef} accept="image/*" type="file" onChange={handleFileUpload} />
          {loading && (
            <div className="flex justify-center absolute right-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>
        {values.image_urls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            {values.image_urls.map((url, i) => (
              <div key={url} className="relative group rounded-lg overflow-hidden border bg-muted aspect-square">
                <img src={url} alt={`Product ${i + 1}`} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />
                <button type="button" onClick={() => removeImage(url)} className="absolute top-1 right-1 bg-background-black rounded-full p-1 ">
                  <X className="w-3 h-3" />
                </button>
                {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-background/90 px-1.5 py-0.5 rounded">Primary</span>}
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-2">First image is shown in product grid.</p>
      </div>

      <div>
        <Label className="mb-2 block">Badges</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Cold Pressed, Chemical-Free..."
            value={badgeInput}
            onChange={(e) => setBadgeInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addBadge(); } }}
          />
          <Button type="button" variant="outline" onClick={addBadge}><Plus className="w-4 h-4" /></Button>
        </div>
        {values.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {values.badges.map((b) => (
              <span key={b} className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
                {b}
                <button type="button" onClick={() => removeBadge(b)}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Sort order">
          <Input type="number" value={values.sort_order} onChange={(e) => update("sort_order", parseInt(e.target.value) || 0)} />
        </Field>
        <div className="flex items-center justify-between rounded-md border px-3 py-2">
          <Label htmlFor="bestseller" className="cursor-pointer">Best seller</Label>
          <Switch id="bestseller" checked={values.is_best_seller} onCheckedChange={(v) => update("is_best_seller", v)} />
        </div>
        <div className="flex items-center justify-between rounded-md border px-3 py-2">
          <Label htmlFor="active" className="cursor-pointer">Active</Label>
          <Switch id="active" checked={values.is_active} onCheckedChange={(v) => update("is_active", v)} />
        </div>
      </div>

      <Button type="submit" disabled={busy} className="w-full md:w-auto">
        {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
};

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label>{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
    {children}
  </div>
);