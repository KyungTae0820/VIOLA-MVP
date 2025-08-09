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
                                Viola.co is more than just a project management platform—it's a comprehensive
                                ecosystem designed specifically for the creative industry. We understand the unique
                                challenges artists face when collaborating across different time zones, managing
                                multiple projects, and maintaining professional relationships.
                            </p>
                            <p>
                                Our SaaS platform combines powerful project management capabilities with
                                industry-specific tools that help artists, producers, and creative professionals
                                streamline their workflow and focus on what they do best: creating.
                            </p>
                            <p>
                                From solo artists managing their first album to established labels coordinating
                                multiple releases, Viola.co scales with your needs and grows with your career.
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