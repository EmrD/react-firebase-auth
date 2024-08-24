import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import auth, { logoutSuccess } from "../store/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { emailVerification } from "../firebase";
import MainPage from "./mainpage.jsx";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (user && user.emailVerified) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutSuccess());
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
    toast.success("Çıkış Yapıldı");
  };

  const handleVerification = async () => {
    try {
      if (!user) {
        toast.error("Kullanıcı bulunamadı.");
        return;
      }
      setIsButtonDisabled(true);

      const isEmailVerified = await emailVerification();

      if (isEmailVerified) {
        // If email is already verified, update local state
        setIsVerified(true);
        navigate('/mainpage'); // Ana sayfaya yönlendirme
      } else {
        // If email is not verified, set state to indicate verification email sent
        setVerificationSent(true);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (user) {
    return (
      <div className="fixed flex items-center justify-center bg-gray-100">
        <div className="max-w-xl w-full py-5 px-4 bg-white rounded-md shadow-md">
          <h1 className="flex gap-x-4 h-8 rounded px-7 items-center max-w-xl mx-auto mb-4 text-center text-justify-center">Hoş geldiniz {user.email}, devam etmek için lütfen doğrulama adımını tamamlayın.</h1>
          <div className="flex flex-col space-y-4">
            <button
              className="h-8 rounded px-4 text-sm text-white bg-indigo-700 hover:bg-indigo-600"
              onClick={handleLogout}
            >
              Çıkış Yap
            </button>
            {!isVerified && (
              <button
              className={`h-8 rounded px-4 text-sm text-white ${isButtonDisabled ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-700 hover:bg-indigo-600'}`}
              onClick={handleVerification}
              disabled={isButtonDisabled}
            >
            {isButtonDisabled ? 'Bu oturum için yetkiniz yok' : 'E-Posta Doğrula'}
            </button>

            )}
            {!isVerified && verificationSent && (
              <div className="flex flex-col items-center justify-center bg-gray-100 text-center">
              <p className="text-sm text-gray-600 text-red">
                Lütfen doğrulamayı tamamladıktan sonra sayfanızı yenileyin!
              </p>
              <button
                className="h-8 rounded px-4 text-sm text-white bg-indigo-700 hover:bg-indigo-600 mt-2"
                onClick={() => window.location.reload()}
              >
                Sayfayı Yenile
              </button>
            </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex flex-col space-y-4 mb-4">
          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Kayıt Ol
          </Link>
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
}
