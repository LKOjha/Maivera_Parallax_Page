import { useEffect, useState } from "react";

const Hero = () => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1467951591042-f388365db261')",
          transform: `translateY(${offsetY * 0.5}px)`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Maivera</h1>
        <p className="text-xl md:text-2xl mb-6">Design Your Identity</p>
        <button className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition">
          Start Designing
        </button>
      </div>
    </section>
  );
};

export default Hero;
