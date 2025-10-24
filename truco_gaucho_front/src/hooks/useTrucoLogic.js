import { useState } from "react";

const baralhoBase = [
  "4♣","4♥","4♠","4♦",
  "5♣","5♥","5♠","5♦",
  "6♣","6♥","6♠","6♦",
  "7♣","7♥","7♠","7♦",
  "Q♣","Q♥","Q♠","Q♦",
  "J♣","J♥","J♠","J♦",
  "K♣","K♥","K♠","K♦",
  "A♣","A♥","A♠","A♦",
  "2♣","2♥","2♠","2♦",
  "3♣","3♥","3♠","3♦",
];

function embaralhar(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export function useTrucoLogic() {
  const [players, setPlayers] = useState([
    { nome: null, mao: [] },
    { nome: null, mao: [] },
    { nome: null, mao: [] },
    { nome: null, mao: [] },
  ]);

  const [mesa, setMesa] = useState([null, null, null, null]);
  const [placar, setPlacar] = useState({ time1: 0, time2: 0 });
  const [vira, setVira] = useState(null);
  const [manilha, setManilha] = useState(null);

  const descobrirManilha = (carta) => {
    const ordem = ["4","5","6","7","Q","J","K","A","2","3"];
    const valor = carta[0];
    const proximo = ordem[(ordem.indexOf(valor) + 1) % ordem.length];
    return proximo;
  };

  const distribuirCartas = () => {
    let deck = embaralhar(baralhoBase);
    const novaMao = [[], [], [], []];

    for (let i = 0; i < 3; i++) {
      novaMao[0].push(deck.pop());
      novaMao[1].push(deck.pop());
      novaMao[2].push(deck.pop());
      novaMao[3].push(deck.pop());
    }

    const viraCarta = deck.pop();
    setVira(viraCarta);

    const manilhaValor = descobrirManilha(viraCarta);
    setManilha(manilhaValor);

    const novosPlayers = [...players];
    novosPlayers.forEach((p, i) => p.mao = novaMao[i]);

    setPlayers(novosPlayers);
  };

  const jogarCarta = (jogadorIndex, cartaIndex) => {
    const novos = [...players];
    const carta = novos[jogadorIndex].mao[cartaIndex];

    novos[jogadorIndex].mao.splice(cartaIndex, 1);
    setPlayers(novos);

    const novaMesa = [...mesa];
    novaMesa[jogadorIndex] = carta;
    setMesa(novaMesa);
  };

  const trucar = () => alert("⚡ TRUCO! (aposta aumenta)");
  const correr = (player) => alert(`${players[player].nome} correu!`);

  return { players, mesa, placar, distribuirCartas, jogarCarta, trucar, correr, vira, manilha };
}
