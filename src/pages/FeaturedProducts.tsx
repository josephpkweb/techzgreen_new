import { useState } from 'react';
import zCeil2 from '../assets/z ceiling/2.webp';
import zCeil3 from '../assets/z ceiling/3.jpg';
import zCeil18 from '../assets/z ceiling/18.webp';
import zCeil19 from '../assets/z ceiling/19.jpg';
import zCeil22 from '../assets/z ceiling/22.jpeg';
import zPanel1 from '../assets/Z panel/1.png';
import zPanel2 from '../assets/Z panel/2.jpeg';
import zPanel4 from '../assets/Z panel/4.png';
import zPanel5 from '../assets/Z panel/5.jpeg';
import zPanel6 from '../assets/Z panel/6.jpeg';
import zPanel7 from '../assets/Z panel/7.png';
import zPanel8 from '../assets/Z panel/8.jpeg';
import zRoof1 from '../assets/Z roofing/1.png';
import zRoof2 from '../assets/Z roofing/2.jpeg';
import zRoof3 from '../assets/Z roofing/3.png';
import zRoof4 from '../assets/Z roofing/4.png';
import zRoof5 from '../assets/Z roofing/5.jpeg';
import zRoof6 from '../assets/Z roofing/6.jpeg';
import zPole1 from '../assets/Z pole/15050w-1000x638.png';
import zPole2 from '../assets/Z pole/cyruPLQslnd2euc3tZ00XY1TWtOFRATB1662037381.jpeg';
import zPole3 from '../assets/Z pole/images (10).jpeg';
import zPole4 from '../assets/Z pole/images (11).jpeg';
import zPole5 from '../assets/Z pole/recycled-lumber-250x250.jpg.jpeg';
import zPole6 from '../assets/Z pole/Substructure3_1823ec89-d183-48ef-ad8c-4439e822278e.jpg.jpeg';
import zPallet1 from '../assets/z pallet/1.jpeg';
import zPallet2 from '../assets/z pallet/2.jpeg';
import zPallet3 from '../assets/z pallet/3.jpeg';
import productsBanner from '../assets/products.png';
import zMomento1 from '../assets/Z momento/images (12).jpeg';
import zMomento2 from '../assets/Z momento/images (13).jpeg';
import { Helmet } from 'react-helmet-async';
import { Package, ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-react';
import { ZLeaf } from '../components/ZLeaf';

interface Product {
  id: string;
  name: string;
  tagline: string;
  tag: string;
  cardImage: string;
  images: string[];
  description: string;
  features: string[];
}

const PRODUCTS: Product[] = [
  {
    id: 'z-panel',
    name: 'Z Panel',
    tagline: 'Sustainable, high-strength recycled panels',
    tag: 'Industrial Grade',
    cardImage: zPanel1,
    images: [zPanel1, zPanel2, zPanel4, zPanel5, zPanel6, zPanel7, zPanel8],
    description: 'Z Panels are sustainable, high-strength panels made using multi-layer and industrial recycled plastics. With zero wood content, these boards offer unmatched resistance to water, acids, termites, and weathering—making them ideal for long-term indoor and outdoor use. No trees are cut. No toxins released. Just a strong, eco-conscious product built to perform.',
    features: [
      'Green & Sustainable: 100% recycled plastic. Zero wood.',
      'Acid-Resistant: Handles even concentrated industrial acids.',
      'Water & Termite-Proof: No swelling, no decay, no pest attacks.',
      'Heavy Duty Strength: High load-bearing capacity.',
      'Technical Specs: 3mm - 30mm thickness, 8ft x 4ft size.',
    ],
  },
  {
    id: 'z-ceiling-panel',
    name: 'Z Ceiling Panel',
    tagline: 'Smart, waterproof ceiling panels for high-moisture spaces',
    tag: 'New',
    cardImage: zCeil2,
    images: [zCeil2, zCeil3, zCeil18, zCeil19, zCeil22],
    description: 'Z Ceiling Panel is a smart, durable, and eco-friendly ceiling solution made from advanced Z Panel technology. Designed for modern interiors, these panels excel in high-moisture environments — washrooms, kitchens, utility spaces, offices, and commercial interiors. Available in 2ft × 2ft with 3mm & 4mm thickness in an elegant white-grey mixed finish. Unlike conventional ceiling materials, Z Ceiling Panels never absorb water, warp, rust, or decay. Manufactured from recycled and sustainable materials for minimal environmental impact.',
    features: [
      '100% Waterproof — ideal for washrooms & kitchens',
      '100% Pest proof, termite free & fungus free',
      'Size: 2ft × 2ft | Thickness: 3mm & 4mm',
      'White-grey mixed finish — clean premium look',
      'Flexible, lightweight & easy to install',
      'Reusable, long lasting & eco-friendly',
      'Customization available',
    ],
  },
  {
    id: 'z-roofing',
    name: 'Z Roofing',
    tagline: 'Advanced roofing panels for thermal insulation',
    tag: 'Weatherproof',
    cardImage: zRoof1,
    images: [zRoof1, zRoof2, zRoof3, zRoof4, zRoof5, zRoof6],
    description: 'Z Roofing Sheets are advanced roofing panels made from recycled polymers, engineered to reduce heat buildup and dampen noise. Their unique material composition offers superior thermal insulation and acoustic comfort, making them ideal for factories, homes, and agricultural sheds. With long life, zero rust, and no water absorption, Z Roofing is the roofing solution for sustainable, high-performance structures.',
    features: [
      'Effective Heat Reduction: Reduces indoor temperatures by 3-4°C.',
      'Exceptional Acid Resistance: Fully resistant to corrosive elements.',
      'Unmatched Strength: High-grade durable polymer sheets.',
      'Zero Rusting or Cracking: Weather-induced degradation resistant.',
      'Eco-Friendly: Produced entirely from recycled plastics.',
    ],
  },
  {
    id: 'z-pole',
    name: 'Z Pole',
    tagline: 'Revolutionary structural components from upcycled plastic',
    tag: 'Structural',
    cardImage: zPole1,
    images: [zPole1, zPole2, zPole3, zPole4, zPole5, zPole6],
    description: 'The Z Pole is a revolutionary structural component crafted entirely from upcycled industrial single-use plastic waste. Designed for superior strength, exceptional durability, and ultimate sustainability, the Z Pole is the modern alternative to traditional materials. Ideal for door/window frames, furniture support, and general construction.',
    features: [
      'Material: 100% Upcycled Plastic Waste.',
      'Strength & Durability: Extremely strong and high density.',
      'Workability: Excellent screw holding capacity, easy to cut & drill.',
      'High Durability: Impervious to rot, moisture, and pests.',
      'Standard Sizes: Custom sizes in 6 ft to 8 ft lengths.',
    ],
  },
  {
    id: 'z-pallet',
    name: 'Z Pallet',
    tagline: 'High-performance logistics pallets',
    tag: 'Industrial',
    cardImage: zPallet1,
    images: [zPallet1, zPallet2, zPallet3],
    description: 'TechzGreen Eco Product\'s high-performance Z pallets are designed for exceptional strength, durability and load-bearing capacity, making them ideal for the toughest industrial applications. We manufacture heavy-duty pallets that withstand extreme conditions, ensuring unmatched reliability and longevity in material handling.',
    features: [
      'High load-bearing capacity with superior strength.',
      'Higher compressive strength than steel, wooden and plastic pallets.',
      'Smooth surface prevents damage—no splinters or rough edges.',
      'Resistant to acids, chemicals and alkalis.',
      '0% water absorption—fully waterproof for wet conditions.',
    ],
  },

  {
    id: 'z-momento',
    name: 'Z Momento',
    tagline: 'Premium eco trophies & corporate gifts',
    tag: 'Premium Eco Trophy',
    cardImage: zMomento1,
    images: [zMomento1, zMomento2],
    description: 'Z Momento is a premium, eco-friendly trophy and memento handcrafted from recycled plastic and MLP waste. Elegant modern design carries a powerful sustainability message — awarded at corporate events, recognition ceremonies, or given as a thoughtful corporate gift. Every piece tells a story of circular economy in action.',
    features: [
      'Premium finish — looks & feels luxurious',
      '100% recycled plastic construction',
      'Custom branding & engraving available',
      'Ideal for corporate events & awards',
      'Sustainable alternative to conventional trophies',
    ],
  },
];

function ImageCarousel({ images, name }: { images: string[]; name: string }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="w-full h-72 sm:h-96">
        <img
          src={images[idx]}
          alt={`${name} ${idx + 1}`}
          className="w-full h-full object-contain bg-transparent transition-opacity duration-300"
        />
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function FeaturedProducts() {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <div className="fade-in pb-28 sm:pb-20">
      <Helmet>
        <title>Featured Products – TechzGreen</title>
        <meta name="description" content="TechzGreen's flagship products crafted from recycled plastic for a sustainable future." />
        <link rel="canonical" href="https://techzgreen.in/featured-products" />
        <meta property="og:title" content="Featured Products – TechzGreen" />
        <meta property="og:description" content="Explore TechzGreen's signature eco-products built from recycled plastic." />
        <meta property="og:url" content="https://techzgreen.in/featured-products" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://techzgreen.in/favicon.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* ── Header ── */}
      <section className="py-8 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="section-label inline-flex mb-4"><Package className="w-3.5 h-3.5" />Our Products</span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a3d1f] mt-4">Signature Eco-Products</h1>
          <p className="text-[#5f7a60] mt-3 max-w-xl mx-auto">Six flagship products. One mission — turn plastic waste into lasting value.</p>
        </div>
      </section>

      {/* ── Product Card Grid ── */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map(product => (
              <button
                key={product.id}
                onClick={() => setSelected(product)}
                className="glass-card overflow-hidden text-left group cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="overflow-hidden h-44 sm:h-56">
                  <img
                    src={product.cardImage}
                    alt={product.name}
                    className="w-full h-full object-contain bg-transparent group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold text-[#2e7d32] bg-[rgba(46,125,50,0.1)] px-2.5 py-1 rounded-full border border-[rgba(46,125,50,0.2)]">
                    {product.tag}
                  </span>
                  <h3 className="text-lg font-black text-[#1a3d1f] mt-3 mb-1">{product.name}</h3>
                  <p className="text-[#5f7a60] text-sm leading-relaxed">{product.tagline}</p>
                  <span className="inline-block mt-4 text-xs font-bold text-[#2e7d32] group-hover:underline">
                    View details →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-8 sm:py-16 px-4 bg-[rgba(46,125,50,0.03)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label inline-flex mb-4"><ZLeaf className="w-3.5 h-3.5" color="green" />Why It Matters</span>
            <h2 className="text-3xl font-black text-[#1a3d1f] mt-4">Every Product = Plastic Diverted from Landfills</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { val: '100%', label: 'Recycled MLP plastic', sub: 'No virgin plastic used in manufacturing' },
              { val: '32+', label: 'Years of expertise', sub: 'Pioneering plastic recycling since day one' },
              { val: '4.5T', label: 'Waste collected', sub: 'And growing with every community member' },
            ].map(({ val, label, sub }) => (
            <div key={label} className="glass-card p-5 sm:p-8 text-center">
                <p className="text-4xl font-black text-[#2e7d32] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{val}</p>
                <p className="font-bold text-[#1a3d1f] text-sm mb-1">{label}</p>
                <p className="text-[#5f7a60] text-xs leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products Banner ── */}
      <section className="px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <img
            src={productsBanner}
            alt="TechzGreen products"
            className="w-full h-auto rounded-2xl object-contain"
          />
        </div>
      </section>

      {/* ── Detail Modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white w-full sm:max-w-2xl max-h-[92vh] sm:rounded-2xl rounded-t-2xl overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <div className="sticky top-0 z-10 bg-white flex justify-between items-center px-6 py-4 border-b border-[rgba(46,125,50,0.1)]">
              <span className="text-xs font-bold text-[#2e7d32] bg-[rgba(46,125,50,0.1)] px-2.5 py-1 rounded-full border border-[rgba(46,125,50,0.2)]">
                {selected.tag}
              </span>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-lg bg-[rgba(46,125,50,0.08)] hover:bg-[rgba(46,125,50,0.15)] text-[#5f7a60] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Carousel */}
              <ImageCarousel images={selected.images} name={selected.name} />

              {/* Info */}
              <div>
                <h2 className="text-2xl font-black text-[#1a3d1f] mb-2">{selected.name}</h2>
                <p className="text-[#5f7a60] leading-relaxed text-sm">{selected.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-black text-[#1a3d1f] mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {selected.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#2d4a30]">
                      <CheckCircle className="w-4 h-4 text-[#2e7d32] shrink-0 mt-0.5" />{f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {selected.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${selected.name} ${i + 1}`}
                    className="w-20 h-16 object-cover rounded-lg shrink-0 border-2 border-transparent hover:border-[#2e7d32] transition-colors cursor-pointer"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
