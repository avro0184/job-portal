import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import Loader from "@/components/Loader/Loader";
import apiRequest from "@/utils/api";
import FloatingSettings from "@/components/common/FloatingSettings";
import useTranslate from "@/hooks/useTranslation";

export default function VerifyEmail() {
  const router = useRouter();
  const { uid, token } = router.query;

  const { t } = useTranslate();

  const [status, setStatus] = useState("verifying");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || typeof uid !== "string" || typeof token !== "string") return;

    const verifyEmail = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT_VERIFY_EMAIL}`,
          "POST",
          null,
          { uid, token }
        );

        if (response.success) {
          toast.success(response.message || "Email verified successfully!");
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error(error);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [uid, token, router.isReady]);

  const renderContent = () => {
    if (status === "verifying") {
      return <p className="text-lg text-gray-600 dark:text-gray-300">Verifying your email...</p>;
    }

    if (status === "success") {
      return (
        <>
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400">{t("Email Verified")}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {t("Your email has been successfully verified!")}
          </p>
          <a
            href="/login"
            className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
          >
            {t("Go to Login")}
          </a>
        </>
      );
    }

    return (
      <>
        <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">{t("Email Verification Failed")}</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {t("Your email verification failed. Please try again or contact support.")}
        </p>
        <a
          href="/"
          className="mt-4 inline-block bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
        >
          {t("Return to Home")}
        </a>
      </>
    );
  };

  return (
    <>
      {loading && <Loader />}
      <div className="dark:text-white dark:bg-gray-900">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
            {renderContent()}
          </div>
        </div>
        <Footer />
        <FloatingSettings />
      </div>
    </>
  );
}

VerifyEmail.getLayout = (page) => page;
