import React, { useEffect, useState, useCallback, useRef } from "react";

/* ---------------- Custom Hook for Scroll Progress ---------------- */
// Moved outside to stay clean. Calculates 0 to 1 based on element position.
const useCardScrollProgress = (ref) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            // Progress: 0 when bottom enters, 1 when top leaves
            const newProgress = 1 - rect.top / viewHeight;
            setProgress(Math.min(Math.max(newProgress, 0), 1));
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll(); // Initial check
        return () => window.removeEventListener("scroll", onScroll);
    }, [ref]);

    return progress;
};

/* ---------------- Collection Card Component ---------------- */
const CollectionCard = ({ item }) => {
    const cardRef = useRef(null);
    const cardProgress = useCardScrollProgress(cardRef);

    const rotationX = (1 - cardProgress) * 45;
    const translateY = (1 - cardProgress) * 100;
    const opacity = Math.min(cardProgress * 1.2, 1);

    // Zig-zag logic
    const isRight = item % 2 === 0;

    return (
        <div
            ref={cardRef}
            className={`relative w-full flex ${isRight ? "md:justify-end" : "md:justify-start"}`}
            style={{ perspective: "1200px" }}
        >
            {/* ✅ Horizontal connector to spine */}
            <div
                className="hidden md:block absolute top-1/2 h-px bg-white/20"
                style={{
                    width: "120px",
                    left: isRight ? "50%" : "auto",
                    right: isRight ? "auto" : "50%",
                    transform: "translateY(-50%)",
                }}
            />

            {/* CARD */}
            <div
                className={`
                    group relative
                    w-full max-w-sm
                    aspect-[3/4]
                    bg-[#111]
                    border border-white/10
                    rounded-2xl
                    overflow-hidden
                    transition-all duration-200 ease-out
                `}
                style={{
                    transform: `rotateX(${rotationX}deg) translateY(${translateY}px)`,
                    opacity,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Product Image */}
                <img
                    src={`https://picsum.photos/800/1000?random=${item + 10}`}
                    alt="T-shirt Design"
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                    style={{
                        transform: `translateY(${(cardProgress - 0.5) * 40}px)`
                    }}
                />

                {/* Overlay Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <div style={{ transform: "translateZ(30px)" }}>
                        <span className="text-white/40 font-mono text-sm">
                            0{item} — PRODUCT
                        </span>

                        <h3 className="text-3xl md:text-4xl font-black uppercase mt-2 italic">
                            MAI Tee {item}
                        </h3>

                        <p className="max-w-xs text-gray-400 mt-3 text-sm leading-relaxed">
                            Premium cotton. Engineered fit. Designed for expression.
                        </p>

                        <button className="mt-6 px-6 py-2 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-colors">
                            View Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};



/* ---------------- Main Page ---------------- */
const ParallaxPage = () => {
    const [scrollY, setScrollY] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [maiTilt, setMaiTilt] = useState(0);

    const maiRef = useRef(null);
    const ticking = useRef(false);

    // Optimized Scroll Handler
    const handleScroll = useCallback(() => {
        if (!ticking.current) {
            window.requestAnimationFrame(() => {
                setScrollY(window.scrollY);

                // Handle T-Shirt Tilt logic inside the scroll loop for performance
                if (maiRef.current) {
                    const rect = maiRef.current.getBoundingClientRect();
                    const viewHeight = window.innerHeight;
                    const centerProgress = 1 - (rect.top + rect.height / 2) / viewHeight;
                    const tilt = Math.min(Math.max((centerProgress - 0.5) * 40, -20), 20);
                    setMaiTilt(tilt);
                }

                ticking.current = false;
            });
            ticking.current = true;
        }
    }, []);

    const handleMouseMove = useCallback((e) => {
        setMousePos({
            x: e.clientX / window.innerWidth - 0.5,
            y: e.clientY / window.innerHeight - 0.5,
        });
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [handleScroll, handleMouseMove]);

    const mosaicProgress = Math.max(0, scrollY - 3000);

    return (
        <div className="bg-[#050505] text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
            {/* Custom Cursor */}
            <div
                className="fixed w-8 h-8 border border-white rounded-full pointer-events-none z-[100] transition-transform duration-300 ease-out hidden md:block"
                style={{
                    transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50}px)`,
                    left: "50%",
                    top: "50%",
                }}
            />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853')",
                        transform: `translateY(${scrollY * 0.4}px) rotate(${scrollY * 0.01}deg)`,
                        filter: "brightness(0.4)",
                    }}
                />
                <div className="relative z-10 text-center uppercase tracking-[0.5rem] md:tracking-[1rem]">
                    <h1 className="text-[12vw] font-black leading-none" style={{ transform: `translateY(${scrollY * -0.2}px)` }}>
                        Maivera
                    </h1>
                    <p className="text-lg opacity-60" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
                        Digital Fabric & Soul
                    </p>
                </div>
                <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-[#050505] to-transparent z-20" />
            </section>

            {/* Collection Section */}
            <section className="relative bg-[#050505] py-24 md:py-40 px-6">
                <div className="max-w-7xl mx-auto mb-20 text-center relative  ">
                    <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">The Collection</h2>
                    <div className="w-20 h-1 bg-white m-auto mt-5"></div>
                </div>
                {/* Vertical Spine (starts at Card 1) */}

                <div className="relative max-w-5xl mx-auto flex flex-col gap-24">

                    {/* Vertical spine — starts from Card 1 */}
                    <div className="hidden md:block absolute left-1/2 top-[180px] bottom-0 w-px bg-white/20" />

                    {[1, 2, 3, 4].map((item, index) => (
                        <CollectionCard
                            key={item}
                            item={item}
                            isRight={index % 2 !== 0}
                        />
                    ))}
                </div>
            </section>

            {/* Mosaic Section */}
            <section className="relative h-[150vh] bg-white overflow-hidden">
                <div className="sticky top-0 h-screen flex items-center justify-center">
                    <ul
                        className="grid gap-[1vmin] list-none p-0 m-0"
                        style={{
                            "--tile-size": "calc(50vmin / 3)",
                            gridTemplateColumns: "repeat(9, var(--tile-size))",
                            gridTemplateRows: "repeat(9, var(--tile-size))",
                            transform: `scale(${Math.min(1.2, 0.4 + mosaicProgress * 0.0005)}) rotate(${Math.min(270, mosaicProgress * 0.08)}deg)`,
                            transition: "transform 0.1s linear",
                        }}
                    >
                        {[
                            { x1: 2, x2: 6, y1: 1, y2: 4, img: 1 },
                            { x1: 6, x2: 8, y1: 2, y2: 4, img: 2 },
                            { x1: 1, x2: 4, y1: 4, y2: 7, img: 3 },
                            { x1: 4, x2: 7, y1: 4, y2: 7, img: 4 },
                            { x1: 7, x2: 9, y1: 4, y2: 6, img: 5 },
                            { x1: 2, x2: 4, y1: 7, y2: 9, img: 6 },
                            { x1: 4, x2: 7, y1: 7, y2: 10, img: 7 },
                            { x1: 7, x2: 10, y1: 6, y2: 9, img: 8 },
                        ].map((tile, i) => (
                            <li
                                key={i}
                                className="relative overflow-hidden rounded-lg bg-gray-300/20"
                                style={{ gridColumn: `${tile.x1} / ${tile.x2}`, gridRow: `${tile.y1} / ${tile.y2}` }}
                            >
                                <img
                                    src={`https://picsum.photos/600/600?random=${tile.img + 20}`}
                                    alt=""
                                    className="absolute top-1/2 left-1/2 min-w-[200%] h-[200%] object-cover"
                                    style={{
                                        transform: `translate(-50%, -50%) rotate(${Math.max(-270, -mosaicProgress * 0.08)}deg)`,
                                        transition: "transform 0.1s linear",
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* T-Shirt Section with Fixed Scrolling Tilt */}
            <section className="relative min-h-screen bg-white text-black py-24 md:py-40 px-6 md:px-10 overflow-hidden">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">

                    {/* LEFT — T-SHIRT CARD */}
                    <div ref={maiRef} className="relative group flex justify-center">
                        <div
                            className="relative w-full max-w-sm aspect-[3/4] bg-gray-100 rounded-[2rem] flex items-center justify-center shadow-inner overflow-hidden"
                            style={{ perspective: "1500px" }}
                        >
                            <div
                                className="relative w-64 h-80 bg-black rounded-xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] flex items-center justify-center text-white font-black text-6xl italic transition-transform duration-200 ease-out"
                                style={{
                                    transform: `rotateY(${maiTilt}deg) rotateX(${-maiTilt * 0.5}deg) rotateZ(${maiTilt * 0.1}deg)`,
                                    transformStyle: "preserve-3d",
                                    willChange: "transform"
                                }}
                            >
                                <span style={{ transform: "translateZ(60px)" }}>MAI.</span>

                                {/* 3D Reflection Glare */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none"
                                    style={{ transform: `translateX(${maiTilt * 2}px)` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — CONTENT */}
                    <div className="text-center md:text-left">
                        <h2 className="text-5xl md:text-7xl font-black mb-8 leading-none">Your Identity, <br /> Embodied.</h2>
                        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
                            We don't just print shirts. We build vessels for your creative expression.
                            Our 3D knit technology ensures every pixel of your design is captured in premium cotton.
                        </p>
                        <button className="px-12 py-5 bg-black text-white text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
                            Launch Lab 1.0
                        </button>
                    </div>
                </div>

                <div className="absolute -bottom-10 md:-bottom-20 -right-10 md:-right-20 text-[10rem] md:text-[20rem] font-black text-gray-100 select-none -z-10">
                    CUSTOM
                </div>
            </section>

            {/* Footer */}
            <footer className="min-h-[40vh] py-20 bg-black flex flex-col items-center justify-center border-t border-white/10">
                <div className="text-center">
                    <h3 className="text-gray-500 text-sm mb-4 tracking-[0.3em] uppercase">Join the cult</h3>
                    <p className="text-3xl md:text-6xl font-light underline underline-offset-8 decoration-1">
                        hello@maivera.design
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ParallaxPage;