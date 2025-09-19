import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-green-800">Truco Gaúcho MMO</h1>
      <p className="text-lg text-gray-600">Desafie jogadores do Brasil inteiro!</p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-5 py-2 rounded-xl font-bold text-white bg-red-700 hover:bg-red-800 transition"
        >
          Entrar
        </Link>
        <Link
          to="/salas"
          className="px-5 py-2 rounded-xl font-bold text-white bg-yellow-400 hover:bg-yellow-500 transition"
        >
          Salas
        </Link>
      </div>
    </div>
  );
}

export default Home;
