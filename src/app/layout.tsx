import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import Script from "next/script";

const TITLE_EN = "The Nature of Quantum Reality · Wave, Observer, Entanglement & the Edge of Existence";
const TITLE_ZH = "量子的本质 · 波、观测者、纠缠与存在的边界";
const DESC =
  "A monumental, cinematic, bilingual cathedral of quantum understanding. A journey from Planck's quantum to modern quantum computing — through wave-particle duality, superposition, entanglement, the observer effect, decoherence and the deepest interpretations of physics — connecting quantum mechanics to consciousness, information, cosmology, simulation theory and the philosophy of existence itself.";

export const metadata: Metadata = {
  metadataBase: new URL("https://quantum-reality.psyverse.fun"),
  title: `${TITLE_EN} | ${TITLE_ZH}`,
  description: DESC,
  keywords: [
    "quantum reality", "quantum mechanics", "wave-particle duality", "superposition",
    "quantum entanglement", "observer effect", "wave function collapse", "decoherence",
    "quantum tunneling", "zero-point energy", "quantum field theory", "Schrödinger equation",
    "Dirac equation", "Bloch sphere", "qubit", "quantum computing", "Copenhagen interpretation",
    "many-worlds interpretation", "pilot wave", "relational quantum mechanics", "simulation hypothesis",
    "holographic universe", "quantum consciousness", "double-slit experiment", "Bell's theorem",
    "Planck", "Bohr", "Heisenberg", "Einstein", "Feynman", "information physics", "it from bit",
    "量子", "量子的本质", "量子力学", "波粒二象性", "叠加态", "量子纠缠", "观测者效应",
    "波函数坍缩", "退相干", "量子隧穿", "零点能", "量子场论", "薛定谔方程", "狄拉克方程",
    "布洛赫球", "量子比特", "量子计算", "哥本哈根诠释", "多世界诠释", "导波理论",
    "关系量子力学", "模拟假说", "全息宇宙", "量子意识", "双缝实验", "贝尔定理",
  ],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: { canonical: "/", languages: { en: "/", "zh-CN": "/", "x-default": "/" } },
  openGraph: {
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "The Nature of Quantum Reality · 量子的本质" }],
    title: TITLE_EN,
    description:
      "Reality may not exist until it is observed. A cinematic, bilingual journey into the deepest mystery of physics — and the nature of existence itself.",
    url: "https://quantum-reality.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: TITLE_EN,
    description: "Reality may not exist until it is observed. A cinematic, bilingual cathedral of quantum understanding — wave, observer, entanglement and the edge of existence.",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#03040a" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&family=Noto+Serif+SC:wght@300;400;500;600&family=Noto+Sans+SC:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: TITLE_EN,
              alternateName: TITLE_ZH,
              description: DESC,
              url: "https://quantum-reality.psyverse.fun/",
              inLanguage: ["en", "zh-CN"],
              author: { "@type": "Person", name: "Gewenbo", url: "https://psyverse.fun/" },
              publisher: { "@type": "Organization", name: "Psyverse", url: "https://psyverse.fun/" },
            }),
          }}
        />
      </head>
      <body className="void-bg font-body text-ether-100 antialiased">
        {children}
        <Script src="https://analytics-dashboard-two-blue.vercel.app/tracker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
