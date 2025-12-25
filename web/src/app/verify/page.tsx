import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import VerifyContent from "@/components/verify/VerifyContent";

export const metadata = {
  title: "التحقق - Secret CFW",
  description: "صفحة التحقق من العضوية في خادم Secret CFW",
};

export default function VerifyPage() {
  return (
    <Providers>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <VerifyContent />
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  );
}
