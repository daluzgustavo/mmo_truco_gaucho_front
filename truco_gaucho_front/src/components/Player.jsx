import Hand from "./Hand";
import Acoes from "./Acoes";

export default function Player({ player, index, entrarNaMesa, jogarCarta, trucar, correr }) {
  return (
    <div className="p-3 border rounded-lg text-center bg-white shadow-md min-w-[150px]">

      {player.nome ? (
        <>
          <div className="text-lg font-bold text-gray-800">{player.nome}</div>
          <div className="text-sm text-gray-600">Cartas: {player.mao.length}</div>

          <Hand mao={player.mao} onPlay={(i) => jogarCarta(index, i)} />
          <Acoes onTrucar={trucar} onCorrer={() => correr(index)} />
        </>
      ) : (
        <button
          className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
          onClick={() => entrarNaMesa(index)}
        >
          Entrar
        </button>
      )}

    </div>
  );
}
