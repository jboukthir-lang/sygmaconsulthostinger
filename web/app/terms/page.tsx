import Header from "@/components/Header";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />
            <div className="container mx-auto px-4 py-16 max-w-3xl">
                <h1 className="text-4xl font-serif font-bold text-[#001F3F] mb-8">Terms of Service</h1>

                <div className="prose prose-blue max-w-none text-gray-600">
                    <p className="mb-6">Last updated: December 16, 2025</p>

                    <h2 className="text-2xl font-bold text-[#001F3F] mt-8 mb-4">1. Agreement to Terms</h2>
                    <p>By accessing our website at sygma-consult.com, you agree to be bound by these terms of service and all applicable laws and regulations.</p>

                    <h2 className="text-2xl font-bold text-[#001F3F] mt-8 mb-4">2. Use License</h2>
                    <p>Permission is granted to temporarily download one copy of the materials (information or software) on Sygma Consult's website for personal, non-commercial transitory viewing only.</p>

                    <h2 className="text-2xl font-bold text-[#001F3F] mt-8 mb-4">3. Disclaimer</h2>
                    <p>The materials on Sygma Consult's website are provided on an 'as is' basis. Sygma Consult makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

                    <h2 className="text-2xl font-bold text-[#001F3F] mt-8 mb-4">4. Limitations</h2>
                    <p>In no event shall Sygma Consult or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Sygma Consult's website.</p>
                </div>
            </div>
        </main>
    );
}
