import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import FloatingSettings from "@/components/common/FloatingSettings";
import LoginForm from "@/components/SignIn/LoginForm";

export default function LoginPage() {
  return (
    <div className="dark:text-white">
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="relative w-full max-w-md bg-white/90 dark:bg-gray-800/90  border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl p-8">
          <LoginForm />
        </div>
      </div>
      <Footer />
      <FloatingSettings />
    </div>
  );
}

LoginPage.getLayout = (page) => page;

