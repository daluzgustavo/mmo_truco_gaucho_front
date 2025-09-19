import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    navigate("/salas");
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-80 flex flex-col gap-4 border-t-4 border-green-700"
      >
        <h2 className="text-xl font-semibold text-green-800">Login</h2>
        <input
          type="text"
          placeholder="Usuário"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
          required
        />
        <button
          type="submit"
          className="bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
