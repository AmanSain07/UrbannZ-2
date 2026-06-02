"use client";

import { useState, use, useEffect } from "react";

import { useStore } from "@/lib/store-context";
import { Star, Truck, ShieldCheck, Heart, Share2, ArrowLeft, RefreshCcw, Info, Minus, Plus, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";
import Image from "next/image";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { cn, formatPrice, FALLBACK_IMAGE } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/product-card";

export default function ProductPage(props: { params: Promise<{ id: string }> }) {
  // Correctly unwrap params using React.use()
  const params = use(props.params);
  const { products, addToWishlist, isLoading } = useStore();
  const product = products.find((p) => String(p.id) === params.id);
  // New States
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isRefundOpen, setIsRefundOpen] = useState(false);



  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  // Mock colors for now
  const colors = ["Black", "White", "Navy", "Beige"];

  // Use the array of images from the product
  const productImages = product ? (Array.isArray(product.image) ? product.image : [product.image]) : [];

  // Set initial image safely
  useEffect(() => {
    if (productImages.length > 0 && !activeImage) {
      setActiveImage(productImages[0]);
    }
  }, [product, productImages, activeImage]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) {
      toast("Please select both size and color!", "error");
      return;
    }
    addToCart({
      productId: String(product.id),
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      image: Array.isArray(product.image) ? product.image[0] : product.image
    });
    toast("Added to cart successfully!");
  };

  const handleBuyNow = () => {
    if (!product || !selectedSize || !selectedColor) {
      alert("Please select both size and color!");
      return;
    }
    addToCart({
      productId: String(product.id),
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      image: Array.isArray(product.image) ? product.image[0] : product.image
    });
    router.push("/cart");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black">404</h1>
          <p className="text-muted-foreground">This fit doesn't exist.</p>
          <Link href="/shop" className="text-primary hover:underline">Go back to shop</Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen pb-20 pt-10">
      <div className="container px-4 md:px-6">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Image Section */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative rounded-[2.5rem] overflow-hidden bg-secondary/10 aspect-[4/5] md:aspect-square group cursor-zoom-in"
            >
              <ImageWithFallback
                src={activeImage || productImages[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-150 origin-center"
                priority
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center hover:bg-white text-black transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </motion.div>

            {/* Thumbnails Gallery */}
            {productImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all",
                      activeImage === img ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <div className="relative w-full h-full">
                      <ImageWithFallback src={img || FALLBACK_IMAGE} alt={`View ${idx + 1}`} fill className="object-cover" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                {product.badges?.map((badge, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold flex items-center gap-1">
                    <Star size={12} className="fill-current" /> {badge}
                  </span>
                ))}
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold flex items-center gap-1 border border-gray-200">
                  <ShieldCheck size={12} /> UrbanZ Assured
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-balance mb-2">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-black">{formatPrice(product.price)}</span>
                <span className="text-xl text-muted-foreground line-through font-medium">
                  {formatPrice(product.price * 1.4)}
                </span>
                <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded-lg text-sm">
                  40% OFF
                </span>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              {product.description} Engineered for the urban nomad. Ultra-breathable, sustainable materials, and a fit that adapts to your movement.
            </p>

            {/* Controls: Size, Color, Quantity */}
            <div className="space-y-6">
              {/* Size */}
              <div>
                <label className="text-sm font-bold block mb-2">Select Size</label>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-12 h-12 rounded-xl border border-input hover:border-primary hover:bg-primary/5 font-bold transition-all focus:ring-2 focus:ring-primary focus:border-primary",
                        selectedSize === size && "bg-primary text-white border-primary"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-sm font-bold block mb-2">Select Color</label>
                <div className="flex gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "px-4 py-2 rounded-xl border border-input hover:border-primary hover:bg-primary/5 font-bold transition-all text-sm",
                        selectedColor === color && "bg-primary text-white border-primary"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm font-bold block mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl border border-input flex items-center justify-center hover:bg-secondary/10 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl border border-input flex items-center justify-center hover:bg-secondary/10 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className="flex-1 py-4 rounded-full bg-secondary text-secondary-foreground font-bold text-lg hover:bg-secondary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-border"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!selectedSize || !selectedColor}
                className="flex-1 py-4 rounded-full bg-primary text-white font-bold text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button onClick={() => product && addToWishlist(product)} className="w-16 flex items-center justify-center rounded-full border border-input hover:bg-secondary/20 hover:border-secondary transition-colors">
                <Heart size={24} />
              </button>
            </div>


            <div className="pt-8 space-y-4">
              <div className="p-4 rounded-2xl bg-secondary/5 flex items-start gap-4">
                <Truck className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-bold">Lightning Shipping</h4>
                  <p className="text-sm text-muted-foreground">Get it within 2 hours in selected zones.</p>
                </div>
              </div>

              {/* Refund Policy */}
              {product.hasRefundPolicy ? (
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                  <button
                    onClick={() => setIsRefundOpen(!isRefundOpen)}
                    className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-gray-50 transition-colors font-bold text-left"
                  >
                    <span className="flex items-center gap-3"><RefreshCcw className="w-5 h-5 text-primary" /> Return & Refund</span>
                    <span className={`transform transition-transform ${isRefundOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isRefundOpen ? "auto" : 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 text-sm text-muted-foreground leading-relaxed">
                      Easy 7-day returns. Item must be in original condition with tags. Refund processed to source within 24hrs of pickup.
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 rounded-2xl flex items-center gap-3 border border-red-100 text-red-900">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">No Returns Applicable</h4>
                    <p className="text-xs opacity-80">This item is made-to-order or final sale.</p>
                  </div>
                </div>
              )}
            </div>

          </motion.div>
        </div>

        {/* Full Details & Highlights Section */}
        <div className="mt-20">
          <div className="space-y-8 max-w-4xl">
            <div>
              <h2 className="text-3xl font-black mb-6">Product Highlights</h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {product.highlights?.map((highlight, idx) => (
                  <li key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-primary fill-current" />
                    </div>
                    <span className="font-bold text-sm">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-black mb-6">The Full Deets</h2>
              <div className="p-8 rounded-[2rem] bg-secondary/5 border border-secondary/10 text-lg leading-relaxed text-muted-foreground">
                {product.details}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-20 mb-20">
          <h2 className="text-3xl font-black mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.slice(0, 4).map(similar => (
                <div key={similar.id} className="h-full">
                  <ProductCard product={similar} />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No similar products found.</p>
            )}
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/shop">
              <button className="px-8 py-4 rounded-full border-2 border-black dark:border-white font-bold text-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                See More Fits
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
