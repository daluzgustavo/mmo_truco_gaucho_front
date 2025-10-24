import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserLock } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate("/salas");
    }, 800);
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-green-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 flex flex-col gap-5 border-t-4 border-green-700"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <FaUserLock className="text-4xl text-green-700" />
          <h2 className="text-2xl font-bold text-green-800">Bem vindo ao Truco</h2>
          <p className="text-gray-500 text-sm">
            Entre para continuar
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Usuário</label>
            <input
              type="text"
              placeholder="Digite seu usuário"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-700 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-700 transition"
              required
            />
          </div>
        </div>

        {/* Extra options */}
        <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-green-700" />
            Lembrar-me
          </label>
          <button
            type="button"
            className="text-green-700 hover:underline hover:text-green-800"
          >
            Esqueci minha senha
          </button>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-4 bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition flex items-center justify-center ${
            loading ? "opacity-80 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default Login;
