import Hand from "./Hand";
import Acoes from "./Acoes";

export default function Player({ player, index, entrarNaMesa, jogarCarta, trucar, correr, isMainPlayer }) {
  return (
<div className="p-4 border-2 rounded-xl text-center bg-gradient-to-b from-white to-gray-50 shadow-lg min-w-[200px] transition-all duration-300 hover:shadow-xl hover:border-green-500">
      {player.nome ? (
        <>
          <div className="text-xl font-bold text-gray-800 mb-2">
            {isMainPlayer ? player.nome : `Jogador ${index + 1}`}
          </div>
          <div className="text-sm text-gray-600 bg-gray-100 rounded-lg py-1 mb-3">
            Cartas: {player.mao.length}
          </div>
          {isMainPlayer ? (
            <Hand mao={player.mao} onPlay={(i) => jogarCarta(index, i)} />
          ) : (
            <div className="flex justify-center gap-2 mt-3">
              {player.mao.map((_, i) => (
                <div 
                  key={i} 
                  className="w-10 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-lg shadow-md transform hover:rotate-2 transition-transform"
                ></div>
              ))}
            </div>
          )}
          <Acoes onTrucar={trucar} onCorrer={() => correr(index)} />
        </>
      ) : (
        <button
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          onClick={() => entrarNaMesa(index)}
        >
          Entrar
        </button>
      )}
    </div>
  );
}
