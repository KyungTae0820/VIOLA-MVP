import { Button } from "@/components/ui";

interface HeroProps {
    onStartDemo: () => void;
}

const Hero = ({ onStartDemo }: HeroProps) => {
    return (
        <section className="relative min-h-screen flex flex-col items-start justify-start bg-[linear-gradient(135deg,_#7C3AED_0%,_#8B5CF6_15%,_#A78BFA_30%,_#C4B5FD_48%,_#E9D5FF_65%,_#FDE68A_100%)] overflow-hidden pt-40">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            {/* Top-left brand */}
            <div className="absolute top-6 left-6 z-20 text-white">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">VIOLA.</h1>
                <div className="mt-1 h-0.5 w-27 bg-white/80"></div>
            </div>

            {/* Center content (title removed) */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 text-center text-white px-6 w-full max-w-4xl">
                <div className="mb-8">
                    {/* removed big h1 + underline */}
                    <p className="text-xl md:text-6xl font-semibold mb-6 leading-tight max-w-2xl mx-auto">
                        Your Harmonious Hub of
                        Music Collaboration
                    </p>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl md:text-2xl font-light mb-6">
                        Harmoniously streamline the workflow and management of your music projects through
                        our tailored project management and collaboration tools, meant specifically for the music industry .
                    </h2>
                    <Button
                        onClick={onStartDemo}
                        size="lg"
                        className="bg-white text-[#8e69fd] hover:bg-white px-12 py-6 text-lg font-semibold shadow-glow transition-all duration-300 hover:scale-105"
                    >
                        Join the Waitlist
                    </Button>
                    {/* Video / Animation */}
                    <div className="mt-4 mx-auto w-full max-w-md relative aspect-video rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/20 z-10">
                        <iframe
                            className="absolute inset-0 h-full w-full"
                            src="https://www.youtube-nocookie.com/embed/PRZrHzhpBpw?rel=0&modestbranding=1&playsinline=1"
                            title="Viola demo"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                    <p className="text-xl md:text-1xl font-light mb-8 leading-relaxed max-w-2xl mx-auto">
                        Features Requested by Individuals of Music Businesses
                    </p>
                </div>
            </div>

            {/* Carousel */}
            {/* Carousel (seamless infinite loop) */}
            <div className="absolute bottom-17 left-0 w-full overflow-hidden">
                <div className="viola-marquee">
                    {/* track content (길게 반복) */}
                    <div className="viola-track">
                        {Array(2) // 두 번 반복
                            .fill([
                                "Company A",
                                "Company B",
                                "Company C",
                                "Company D",
                                "Company E",
                                "Company F",
                                "Company G",
                            ])
                            .flat()
                            .map((name, i) => (
                                <span
                                    key={i}
                                    className="mx-8 inline-block text-white text-lg font-semibold whitespace-nowrap"
                                >
                                    {name}
                                </span>
                            ))}
                    </div>
                </div>

                <style jsx global>{`
                    .viola-marquee {
                    display: flex;
                    white-space: nowrap;
                    }
                    .viola-track {
                    display: inline-flex;
                    animation: viola-scroll 20s linear infinite;
                    }
                    @keyframes viola-scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                    }
                `}</style>
            </div>


            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-70">
                <div className="animate-bounce">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default Hero;
