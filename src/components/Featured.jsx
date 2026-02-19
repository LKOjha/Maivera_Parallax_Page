import { useEffect, useState, useRef } from "react"; // Added useRef here

const designs = [
  {
    id: 1,
    title: "Street Vibe",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    speed: 0.1, // Lower speeds usually look more professional
  },
  {
    id: 2,
    title: "Minimal Classic",
    img: "https://images.unsplash.com/photo-1505110507506-af29c55ed19a",
    speed: 0.2,
  },
  {
    id: 3,
    title: "Bold Graphic",
    img: "https://images.unsplash.com/photo-1467951591042-f388365db261",
    speed: 0.3,
  },
];

const Featured = () => {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const { top } = sectionRef.current.getBoundingClientRect();
      // Only update if the section is visible or near the viewport
      // 'top' is the distance from the top of the viewport to the element
      setOffset(top);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-gray-100 py-32 px-6 overflow-hidden"
    >
      <h2 className="text-4xl font-bold text-center mb-24 text-gray-800">
        Featured Designs
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {designs.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-2xl shadow-lg h-96"
            style={{
              // Using negative offset * speed to move it upwards as you scroll down
              transform: `translateY(${offset * item.speed}px)`,
              transition: "transform 0.1s ease-out", // Smooths out the jitter
            }}
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/30"></div>

            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Featured;