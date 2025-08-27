'use client'

import { useToast } from "@/hooks/use-toast";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import AboutSection from "@/components/landing/AboutSection";
import CallToAction from "@/components/landing/CallToAction";

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
            <CallToAction onStartDemo={handleStartDemo} />
        </div>
    );
};

export default Index;