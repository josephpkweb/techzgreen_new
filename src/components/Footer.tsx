import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import fullLogo from '../assets/full_logo.png';

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#1a3d1f] text-white">
      <div className="page-container py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo + tagline */}
          <div className="space-y-4">
            <Link to="/" className="block w-fit">
              <div className="bg-white rounded-xl px-4 py-2 shadow-lg hover:opacity-90 transition-opacity inline-flex items-center">
                <img src={fullLogo} alt="TechzGreen" loading="lazy" className="h-14 w-auto object-contain" />
              </div>
            </Link>
            <p className="text-[rgba(200,230,201,0.8)] text-sm leading-relaxed max-w-xs">
              Transforming plastic waste — especially Multi-Layer Plastic (MLP) — into durable, eco-friendly products through innovative recycling and upcycling technologies.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 pt-1 flex-wrap">
              {[
                {
                  title: 'LinkedIn',
                  href: 'https://www.linkedin.com/company/techzgreen/',
                  svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
                },
                {
                  title: 'Instagram',
                  href: 'https://www.instagram.com/techz_green?igsh=MXV1NmZlZXM3MW1ucQ==',
                  svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>,
                },
                {
                  title: 'Threads',
                  href: 'https://www.threads.com/@techz_green',
                  svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.028-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 1.318-.013 2.513-.24 3.554-.68 1.267-.526 2.149-1.268 2.622-2.206.518-1.014.735-2.228.646-3.613-.13-1.483-.555-2.668-1.264-3.52-.778-.933-1.835-1.47-3.144-1.594-.218 2.51-1.23 4.37-2.99 5.485-1.15.725-2.541 1.063-4.134.994-1.32-.056-2.496-.467-3.4-1.188-.99-.793-1.538-1.907-1.538-3.135 0-2.597 2.09-4.25 5.466-4.404.87-.04 1.717-.031 2.535.027-.102-.652-.317-1.17-.64-1.544-.44-.506-1.103-.762-1.97-.762-.962 0-1.804.321-2.505.954l-1.36-1.521C7.337 5.88 8.72 5.347 10.373 5.347c1.527 0 2.745.476 3.621 1.416.816.876 1.248 2.092 1.284 3.614.406.07.793.162 1.156.275 2.8.872 4.396 3.045 4.571 6.119.116 2.03-.2 3.77-.94 5.17-.823 1.553-2.108 2.69-3.82 3.384-1.267.525-2.72.806-4.318.821l-.74-.146zm-.55-9.557c-.34 0-.68.005-1.017.02-2.185.097-3.386.898-3.386 2.198 0 1.298 1.052 2.063 2.888 2.134 1.215.05 2.232-.226 3.024-.82.854-.64 1.367-1.63 1.526-2.952a16.52 16.52 0 0 0-3.035-.58z"/></svg>,
                },
                {
                  title: 'Twitter / X',
                  href: 'https://x.com/TechzGreen',
                  svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.536-8.626L2.25 2.25h6.832l4.26 5.636zm-1.16 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                },
                {
                  title: 'YouTube',
                  href: 'https://www.youtube.com/@TechzGreen',
                  svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
                },
                {
                  title: 'Facebook',
                  href: 'https://www.facebook.com/people/TechzGreen/61554520002974/',
                  svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                },
              ].map(({ svg, title, href }) => (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={title}
                  className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(76,175,80,0.3)] text-[rgba(200,230,201,0.8)] hover:text-white transition-all flex items-center justify-center"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest text-[#4caf50] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'About', to: '/about' },
                { label: 'Featured Products', to: '/featured-products' },
                { label: 'Shop', to: '/shop' },
                { label: 'Events', to: '/events' },
                { label: 'Earn Points', to: '/rewards' },
                { label: 'Profile', to: '/profile' },
                { label: 'Partner Portal', to: '/partner/login' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-[rgba(200,230,201,0.75)] hover:text-white text-sm font-medium transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest text-[#4caf50] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-[rgba(200,230,201,0.75)]">
                <MapPin className="w-4 h-4 mt-0.5 text-[#4caf50] shrink-0" />
                <span>JJ Complex, Koonammoochi (P.O)<br />Thrissur, Kerala, India — 680504</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[#4caf50] shrink-0" />
                <a href="mailto:techzgreen23@gmail.com" className="text-[rgba(200,230,201,0.75)] hover:text-white transition-colors">
                  techzgreen23@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-[#4caf50] shrink-0" />
                <a href="tel:+918714985123" className="text-[rgba(200,230,201,0.75)] hover:text-white transition-colors">
                  +91 87149 85123
                </a>
              </li>
            </ul>
          </div>

          {/* Mission blurb */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest text-[#4caf50] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Our Mission
            </h4>
            <p className="text-[rgba(200,230,201,0.75)] text-sm leading-relaxed mb-4">
              Helping industries, institutions, and communities build sustainable waste management solutions while promoting a circular economy. We also provide sustainability consultation, plastic waste collection campaigns, and environmental awareness programs.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 btn-accent text-sm !py-2 !px-4"
            >
              Join the Movement
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(255,255,255,0.08)]">
        <div className="page-container py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[rgba(200,230,201,0.5)]">
          <p>© {new Date().getFullYear()} TechzGreen Pvt. Ltd. All rights reserved.</p>
          <p>Built for a greener tomorrow 🌿</p>
        </div>
      </div>
    </footer>
  );
}
