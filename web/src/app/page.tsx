import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";

export default function Home() {
  return (
    <Providers>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 lg:py-32">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl"></div>
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                {/* Logo */}
                <div className="mb-8 animate-fade-in">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/25">
                    <span className="text-4xl font-bold text-white">S</span>
                  </div>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
                  <span className="gradient-text">Secret CFW</span>
                </h1>
                
                <p className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-10 animate-fade-in">
                  منصة القوانين والتحقق الرسمية لخادم FiveM الأفضل
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
                  <Link href="/rules" className="btn btn-primary text-lg px-8 py-4 animate-pulse-glow">
                    📜 قراءة القوانين
                  </Link>
                  <Link href="/verify" className="btn btn-secondary text-lg px-8 py-4">
                    ✅ بدء التحقق
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-[var(--background-secondary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
                مميزات المنصة
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="card text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                    <span className="text-3xl">📜</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[var(--primary)]">
                    قوانين شاملة
                  </h3>
                  <p className="text-[var(--foreground-muted)]">
                    جميع قوانين الرول بلاي مُنظمة ومُحدثة بشكل دائم
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="card text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                    <span className="text-3xl">✅</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[var(--primary)]">
                    نظام تحقق ذكي
                  </h3>
                  <p className="text-[var(--foreground-muted)]">
                    اختبار من 5 أسئلة عشوائية مع مراجعة بشرية
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="card text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                    <span className="text-3xl">🔗</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[var(--primary)]">
                    ربط Discord
                  </h3>
                  <p className="text-[var(--foreground-muted)]">
                    تحقق سلس مع رتب تلقائية على Discord
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
                كيف يعمل النظام؟
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: "1", title: "اقرأ القوانين", desc: "تصفح جميع قوانين الخادم بعناية" },
                  { step: "2", title: "سجل الدخول", desc: "استخدم حساب Discord الخاص بك" },
                  { step: "3", title: "أجب على الأسئلة", desc: "اختبار سريع من 5 أسئلة" },
                  { step: "4", title: "انتظر المراجعة", desc: "مراجعة من الإداريين" },
                ].map((item, index) => (
                  <div key={index} className="relative">
                    <div className="card text-center">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                        {item.step}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-[var(--foreground-muted)]">{item.desc}</p>
                    </div>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-1/2 -left-3 transform -translate-y-1/2 text-[var(--primary)]">
                        ←
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-20 bg-[var(--background-secondary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: "1000+", label: "لاعب متحقق" },
                  { value: "50+", label: "قانون" },
                  { value: "24/7", label: "دعم متواصل" },
                  { value: "100%", label: "أمان" },
                ].map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                      {stat.value}
                    </div>
                    <div className="text-[var(--foreground-muted)]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </Providers>
  );
}
