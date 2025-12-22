'use client';

import Header from "@/components/Header";
import { Mail, MapPin, Phone, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setIsSuccess(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#F8F9FA]">
            <Header />

            <div className="bg-[#001F3F] text-white py-20 text-center">
                <h1 className="text-4xl font-serif font-bold">{t.nav.contact}</h1>
                <p className="text-blue-200 mt-4">We are here to help you grow.</p>
            </div>

            <div className="container mx-auto px-4 py-16 -mt-10">
                <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Contact Info Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg h-fit">
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-6">{t.contact.title}</h2>
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-lg text-[#001F3F]">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{t.contact.address_paris} Office</h3>
                                    <p className="text-gray-600">6 rue Paul Verlaine, 93130 Noisy-le-Sec</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-lg text-[#001F3F]">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{t.contact.address_tunis} Office</h3>
                                    <p className="text-gray-600">Les Berges du Lac II, 1053 Tunis</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-lg text-[#001F3F]">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{t.contact.phone}</h3>
                                    <p className="text-gray-600">+33 7 52 03 47 86</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-lg text-[#001F3F]">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{t.contact.email}</h3>
                                    <p className="text-gray-600">contact@sygma-consult.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                        {isSuccess ? (
                            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-300">
                                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#001F3F] mb-2">{t.contact.form.success_title}</h3>
                                <p className="text-gray-600">{t.contact.form.success_desc}</p>
                                <button type="button" onClick={() => setIsSuccess(false)} className="mt-6 text-[#D4AF37] font-medium hover:underline">{t.contact.form.send_another}</button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-[#001F3F] mb-6">{t.contact.form.title}</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.form.name}</label>
                                        <input required name="name" type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#001F3F] outline-none" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.form.email}</label>
                                        <input required name="email" type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#001F3F] outline-none" placeholder="john@company.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.form.subject}</label>
                                        <select name="subject" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#001F3F] outline-none">
                                            <option value="Inquiry">{t.contact.form.subjects.general}</option>
                                            <option value="Partnership">{t.contact.form.subjects.partnership}</option>
                                            <option value="Careers">{t.contact.form.subjects.careers}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.form.message}</label>
                                        <textarea required name="message" rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#001F3F] outline-none" placeholder="..."></textarea>
                                    </div>
                                    <button disabled={isLoading} className="w-full py-3 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#C5A028] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {isLoading ? t.contact.form.sending : t.contact.form.submit}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>

                </div>
            </div>
        </main>
    );
}
