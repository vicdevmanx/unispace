import { SatelliteDish, Users, Headphones, CalendarClock, Trophy, RefreshCcw, List } from 'lucide-react';

const Services = () => {
    const services = [
        {
            icon: CalendarClock,
            title: "Workspace Booking",
            description: "Book workspaces fast, anytime, anywhere.",
            features: [
                "Live seat and room status",
                "Tracks usage for rewards",
                "Mobile-first experience"
            ]
        },
        {
            icon: SatelliteDish,
            title: "Starlink Internet Access",
            description: "Reliable, high-speed internet across all hubs.",
            features: [
                "Powered by Starlink tech",
                "Consistent uptime for remote work",
                "Stream, upload, and code without limits"
            ]
        },
        {
            icon: Users,
            title: "Community Engagement",
            description: "Meet, chat, and grow with like minds.",
            features: [
                "Topic-based chatrooms",
                "Mentor and peer discovery",
                "React and reply to messages"
            ]
        }
    ]

    return (
        <div className="min-h-screen">

            {/* Services Grid */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-600 text-[2rem] md:text-4xl font-bold text-neutral-900 mb-4">
                            Our Services
                        </h2>
                        <p className="text-[1rem] text-neutral-700 max-w-2xl mx-auto">
                            From concept to deployment, we offer comprehensive solutions tailored to your unique business needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white/95 backdrop-blur-sm shadow-lg rounded-xl p-6 hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-[#1D3A8A]/20"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="bg-[#1D3A8A] bg-opacity-10 p-3 rounded-lg mr-4">
                                        <service.icon className="h-6 w-6 stroke-[#1D3A8A]" strokeWidth={2} />
                                    </div>
                                    <h3 className="text-[1.25rem] font-semibold text-neutral-900">{service.title}</h3>
                                </div>

                                <p className="text-[0.875rem] text-neutral-700 mb-4 leading-relaxed">
                                    {service.description}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {service.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center text-[0.875rem] text-neutral-700">
                                            <div className="w-2 h-2 bg-[#1D3A8A] rounded-full mr-3"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

         
            {/* CTA Section */}
            <section className="py-20 bg-[#1D3A8A] text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Users className="h-16 w-16 mx-auto mb-6 opacity-80" strokeWidth={1.5} />
                    <h2 className="font-600 text-[2rem] md:text-4xl font-bold mb-6">
                        Ready to level up your campus grind?
                    </h2>
                    <p className="text-[1rem] md:text-xl mb-8 opacity-90">
                        Whether you're here to study, build, collaborate, or just vibe — UniSpace gives you the tools, the people, and the rewards to make every session count.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="whitespace-nowrap bg-white text-[#1D3A8A] stroke-[#1D3A8A] px-8 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium flex items-center justify-center">
                            <Headphones className="h-5 w-5 mr-2" />
                            Join UniSpace
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Services;
