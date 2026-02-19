import { useEffect, useRef, useState } from "react";

const About = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center bg-white px-6"
    >
      <div
        className={`max-w-3xl text-center transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
        }`}
      >
        <h2 className="text-4xl font-bold mb-6 text-gray-800">
          About Maivera
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Maivera is a custom T-shirt brand that lets you express your identity
          through fashion. We combine premium fabrics with limitless design
          possibilities so you can wear your creativity with pride.
        </p>
      </div>
    </section>
  );
};

export default About;
