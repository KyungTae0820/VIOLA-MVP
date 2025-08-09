import { Button } from "@/components/ui";

interface CallToActionProps {
    onStartDemo: () => void;
}

const CallToAction = ({ onStartDemo }: CallToActionProps) => {
    return (
        <section className="py-24 px-6 bg-gradient-to-r from-[#7C3AED] via-[#9F2EF2] to-[#FDBA74] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
                <h2 className="text-4xl md:text-6xl font-bold mb-8">
                    Ready to transform your creative workflow?
                </h2>
                <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed max-w-3xl mx-auto">
                    Join thousands of artists, producers, and creative professionals who are already
                    using Viola.co to streamline their projects and enhance their collaborations.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Button
                        onClick={onStartDemo}
                        size="lg"
                        className="bg-white text-[#8e69fd] hover:bg-white px-12 py-6 text-lg font-semibold shadow-glow transition-all duration-300 hover:scale-105"
                    >
                        Join the Waitlist
                    </Button>
                </div>

                <div className="mt-12 text-sm opacity-75">
                    <p>No credit card required • Free 14-day trial • Cancel anytime</p>
                </div>
            </div>
            {/* Terms and Conditions */}
            <a
                href="/terms"
                className="absolute bottom-5 left-20 text-md underline text-white opacity-80 hover:opacity-100"
            >
                Terms and Conditions
            </a>
        </section>

    );
};

export default CallToAction;