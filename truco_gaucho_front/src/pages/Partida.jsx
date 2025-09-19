function Partida() {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-green-800">Partida em andamento</h2>
        <div className="w-full max-w-lg bg-white rounded-xl shadow p-6 border-t-4 border-red-700">
          <div className="flex justify-between mb-6 font-medium text-gray-700">
            <span>🧑 Time 1</span>
            <span>🧑 Time 2</span>
          </div>
          <div className="text-center text-4xl font-bold text-yellow-500">
            Mesa de Truco 🃏
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition">
              Truco!
            </button>
            <button className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition">
              Correr
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default Partida;
  