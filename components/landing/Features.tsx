import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
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
                    <div className="order-2 md:order-1 text-2xl md:text-2xl font-light mb-6">
                        Effortlessly review demos of prospective artists with our intuitive content swiping system.
                        Swipe through demos, provide feedback, and compare versions, all through effective collaboration.
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="text-md font-bold text-gray-800 mb-3 text-center md:text-right">
                            Review Demos
                        </div>
                        <Card className="border border-gray-200">
                            <CardContent className="p-0">
                                <div className="relative aspect-video flex items-center justify-center bg-gray-50">
                                    <iframe
                                        className="absolute inset-0 h-full w-full"
                                        src="https://www.youtube-nocookie.com/embed/PRZrHzhpBpw?rel=0&modestbranding=1&playsinline=1"
                                        title="Viola demo"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* ROW 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="order-1 md:order-1">
                        <div className="text-md font-bold text-gray-800 mb-3 text-center md:text-left">
                            Real-Time Progress Updates
                        </div>
                        <Card className="border border-gray-200">
                            <CardContent className="p-0">
                                <div className="relative aspect-video flex items-center justify-center bg-gray-50">
                                    <iframe
                                        className="absolute inset-0 h-full w-full"
                                        src="https://www.youtube-nocookie.com/embed/PRZrHzhpBpw?rel=0&modestbranding=1&playsinline=1"
                                        title="Viola demo"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="order-2 md:order-2 text-2xl md:text-2xl font-light mb-6">
                        With the help of AI, get notified in real-time on the edits, comments, 
                        and changes your collaborators make on the projects you’re working on.
                    </div>
                </div>

                {/* ROW 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 text-2xl md:text-2xl font-light mb-6">
                        Never miss a beat in the creative process through our all-in-one dashboard. 
                        Monitor the status across projects and artists, explore detailed artist profiles, 
                        and seamlessly review their discography and timelines.
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="text-md font-bold text-gray-800 mb-3 text-center md:text-right">
                            All-in-One Dashboard
                        </div>
                        <Card className="border border-gray-200">
                            <CardContent className="p-0">
                                <div className="relative aspect-video flex items-center justify-center bg-gray-50">
                                    <iframe
                                        className="absolute inset-0 h-full w-full"
                                        src="https://www.youtube-nocookie.com/embed/PRZrHzhpBpw?rel=0&modestbranding=1&playsinline=1"
                                        title="Viola demo"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Features;
