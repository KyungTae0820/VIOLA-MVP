'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import AutoSubmitDemo from "@/components/animation/AutoSubmitDemo";
import DashboardAnimation from '@/components/animation/DashboardAnimation';
import Row2CatalogDemo from '../animation/CatalogGuidedDemo';

const Features = () => {
    const router = useRouter();

    return (
        <section className="py-24 px-6 bg-gray-100">
            <div className="max-w-6xl mx-auto">
                {/* Section title */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Your All-In-One A&R Toolkit</h2>
                    <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        From first listen to final contract. Use VIOLA to streamline
                        demo submissions to scouting, all the way to signing your next big artist.
                    </p>
                </div>

                {/* ROW 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="order-2 md:order-1 text-left md:pr-8">
                        <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            Review Demo Submissions Efficiently
                        </h3>
                        <p className="mt-4 text-base md:text-lg text-gray-700 leading-relaxed">
                            Effortlessly review demos sent to you by artists with our intuitive demo
                            submissions dashboard.
                        </p>
                        <button
                            type="button"
                            className="mt-6 inline-flex items-center gap-2 text-violet-600 font-semibold hover:underline"
                            onClick={() => router.push('/submissionPage')}
                        >
                            Explore Demo Submissions &gt;&gt;&gt;
                        </button>
                    </div>

                    <div className="order-1 md:order-2">
                        <Card className="border border-gray-200">
                            <CardContent className="p-0">
                                <div className="relative aspect-video bg-gray-50">
                                    <AutoSubmitDemo preview demoMode shrink={0.72} autoScroll interactive={false} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* ROW 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="order-1">
                        <Card className="border border-gray-200">
                            <CardContent className="p-0">
                                <div className="relative aspect-video bg-gray-50 overflow-hidden">
                                    <Row2CatalogDemo autoRun/> 
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="order-2 md:pl-8 text-left">
                        <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            Filter Your Catalog
                        </h3>
                        <p className="mt-4 text-base md:text-lg text-gray-700 leading-relaxed">
                            Our trained AI model evaluates and ranks demo submissions based on
                            compatibility and alignment with the label’s vision.
                        </p>
                    </div>
                </div>

                {/* ROW 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="order-2 md:order-1 text-left md:pr-8">
                        <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            All-in-One Dashboard
                        </h3>
                        <p className="mt-4 text-base md:text-lg text-gray-700 leading-relaxed">
                            Never miss a beat in the scouting process through our all-in-one dashboard.
                            Centralize reviewing demos, contacting, and finalizing contracts all-in-one place.
                        </p>
                    </div>
                    <div className="order-1 md:order-2">
                        <DashboardAnimation />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
