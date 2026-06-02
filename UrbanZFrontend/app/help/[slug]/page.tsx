import { notFound } from "next/navigation";

export default function HelpSubPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const content: Record<string, { title: string; body: string }> = {
    returns: {
      title: "Returns & Refunds",
      body: "We have a 7-day hassle-free return policy. If the vibe doesn't match, send it back. Note: Custom items are non-refundable unless defective.",
    },
    shipping: {
      title: "Shipping Policy",
      body: "We ship PAN India. Standard shipping takes 3-5 business days. Express delivery available in select metro cities. Free shipping on orders above ₹999.",
    },
    privacy: {
      title: "Privacy Policy",
      body: "Your data is safe with us. We only use your info to ship your fits and send you updates. We don't sell your data to third parties. Period.",
    },
  };

  const pageData = content[slug];

  if (!pageData) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Topic Not Found</h1>
        <p className="text-muted-foreground">We couldn't find the help topic you were looking for.</p>
      </div>
    );
  }

  return (
    <div className="container py-20 max-w-2xl">
      <h1 className="text-4xl font-black mb-8">{pageData.title}</h1>
      <div className="prose dark:prose-invert">
        <p className="text-lg leading-relaxed">{pageData.body}</p>
      </div>
    </div>
  );
}
