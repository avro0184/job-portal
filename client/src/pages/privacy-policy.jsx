// src/pages/privacy-policy.jsx

import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Head from "next/head";

export default function PrivacyPolicy() {
    return (
        <>
            <Header />
            <Head>
                <title>Privacy Policy | AmarProsno</title>
                <meta
                    name="description"
                    content="Read AmarProsno's Privacy Policy to understand how we collect, use, and protect your data."
                />
            </Head>
            <div className="overflow-y-scroll mt-20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white no-scrollbar">
                <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-100 dark:bg-gray-900">
                    <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                    <p className="mb-8">Effective Date: October 3, 2025</p>

                    <p className="mb-6">
                        At <strong>AmarProsno</strong>, your privacy is very important to us.
                        This Privacy Policy explains how we collect, use, and protect your
                        information when you use our website, mobile application, and related
                        services.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>Account Information:</strong> Name, email address, phone
                                number, and password when you register.
                            </li>
                            <li>
                                <strong>Exam & Study Data:</strong> Selected classes, subjects,
                                answers, results, and performance analytics.
                            </li>
                            <li>
                                <strong>Device & Usage Data:</strong> IP address, device details,
                                browser type, operating system, pages visited, and time spent.
                            </li>
                            <li>
                                <strong>Cookies & Tracking:</strong> Used to improve user
                                experience and provide personalized recommendations.
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide and improve exam and study services.</li>
                            <li>Personalize your learning experience and recommendations.</li>
                            <li>Communicate updates, features, and exam schedules.</li>
                            <li>Ensure platform security and prevent misuse.</li>
                            <li>Comply with legal and regulatory obligations.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-3">3. Sharing of Information</h2>
                        <p>
                            We <strong>do not sell</strong> your personal information. We may
                            share data with trusted third-party providers, to comply with legal
                            requirements, or in case of a business transfer (e.g., merger or
                            acquisition).
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
                        <p>
                            We use industry-standard encryption and practices to safeguard your
                            data. However, no system is 100% secure, and we cannot guarantee
                            complete protection.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
                        <p className="mb-3">As a user, you have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access, update, or delete your personal information.</li>
                            <li>Request a copy of your stored data.</li>
                            <li>Opt-out of marketing communications.</li>
                            <li>Restrict or object to certain processing activities.</li>
                        </ul>
                        <p className="mt-3">
                            You can exercise these rights by contacting us at{" "}
                            <strong>support@amarprosno.com</strong>.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-3">6. Children’s Privacy</h2>
                        <p>
                            AmarProsno is designed for students (Class 6 to higher education,
                            including job preparation). We do not knowingly collect data from
                            children under 13 without parental consent.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-3">7. Updates to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. Any changes
                            will be posted here with a revised “Effective Date.”
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact
                            us:
                        </p>
                        <p className="mt-3">
                            📧 <strong>support@amarprosno.com</strong> <br />
                            🌐{" "}
                            <a
                                href="https://www.amarprosno.com"
                                className="text-blue-600 dark:text-blue-400 underline"
                            >
                                www.amarprosno.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}

// optional if you're using layouts
PrivacyPolicy.getLayout = (page) => page;
