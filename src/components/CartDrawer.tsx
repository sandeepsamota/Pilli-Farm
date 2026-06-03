import { Minus, Plus, ShoppingBag, Trash2, MessageCircle, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart, formatINR } from "@/hooks/use-cart";
import { CustomerDetailsDialog } from "@/components/CustomerDetailsDialog";

export const CartDrawer = () => {
  const { items, count, subtotal, setQty, remove, clear } = useCart();

  const buildOrderLines = () => [
    ...items.map(
      (i, idx) => `${idx + 1}. ${i.name} (${i.size}) — ${i.qty} × ${i.price}`,
    ),
    "",
    `Subtotal: ${formatINR(subtotal)}`,
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label={`Open cart, ${count} items`}
          className="relative grid h-11 w-11 place-items-center rounded-full bg-card border border-border hover:bg-secondary transition-colors"
        >
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 grid h-5 min-w-5 px-1 place-items-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
              {count}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="font-display text-2xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Your Cart
            {count > 0 && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {count} {count === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center px-8 text-center">
            <div>
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary text-muted-foreground">
                <ShoppingBag className="h-7 w-7" />
              </span>
              <p className="mt-4 font-medium">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add products to compile a single WhatsApp order.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((i) => (
                <div key={i.id} className="flex gap-3 p-3 rounded-2xl bg-secondary/40 border border-border">
                  <img
                    src={i.img}
                    alt={i.name}
                    className="h-20 w-20 rounded-xl object-cover bg-card shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {i.brand}
                    </p>
                    <p className="font-medium text-sm leading-snug truncate">{i.name}</p>
                    <p className="text-xs text-muted-foreground">{i.size} • {i.price}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-border bg-background">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => setQty(i.id, i.qty - 1)}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{i.qty}</span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => setQty(i.id, i.qty + 1)}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        aria-label="Remove item"
                        onClick={() => remove(i.id)}
                        className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clear}
                className="w-full text-xs text-muted-foreground hover:text-destructive inline-flex items-center justify-center gap-1 py-2"
              >
                <X className="h-3.5 w-3.5" /> Clear cart
              </button>
            </div>

            <div className="border-t border-border p-6 space-y-4 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-2xl font-bold">{formatINR(subtotal)}</span>
              </div>
              <CustomerDetailsDialog
                buildOrderLines={buildOrderLines}
                onSubmitted={clear}
                title="Delivery Details"
                description="Tell us where to deliver — your full order will be sent to WhatsApp with these details."
                trigger={
                  <Button variant="whatsapp" size="lg" className="w-full">
                    <MessageCircle className="h-4 w-4" /> Checkout on WhatsApp
                  </Button>
                }
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
