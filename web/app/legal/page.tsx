import Header from "@/components/Header";

export default function LegalPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />
            <div className="container mx-auto px-4 py-16 max-w-3xl">
                <h1 className="text-4xl font-serif font-bold text-[#001F3F] mb-8">Legal Notice</h1>

                <div className="prose prose-blue max-w-none text-gray-600">
                    <h2 className="text-2xl font-bold text-[#001F3F] mt-8 mb-4">Editor</h2>
                    <p>
                        <strong>Sygma Consult</strong><br />
                        SAS with a capital of 10,000 €<br />
                        RCS Paris B 123 456 789<br />
                        VAT: FR 12 123456789
                    </p>
                    <p className="mt-4">
                        <strong>Headquarters:</strong><br />
                        6 rue Paul Verlaine<br />
                        93130 Noisy-le-Sec, France
                    </p>
                    <p className="mt-4">
                        <strong>Email:</strong> contact@sygma-consult.com<br />
                        <strong>Phone:</strong> +33 7 52 03 47 86
                    </p>

                    <h2 className="text-2xl font-bold text-[#001F3F] mt-8 mb-4">Hosting</h2>
                    <p>
                        This website is hosted by <strong>Vercel Inc.</strong><br />
                        340 S Lemon Ave #4133<br />
                        Walnut, CA 91789<br />
                        USA
                    </p>

                    <h2 className="text-2xl font-bold text-[#001F3F] mt-8 mb-4">Intellectual Property</h2>
                    <p>All content present on the Sygma Consult website, including but not limited to graphics, images, texts, videos, animations, sounds, logos, gifs, and icons, as well as their formatting, are the exclusive property of the company, with the exception of trademarks, logos, or content belonging to other partner companies or authors.</p>
                </div>
            </div>
        </main>
    );
}
