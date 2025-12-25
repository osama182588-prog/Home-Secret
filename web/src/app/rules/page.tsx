import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import RulesContent from "@/components/rules/RulesContent";

export const metadata = {
  title: "القوانين - Secret CFW",
  description: "قوانين ولوائح خادم Secret CFW FiveM",
};

export default function RulesPage() {
  return (
    <Providers>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 gradient-text">
                📜 قوانين Secret CFW
              </h1>
              <p className="text-[var(--foreground-muted)] text-lg">
                يرجى قراءة جميع القوانين بعناية قبل البدء في اللعب
              </p>
            </div>
            <RulesContent />
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  );
}
