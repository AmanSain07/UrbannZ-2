import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/5 text-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <Image 
          src="/mascot.png" 
          alt="Mascot" 
          width={256} 
          height={256} 
          className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl hover:scale-110 transition-transform mb-8"
        />
        
        <h1 className="text-7xl md:text-9xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl md:text-4xl font-bold mb-6">
          Oops! This page got lost in the drip 👀
        </h2>
        
        <p className="text-muted-foreground text-lg mb-8 max-w-md">
          Looks like the fit you're looking for doesn't exist or just sold out. Let's get you back to the fresh drops.
        </p>
        
        <Link href="/">
          <button className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-primary/25">
            Go Back Home
          </button>
        </Link>
      </div>
    </div>
  );
}
