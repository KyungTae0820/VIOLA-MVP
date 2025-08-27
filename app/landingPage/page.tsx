'use client'

import { useToast } from "@/hooks/use-toast";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import AboutSection from "@/components/landing/AboutSection";
import CallToAction from "@/components/landing/CallToAction";
import CustomerReview from "@/components/landing/CustomerReview";

const Index = () => {
    const { toast } = useToast();

    const handleStartDemo = () => {
        toast({
            title: "Demo Starting Soon!",
            description: "We're setting up your personalized demo experience. You'll be redirected to the dashboard shortly.",
        });

        setTimeout(() => {
            window.location.href = '/login';
        }, 1000);
    };

    return (
        <div className="min-h-screen">
            <Hero onStartDemo={handleStartDemo} />
            <Features />
            <AboutSection />
            <section className="px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <CustomerReview
                        quote="Never miss a beat in the scouting process through our all-in-one dashboard. Monitor project status at all times and explore detailed artist profiles and discography."
                        author="Alex"
                        role="A&R Director"
                        company="Indie Labs"
                        avatarUrl="/assets/reviewer1.jpg"
                        rating={5}
                        className="bg-white/95"
                    />
                </div>
            </section>
            <CallToAction onStartDemo={handleStartDemo} />
        </div>
    );
};

export default Index;