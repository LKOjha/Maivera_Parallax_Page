import React, { useEffect, useState } from "react";

const ExtendedCollection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // We'll create an array of 8 unique images for the collection
  const collectionImages = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    "https://images.unsplash.com/photo-1505110507506-af29c55ed19a",
    "https://images.unsplash.com/photo-1467951591042-f388365db261",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
    "https://images.unsplash.com/photo-1527719327859-c6ce80353573",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68"
  ];

  return (
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden">
      
      {/* --- ENHANCED 3D RING SECTION --- */}
      <section className="relative h-[300vh] bg-black">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
          
          {/* Section Header */}
          <div className="absolute top-20 text-center z-20">
            <h2 className="text-5xl font-black italic tracking-tighter">ARCHIVE 2026</h2>
            <p className="text-gray-500 tracking-[0.4em] uppercase text-xs mt-2">The Full Perspective</p>
          </div>

          {/* 3D Carousel with 8 Sides */}
          <div className="perspective-[2000px] w-full h-full flex items-center justify-center">
            <div 
              className="relative w-72 h-[450px] transition-transform duration-700 ease-out"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: `rotateY(${scrollY * 0.15}deg) rotateX(-5deg)` 
              }}
            >
              {collectionImages.map((img, i) => (
                <div 
                  key={i}
                  className="absolute inset-0 border border-white/10 rounded-lg overflow-hidden group"
                  style={{ 
                    transform: `rotateY(${i * 45}deg) translateZ(500px)`,
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <img 
                    src={img} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    alt={`Design ${i}`} 
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-300" />
                  <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-mono">CODE: 00{i+1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FLOATING STAGGERED GRID SECTION --- */}
      <section className="relative py-40 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {collectionImages.map((img, i) => (
            <div 
              key={`grid-${i}`}
              className="relative aspect-[3/4] rounded-sm overflow-hidden"
              style={{
                // Each column moves at a slightly different speed
                transform: `translateY(${(scrollY - 4000) * (0.05 * (i % 4 + 1))}px)`,
                marginTop: i % 2 === 0 ? '0px' : '80px' // Staggered visual layout
              }}
            >
              <img src={img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Gallery" />
            </div>
          ))}
        </div>

        {/* Floating Text behind the grid */}
        <div 
          className="absolute top-1/2 left-0 w-full text-center -z-10 opacity-5 select-none"
          style={{ transform: `translateY(${(scrollY - 5000) * -0.1}px)` }}
        >
          <h2 className="text-[25vw] font-black italic">MAIVERA</h2>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="h-screen flex items-center justify-center text-center">
         <div style={{ transform: `scale(${Math.min(1.2, Math.max(0.8, scrollY / 6000))})` }}>
            <h3 className="text-3xl font-light mb-6 text-gray-400 italic">Ready to make your mark?</h3>
            <button className="group relative px-12 py-4 overflow-hidden border border-white">
              <span className="relative z-10 font-bold group-hover:text-black transition-colors duration-300">EXPLORE FULL CATALOGUE</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
         </div>
      </section>

    </div>
  );
};

export default ExtendedCollection;