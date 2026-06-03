import { useState, ReactNode } from "react";
import { z } from "zod";
import { MessageCircle, User, Phone, MapPin, Home, Hash, StickyNote } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const PHONE_DIGITS = "917297820374";

const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(80, { message: "Name must be under 80 characters" }),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, { message: "Enter a valid 10-digit mobile number" }),
  address: z
    .string()
    .trim()
    .min(8, { message: "Please enter your full address" })
    .max(300, { message: "Address must be under 300 characters" }),
  city: z
    .string()
    .trim()
    .min(2, { message: "City is required" })
    .max(60, { message: "City must be under 60 characters" }),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, { message: "Pincode must be 6 digits" }),
  notes: z.string().trim().max(300, { message: "Notes must be under 300 characters" }).optional(),
});

export type CustomerDetails = z.infer<typeof customerSchema>;

type Props = {
  trigger: ReactNode;
  /** Build the order summary lines for the WhatsApp message (without customer block). */
  buildOrderLines: () => string[];
  /** Optional callback after successful submit (e.g. clear cart). */
  onSubmitted?: () => void;
  title?: string;
  description?: string;
};

export const CustomerDetailsDialog = ({
  trigger,
  buildOrderLines,
  onSubmitted,
  title = "Delivery Details",
  description = "Fill in your details — we'll send the complete order with your address to WhatsApp.",
}: Props) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CustomerDetails>({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});

  const update = <K extends keyof CustomerDetails>(key: K, value: CustomerDetails[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = customerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CustomerDetails, string>> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof CustomerDetails;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      toast({
        title: "Please check your details",
        description: "Some fields need to be corrected before we proceed.",
        variant: "destructive",
      });
      return;
    }

    const c = result.data;
    const lines = [
      "Hi Pilli Farm, I'd like to place this order:",
      "",
      ...buildOrderLines(),
      "",
      "— Delivery Details —",
      `Name: ${c.name}`,
      `Phone: +91 ${c.phone}`,
      `Address: ${c.address}`,
      `City: ${c.city}`,
      `Pincode: ${c.pincode}`,
      ...(c.notes ? [`Notes: ${c.notes}`] : []),
      "",
      "Please confirm availability and delivery. Thank you!",
    ];

    const url = `https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");

    toast({ title: "Opening WhatsApp", description: "Your order details have been prepared." });
    setOpen(false);
    onSubmitted?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="cd-name" className="flex items-center gap-1.5 text-sm">
              <User className="h-3.5 w-3.5 text-primary" /> Full Name
            </Label>
            <Input
              id="cd-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Rahul Sharma"
              maxLength={80}
              autoComplete="name"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cd-phone" className="flex items-center gap-1.5 text-sm">
              <Phone className="h-3.5 w-3.5 text-primary" /> Mobile Number
            </Label>
            <Input
              id="cd-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile number"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel"
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cd-address" className="flex items-center gap-1.5 text-sm">
              <Home className="h-3.5 w-3.5 text-primary" /> Delivery Address
            </Label>
            <Textarea
              id="cd-address"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="House / Flat no., Street, Landmark"
              rows={3}
              maxLength={300}
              autoComplete="street-address"
            />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cd-city" className="flex items-center gap-1.5 text-sm">
                <MapPin className="h-3.5 w-3.5 text-primary" /> City
              </Label>
              <Input
                id="cd-city"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="City"
                maxLength={60}
                autoComplete="address-level2"
              />
              {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cd-pincode" className="flex items-center gap-1.5 text-sm">
                <Hash className="h-3.5 w-3.5 text-primary" /> Pincode
              </Label>
              <Input
                id="cd-pincode"
                value={form.pincode}
                onChange={(e) => update("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit"
                inputMode="numeric"
                maxLength={6}
                autoComplete="postal-code"
              />
              {errors.pincode && <p className="text-xs text-destructive">{errors.pincode}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cd-notes" className="flex items-center gap-1.5 text-sm">
              <StickyNote className="h-3.5 w-3.5 text-primary" /> Notes <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="cd-notes"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Preferred delivery time, alternate contact, etc."
              rows={2}
              maxLength={300}
            />
            {errors.notes && <p className="text-xs text-destructive">{errors.notes}</p>}
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" variant="whatsapp" size="lg" className="w-full">
              <MessageCircle className="h-4 w-4" /> Send Order on WhatsApp
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
