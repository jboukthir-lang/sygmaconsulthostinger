import Header from "@/components/Header";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />
            <div className="container mx-auto px-4 py-16 max-w-3xl">
                <h1 className="text-4xl font-serif font-bold text-[#001F3F] mb-8">Privacy Policy</h1>

                <div className="prose prose-blue max-w-none text-gray-600">
                    <p className="mb-6">Last updated: December 16, 2025</p>

                    <p>At Sygma Consult, we take your privacy seriously. This policy describes how we collect, use, and protect your personal data in compliance with the General Data Protection Regulation (GDPR).</p>

                    <h2 className="text-2xl font-bold text-[#001F3F] mt-8 mb-4">1. Data Collection</h2>
                    <p>We collect information you provide directly to us, such as when you book a consultation, use our contact form, or subscribe to our newsletter. This may include your name, email address, phone number, and company details.</p>

                    <h2 className="text-2xl font-bold text-[#001F3F] mt-8 mb-4">2. Use of Data</h2>
                    <p>We use your data to:</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>Process and confirm your consultation bookings.</li>
                        <li>Respond to your inquiries.</li>
                        <li>Send you relevant updates and insights (if opted in).</li>
                        <li>Improve our website and services.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-[#001F3F] mt-8 mb-4">3. Data Protection</h2>
                    <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>

                    <h2 className="text-2xl font-bold text-[#001F3F] mt-8 mb-4">4. Your Rights</h2>
                    <p>Under GDPR, you have the right to access, correct, delete, or restrict the processing of your personal data. To exercise these rights, please contact us at privacy@sygma-consult.com.</p>

                    <h2 className="text-2xl font-bold text-[#001F3F] mt-8 mb-4">5. Cookies</h2>
                    <p>Our website uses essential cookies to function correctly. We may also use analytical cookies to understand how visitors interact with our site.</p>
                </div>
            </div>
        </main>
    );
}
