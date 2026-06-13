import { notFound } from "next/navigation";

export default function HelpSubPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const content: Record<string, { title: string; body: React.ReactNode }> = {
    returns: {
      title: "Returns & Refunds Policy",
      body: (
        <div className="space-y-4">
          <p>We want you to be completely satisfied with your UrbanZ purchases. If you're not entirely happy, we've got you covered with our 7-day hassle-free return policy.</p>
          <h3 className="font-bold text-xl mt-6">Conditions for Return</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Items must be unused, unwashed, and in their original packaging with all tags intact.</li>
            <li>Customized, personalized, or Print-on-Demand (POD) items are strictly non-refundable unless there is a manufacturing defect or printing error.</li>
            <li>Clearance items or items marked as 'Final Sale' cannot be returned.</li>
          </ul>
          <h3 className="font-bold text-xl mt-6">Refund Process</h3>
          <p>Once we receive and inspect your return, we will initiate a refund to your original payment method. Please allow 5-7 business days for the amount to reflect in your account.</p>
        </div>
      ),
    },
    shipping: {
      title: "Shipping Policy",
      body: (
        <div className="space-y-4">
          <p>UrbanZ partners with trusted local and national carriers to ensure your fresh fits reach you on time.</p>
          <h3 className="font-bold text-xl mt-6">Processing Time</h3>
          <p>Standard orders are processed within 24-48 hours. Custom designs (embroidery or print) may take up to 3-5 business days for processing before they are dispatched.</p>
          <h3 className="font-bold text-xl mt-6">Shipping Rates & Estimates</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Standard Shipping:</strong> 3-5 business days (₹50, Free on orders over ₹999).</li>
            <li><strong>Hyperlocal Delivery:</strong> Same-day delivery available in select zones for eligible products (₹100).</li>
          </ul>
          <h3 className="font-bold text-xl mt-6">Order Tracking</h3>
          <p>Once your order has shipped, you will receive a tracking number via email and WhatsApp. You can also track your order directly from your dashboard.</p>
        </div>
      ),
    },
    privacy: {
      title: "Privacy Policy",
      body: (
        <div className="space-y-4">
          <p>Your privacy is important to us. UrbanZ Retail Pvt Ltd ("we", "us", or "our") respects your privacy and is committed to protecting your personal data.</p>
          <h3 className="font-bold text-xl mt-6">Information We Collect</h3>
          <p>We collect information you provide directly to us, such as your name, email address, phone number, shipping address, and payment information when you register, make a purchase, or interact with our platform.</p>
          <h3 className="font-bold text-xl mt-6">How We Use Your Information</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>To process and fulfill your orders, including sending order confirmations and shipping updates.</li>
            <li>To communicate with you about products, services, offers, and events.</li>
            <li>To improve our platform, customer service, and overall user experience.</li>
          </ul>
          <h3 className="font-bold text-xl mt-6">Data Security</h3>
          <p>We implement industry-standard security measures to maintain the safety of your personal information. We do not sell or trade your personal data to third parties.</p>
        </div>
      ),
    },
    terms: {
      title: "Terms & Conditions",
      body: (
        <div className="space-y-4">
          <p>Welcome to UrbanZ. By accessing or using our website, you agree to be bound by these Terms & Conditions.</p>
          <h3 className="font-bold text-xl mt-6">Use of the Platform</h3>
          <p>You must be at least 18 years old or visiting under the supervision of a parent or guardian. You agree to provide accurate and current information during registration.</p>
          <h3 className="font-bold text-xl mt-6">Intellectual Property</h3>
          <p>All content on this site, including text, graphics, logos, and images, is the property of UrbanZ Retail Pvt Ltd or its suppliers and protected by copyright laws. You may not reproduce, distribute, or create derivative works without explicit permission.</p>
          <h3 className="font-bold text-xl mt-6">User-Submitted Designs (Custom Orders)</h3>
          <p>By submitting a design for a custom order, you affirm that you have the right to use the image/design and that it does not infringe on any third-party intellectual property rights. We reserve the right to reject any design that violates these terms or our community guidelines.</p>
        </div>
      )
    }
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
