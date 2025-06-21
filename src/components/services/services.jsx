import { Code2, Palette, Smartphone, Globe, Zap, Shield, Users, Headphones, CalendarClock, Trophy, RefreshCcw, List } from 'lucide-react';

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
            icon: Users,
            title: "Community Engagement",
            description: "Meet, chat, and grow with like minds.",
            features: [
                "Topic-based chatrooms",
                "Mentor and peer discovery",
                "React and reply to messages"
            ]
        },
        {
            icon: Trophy,
            title: "Gamification & Rewards",
            description: "Earn points for being active and consistent.",
            features: [
                "Get rewards for engagement",
                "Climb the leaderboard",
                "Redeem points for perks"
            ]
        },
        {
            icon: RefreshCcw,
            title: "Referral Program",
            description: "Invite friends and earn UniPoint bonuses.",
            features: [
                "200 points per referral",
                "Bonus for invitees too",
                "Referral tracking dashboard"
            ]
        },
        {
            icon: List,
            title: "Activity History",
            description: "Track bookings and point transactions.",
            features: [
                "Booking logs by date",
                "Point earning history",
                "Transparent usage stats"
            ]
        }
    ]



    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "CEO, TechStart",
            content: "UniSpace transformed our vision into a stunning digital experience. Their attention to detail is unmatched.",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
        },
        {
            name: "Michael Chen",
            role: "CTO, InnovateLab",
            content: "The team's expertise in modern technologies helped us scale our platform efficiently and securely.",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
        },
        {
            name: "Emily Rodriguez",
            role: "Product Manager, GrowthCorp",
            content: "Working with UniSpace was seamless. They delivered beyond our expectations on time and within budget.",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
        }
    ];

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
                                <div className="flex flex-col items-start gap-2 mb-4">
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

            {/* Process Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-600 text-[2rem] md:text-4xl font-bold text-neutral-900 mb-4">
                            Our Process
                        </h2>
                        <p className="text-[1rem] text-neutral-700 max-w-2xl mx-auto">
                            A proven methodology that ensures successful project delivery from start to finish.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Register",
                                description: "Users sign up with their email, verify their account, and personalize their profile with interests and location."
                            },
                            {
                                step: "02",
                                title: "Book Workspace",
                                description: "Search by location and features, then reserve a space with real-time availability and simple payment flow."
                            },
                            {
                                step: "03",
                                title: "Join Community",
                                description: "Enter category forums, chatrooms, and mentorship groups to post, react, and engage with others actively."
                            },
                            {
                                step: "04",
                                title: "Earn & Redeem",
                                description: "Gain UniPoints from bookings, referrals, and streaks — then redeem for discounts, snacks, and unlockables."
                            }
                        ]
                            .map((item, index) => (
                                <div key={index} className="text-center">
                                    <div className="bg-[#1D3A8A] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[1.25rem] font-bold">
                                        {item.step}
                                    </div>
                                    <h3 className="text-[1.25rem] font-semibold text-neutral-900 mb-2">{item.title}</h3>
                                    <p className="text-[0.875rem] text-neutral-700">{item.description}</p>
                                </div>
                            ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-unispace-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-600 text-[2rem] md:text-4xl font-bold text-neutral-900 mb-4">
                            What Our Users Are Saying
                        </h2>
                        <p className="text-[1rem] text-neutral-700">
                            Real feedback from real UniSpacers leveling up their hustle.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-unispace-lg">
                                <p className="text-[0.875rem] text-neutral-700 italic mb-6 leading-relaxed">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full mr-4 object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-neutral-900">{testimonial.name}</h4>
                                        <p className="text-[0.875rem] text-neutral-700">{testimonial.role}</p>
                                    </div>
                                </div>
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
