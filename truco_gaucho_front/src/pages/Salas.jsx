import { Link } from "react-router-dom";

function Salas() {
  const salas = [
    { id: 1, nome: "Sala do Chimarrão", jogadores: 3 },
    { id: 2, nome: "Sala Galpão", jogadores: 5 },
    { id: 3, nome: "Sala CTG", jogadores: 2 },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-red-700">Salas Disponíveis</h2>
      <div className="grid gap-4">
        {salas.map((s) => (
          <Link
            key={s.id}
            to={`/partida/${s.id}`}
            className="p-4 bg-white shadow rounded-xl flex justify-between items-center border-l-4 border-yellow-400 hover:bg-green-50 transition"
          >
            <span className="font-medium text-gray-700">{s.nome}</span>
            <span className="text-sm text-gray-500">{s.jogadores} jogadores</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Salas;
