import Pontuacao from "../components/Pontuacao";
import Player from "../components/Player";
import Mesa from "../components/Mesa";
import { useTrucoLogic } from "../hooks/useTrucoLogic";
import { useState } from "react";

export default function Partida() {
  const { mesa, placar, distribuirCartas, jogarCarta, trucar, correr } = useTrucoLogic();

  const [players, setPlayers] = useState([
    { nome: null, mao: [] },
    { nome: null, mao: [] },
    { nome: null, mao: [] },
    { nome: null, mao: [] },
  ]);

  const entrarNaMesa = (index) => {
    const nome = prompt("Digite seu nome:");
    if (!nome) return;

    const copia = [...players];
    copia[index].nome = nome;
    copia[index].mao = [];
    setPlayers(copia);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-200 p-4">

      <Pontuacao placar={placar} />

      <button
        onClick={distribuirCartas}
        className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 mb-4"
      >
        Distribuir Cartas
      </button>

      <div className="relative w-full max-w-4xl h-[500px]">

        <div className="absolute top-0 flex justify-center w-full">
          <Player player={players[0]} index={0} entrarNaMesa={entrarNaMesa} jogarCarta={jogarCarta} trucar={trucar} correr={correr}/>
        </div>

        <div className="absolute right-0 flex items-center h-full">
          <Player player={players[1]} index={1} entrarNaMesa={entrarNaMesa} jogarCarta={jogarCarta} trucar={trucar} correr={correr}/>
        </div>

        <div className="absolute bottom-0 flex justify-center w-full">
          <Player player={players[2]} index={2} entrarNaMesa={entrarNaMesa} jogarCarta={jogarCarta} trucar={trucar} correr={correr}/>
        </div>

        <div className="absolute left-0 flex items-center h-full">
          <Player player={players[3]} index={3} entrarNaMesa={entrarNaMesa} jogarCarta={jogarCarta} trucar={trucar} correr={correr}/>
        </div>

        <div className="flex items-center justify-center h-full">
          <Mesa mesa={mesa} />
        </div>

      </div>
    </div>
  );
}
