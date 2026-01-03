import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/products/FeaturedProducts";
import CategoryQuickNav from "@/components/home/CategoryQuickNav";
import Footer from "@/components/layout/Footer";
import VisualStory from "@/components/home/VisualStory";
import NewArrivalsCarousel from "@/components/home/NewArrivalsCarousel";
import CollectionsShowcase from "@/components/home/CollectionsShowcase";
import Newsletter from "@/components/home/Newsletter";
import SocialFeed from "@/components/home/SocialFeed";
import PressBar from "@/components/home/PressBar";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="overflow-x-hidden">
        {/* Category Icons Bar */}
        <CategoryQuickNav />

        {/* Hero Section */}
        <Hero />

        {/* Promotional Banner Blocks */}
        <section className="container mx-auto px-6 py-20">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto md:h-[600px]">
              <div className="relative group overflow-hidden rounded-[40px] h-[400px] md:h-full">
                 <Image 
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000"
                    alt="Lounge Wear"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                 <div className="absolute bottom-12 left-12 text-white">
                    <h3 className="text-4xl font-black mb-4 leading-tight">Lounge. <br /> Repeat.</h3>
                    <p className="text-white/80 mb-6 font-medium text-sm tracking-widest uppercase">UPTO 30% OFF ON SLEEPWEAR</p>
                    <Link href="/shop" className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-[10px] bg-primary text-white px-6 py-3 rounded-full hover:gap-4 transition-all">
                       Explore Now <ArrowRight size={14} />
                    </Link>
                 </div>
              </div>
              <div className="grid grid-rows-2 gap-8 h-[600px] md:h-full">
                 <div className="relative group overflow-hidden rounded-[40px]">
                    <Image 
                       src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000"
                       alt="Women Collection"
                       fill
                       sizes="(max-width: 768px) 100vw, 25vw"
                       className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                    <div className="absolute top-1/2 left-10 -translate-y-1/2 text-white">
                       <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter italic">Women Edit</h3>
                       <p className="text-[10px] font-black tracking-[0.3em] opacity-80 mb-6">CURATED LUXURY</p>
                        <Link href="/shop?category=women" className="w-12 h-12 bg-background/20 backdrop-blur-xl border border-white/30 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                           <ArrowRight size={20} />
                        </Link>
                    </div>
                 </div>
                 <div className="relative group overflow-hidden rounded-[40px]">
                    <Image 
                       src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&q=80&w=1000"
                       alt="Men Collection"
                       fill
                       sizes="(max-width: 768px) 100vw, 25vw"
                       className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                    <div className="absolute top-1/2 left-10 -translate-y-1/2 text-white">
                       <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter italic">Men Essentials</h3>
                       <p className="text-[10px] font-black tracking-[0.3em] opacity-80 mb-6">TIMELESS PIECES</p>
                        <Link href="/shop?category=men" className="w-12 h-12 bg-background/20 backdrop-blur-xl border border-white/30 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                           <ArrowRight size={20} />
                        </Link>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Featured Products / Trending Section */}
        <section className="bg-background py-24">
           <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                 <div>
                    <span className="text-primary font-black uppercase tracking-widest text-[10px] mb-2 block">— Hot Right Now</span>
                    <h2 className="text-6xl font-black tracking-tighter mb-4 italic uppercase leading-none">Trending<br />Collections</h2>
                 </div>
                  <Link href="/shop" className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest border border-border px-8 py-4 rounded-full hover:bg-foreground hover:text-background transition-all">
                     View All <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
              </div>
              <FeaturedProducts />
           </div>
        </section>

        {/* New Arrivals Carousel / "Carousel Effects" */}
        <NewArrivalsCarousel />

        {/* Visual Storytelling - First */}
        <VisualStory 
          image="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1600"
          title="The Art of Silence"
          subtitle="Aesthetica '26"
          description="We believe that true luxury speaks in whispers. Our Spring collection focuses on the dialogue between negative space and structural integrity."
        />

        {/* Collections Showcase Grid */}
        <CollectionsShowcase />

        {/* Visual Storytelling - Second */}
        <VisualStory 
          image="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600"
          title="Raw Textures"
          subtitle="Craftsmanship"
          description="Sourced from the heart of the Italian countryside, our raw silk and organic linen represent the pinnacle of sustainable textile engineering."
          reversed
        />

        {/* Social / Instagram Marquee */}
        <SocialFeed />

        {/* Newsletter Section */}
        <Newsletter />

        {/* Press / Trust Markers */}
        <PressBar />
      </main>

      <Footer />
    </div>
  );
}
