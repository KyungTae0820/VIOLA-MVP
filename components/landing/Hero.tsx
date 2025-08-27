import { Button } from "@/components/ui";
import InfiniteCarousel from '@/components/landing/InfiniteCarousel';

interface HeroProps {
    onStartDemo: () => void;
}

const Hero = ({ onStartDemo }: HeroProps) => {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-start
                    bg-[linear-gradient(135deg,_#7C3AED_0%,_#8B5CF6_15%,_#A78BFA_30%,_#C4B5FD_48%,_#E9D5FF_65%,_#FDE68A_100%)]
                    overflow-hidden pt-40 pb-20">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="absolute top-6 left-6 z-20 text-white">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">VIOLA.</h1>
                <div className="mt-1 h-0.5 w-27 bg-white/80"></div>
            </div>


            {/* Center content (title removed) */}
            <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center text-white">
                <div className="mb-8">
                    {/* removed big h1 + underline */}
                    <p className="text-xl md:text-6xl font-semibold mb-6 leading-tight max-w-2xl mx-auto">
                        Only Listen to Bangers.
                    </p>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-light mb-6">
                        You deserve better than inbox chaos. Get 20 brand-consistent tracks in minutes without having to go through 300 demos.
                        No auto-rejects. Just prioritized contenders trained on your catalog.
                    </h2>

                    <Button
                        onClick={onStartDemo}
                        size="lg"
                        className="bg-white text-[#8e69fd] hover:bg-white px-12 py-6 text-lg font-semibold shadow-glow transition-all duration-300 hover:scale-105"
                    >
                        Join the Waitlist
                    </Button>

                    <div className="text-md opacity-75">
                        <p>$39/mo or $239/yr. Cancel Anytime.</p>
                    </div>

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
                    <p className="text-xl font-light leading-relaxed max-w-2xl mx-auto">
                        Built For Visionaries. Trusted by Established Indie Labels
                    </p>
                </div>
            </div>

            <div className="flex-1" />

            {/* Carousel - seamless */}
            <div className="mt-8 w-full">
                <InfiniteCarousel
                    items={[
                        'Company A', 'Company B', 'Company C', 'Company D', 'Company E', 'Company F', 'Company G',
                    ]}
                    speed={30}                      
                    gapClassName="gap-12 md:gap-16"    
                    className="h-12 md:h-16"
                    itemClassName="text-white text-base md:text-lg" 
                />
            </div>

            {/* Scroll indicator */}
            <div className="mt-6 text-white opacity-70">
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
