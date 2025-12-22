import Header from "@/components/Header";
import { Briefcase, GraduationCap, Globe, Heart } from "lucide-react";

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-[#F8F9FA]">
            <Header />

            <div className="bg-[#001F3F] text-white py-24 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Join Our Team</h1>
                    <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                        Build your career at the intersection of Europe and Africa. We are always looking for exceptional talent.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">

                {/* Values */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <Globe className="h-10 w-10 text-[#D4AF37] mx-auto mb-4" />
                        <h3 className="font-bold text-[#001F3F] mb-2">International Impact</h3>
                        <p className="text-sm text-gray-600">Work on cross-border projects that shape the future of business.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <GraduationCap className="h-10 w-10 text-[#D4AF37] mx-auto mb-4" />
                        <h3 className="font-bold text-[#001F3F] mb-2">Continuous Learning</h3>
                        <p className="text-sm text-gray-600">We invest heavily in your professional development and training.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <Briefcase className="h-10 w-10 text-[#D4AF37] mx-auto mb-4" />
                        <h3 className="font-bold text-[#001F3F] mb-2">Excellence</h3>
                        <p className="text-sm text-gray-600">Join a team of high-performers dedicated to premium quality.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <Heart className="h-10 w-10 text-[#D4AF37] mx-auto mb-4" />
                        <h3 className="font-bold text-[#001F3F] mb-2">Well-being</h3>
                        <p className="text-sm text-gray-600">A supportive environment that values work-life balance.</p>
                    </div>
                </div>

                {/* Open Positions */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-[#001F3F] font-serif mb-8 text-center">Open Positions</h2>
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {/* Job Card */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-[#D4AF37] transition-colors">
                            <div>
                                <h3 className="font-bold text-lg text-[#001F3F]">Senior Strategy Consultant</h3>
                                <p className="text-gray-500 text-sm">Paris, France (Hybrid) • Full-time</p>
                            </div>
                            <button className="px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors">Apply Now</button>
                        </div>
                        {/* Job Card */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-[#D4AF37] transition-colors">
                            <div>
                                <h3 className="font-bold text-lg text-[#001F3F]">Legal Advisor (Corporate Law)</h3>
                                <p className="text-gray-500 text-sm">Tunis, Tunisia • Full-time</p>
                            </div>
                            <button className="px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors">Apply Now</button>
                        </div>
                    </div>
                </div>

                {/* Spontaneous Application */}
                <div className="bg-blue-50 rounded-2xl p-12 text-center max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-[#001F3F] mb-4">Don't see the right fit?</h3>
                    <p className="text-gray-600 mb-8">
                        We are always interested in meeting talented individuals. Send us your CV and a cover letter.
                    </p>
                    <a href="mailto:careers@sygma-consult.com" className="inline-block px-8 py-3 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#C5A028] transition-colors">
                        Send Spontaneous Application
                    </a>
                </div>

            </div>
        </main>
    );
}
