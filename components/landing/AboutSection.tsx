import { Card, CardContent } from "@/components/ui";

const AboutSection = () => {
    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
                            Redefining creative collaboration
                        </h2>
                        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                VIOLA is not only an A&R toolkit, but a platform designed for A&Rs looking to rapidly enhance the workflow of managing demos. 
                            </p>
                            <p>
                                We at VIOLA understand the frustration of manually sifting through demos, in hopes of finding the right track for the artists. 
                                But when it takes hours, it’s simply inefficient when keeping up in today’s fast-paced and demanding society.
                            </p>
                            <p>
                                At VIOLA, producers and songwriters can upload their demos and unreleased tracks internally for you to review. 
                                With the help of [name], our AI system, you can prompt what you are looking for and your demos will be ranked and recommended based on it, 
                                saving you loads of time in finding best fit demos and tracks for artists.
                            </p>
                            <p>
                                With the ability to pitch and contact the other side, VIOLA streamlines the whole A&R scouting process, 
                                making life easier for the eyes and ears of the music industry.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-0 bg-[linear-gradient(135deg,_#A78BFA_0%,_#8B5CF6_35%,_#7C3AED_65%,_#FCD34D_100%)] text-white shadow-elegant">
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-semibold mb-4">For Artists</h3>
                                <p className="text-white/90 leading-relaxed">
                                    Manage your creative projects, collaborate with other artists,
                                    and build your professional network all in one place.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 bg-white shadow-elegant">
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-semibold text-[#8a2cd7] mb-4">For Labels</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Oversee multiple artists and projects with comprehensive analytics,
                                    streamlined communication, and powerful organizational tools.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 bg-[#F3F4F6] shadow-elegant">
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-semibold text-[#8a2cd7] mb-4">For Producers</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Connect with artists, manage your production pipeline, and track
                                    project progress with tools built for your workflow.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;