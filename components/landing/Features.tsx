import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
    return (
        <section className="py-24 px-6 bg-gray-100">
            <div className="max-w-6xl mx-auto">
                {/* Section title */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Your Producer Toolbox</h2>
                    <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        A coherent toolbox of quality music industry features to help you manage creative projects,
                        collaborate better with your teammates, and build an extensive network.
                    </p>
                </div>

                {/* ROW 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="text-2xl md:text-2xl font-light mb-6">
                        Effortlessly manage your artists’ projects with our intuitive project management work-board.
                        Organize tracks, provide feedback, and compare versions and stems, all through effective collaboration.
                    </div>

                    <div>
                        <div className="text-md font-bold text-gray-800 mb-3 text-center md:text-right">
                            Production Management
                        </div>
                        <Card className="border border-gray-200">
                            <CardContent className="p-0">
                                <div className="relative aspect-video flex items-center justify-center bg-gray-50">
                                    <span className="text-gray-500 text-lg">Video or Animation</span>
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
                    <div>
                        <div className="text-md font-bold text-gray-800 mb-3 text-center md:text-left">
                            Real-Time Progress Updates
                        </div>
                        <Card className="border border-gray-200">
                            <CardContent className="p-0">
                                <div className="relative aspect-video flex items-center justify-center bg-gray-50">
                                    <span className="text-gray-500 text-lg">Video or Animation</span>
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

                    <div className="text-2xl md:text-2xl font-light mb-6">
                        With the help of AI, get notified in real-time on the edits, comments, and changes your
                        collaborators make on the projects you’re working on.
                    </div>
                </div>

                {/* ROW 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="text-2xl md:text-2xl font-light mb-6">
                        Never miss a beat in the creative process through our all-in-one dashboard. Monitor the
                        status across projects and artists, explore detailed artist profiles, and seamlessly review
                        their discography and timelines.
                    </div>

                    <div>
                        <div className="text-md font-bold text-gray-800 mb-3 text-center md:text-right">
                            All-in-One Dashboard
                        </div>
                        <Card className="border border-gray-200">
                            <CardContent className="p-0">
                                <div className="relative aspect-video flex items-center justify-center bg-gray-50">
                                    <span className="text-gray-500 text-lg">Video or Animation</span>
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
