import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#f0f4f0] min-h-screen pt-24 pb-16">
      <Helmet>
        <title>Privacy Policy - TechzGreen</title>
        <meta name="description" content="TechzGreen Privacy Policy and Data Collection Guidelines." />
      </Helmet>

      <div className="page-container max-w-4xl mx-auto">
        <div className="mb-10 sm:mb-12">
          <span className="section-label inline-flex mb-4">
            <Shield className="w-3.5 h-3.5" />
            Legal
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a3d1f]">Privacy Policy</h1>
          <p className="text-[#5f7a60] mt-3">Effective Date: May 2026</p>
        </div>

        <div className="glass-card p-6 sm:p-10 space-y-8 text-sm sm:text-base text-[#2c402e]">
          
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#4caf50]" />
              Data Collection
            </h2>
            <p>
              We collect information to provide better services to our users. The types of data we collect include:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Information:</strong> Name, phone number, and email address provided during registration (via Google OAuth).</li>
              <li><strong>Usage Data:</strong> Pages visited, actions taken on the platform, and feature usage.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-[#4caf50]" />
              Data Storage & Security
            </h2>
            <p>
              Your data is stored securely on our cloud infrastructure (Supabase). We employ industry-standard security measures including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Row Level Security (RLS) policies to ensure you can only access your own data.</li>
              <li>Encrypted database connections and secure APIs.</li>
              <li>No sensitive API keys or secrets are exposed to the public.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#4caf50]" />
              How We Use Your Data
            </h2>
            <p>We use the collected data for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To manage your account, rewards, and ZCoins.</li>
              <li>To improve our platform and user experience.</li>
              <li>To communicate with you regarding updates, support, and platform-related news.</li>
            </ul>
            <p className="font-bold text-[#1a3d1f] mt-4">We do not sell your personal data to third parties.</p>
          </section>

          <section className="space-y-4 pt-4 border-t border-[rgba(76,175,80,0.2)]">
            <h2 className="text-lg font-bold">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:techzgreen23@gmail.com" className="text-[#4caf50] hover:underline">techzgreen23@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
