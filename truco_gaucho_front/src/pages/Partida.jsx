import React, { useEffect, useMemo, useState, useRef } from "react";

const NAIPES = ["♠", "♥", "♦", "♣"];
const VALORES = ["4", "5", "6", "7", "Q", "J", "K", "A", "2", "3"];
const TRUCO_NIVEIS = [1, 3, 6, 9, 12];
const SUIT_ORDER = { "♣": 0, "♦": 1, "♥": 2, "♠": 3 };

const criarBaralho = () => {
  const baralho = [];
  for (let v of VALORES) {
    for (let n of NAIPES) {
      baralho.push({ valor: v, naipe: n, id: `${v}${n}${Math.random().toString(36).slice(2,7)}` });
    }
  }
  for (let i = baralho.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
  }
  return baralho;
};

const proxValor = (valor) => {
  const idx = VALORES.indexOf(valor);
  return VALORES[(idx + 1) % VALORES.length];
};

const isManilha = (card, vira) => {
  if (!vira) return false;
  return card.valor === proxValor(vira.valor);
};

const comparaCartas = (a, b, vira) => {
  const aMan = isManilha(a, vira);
  const bMan = isManilha(b, vira);
  if (aMan && bMan) {
    return Math.sign(SUIT_ORDER[a.naipe] - SUIT_ORDER[b.naipe]);
  }
  if (aMan) return 1;
  if (bMan) return -1;
  const ia = VALORES.indexOf(a.valor);
  const ib = VALORES.indexOf(b.valor);
  return Math.sign(ia - ib);
};

function Partida() {
  const [players, setPlayers] = useState([
    { nome: null, mao: [], pontos: 0, index: 0 },
    { nome: null, mao: [], pontos: 0, index: 1 },
    { nome: null, mao: [], pontos: 0, index: 2 },
    { nome: null, mao: [], pontos: 0, index: 3 },
  ]);
  const [baralho, setBaralho] = useState([]);
  const [vira, setVira] = useState(null);
  const [mesa, setMesa] = useState([null, null, null, null]);
  const [rodadasGanhas, setRodadasGanhas] = useState([0, 0, 0, 0]);
  const [turno, setTurno] = useState(0);
  const [dealer, setDealer] = useState(0);
  const [trucoLevel, setTrucoLevel] = useState(1);
  const [trucoProposedBy, setTrucoProposedBy] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [modoOnline, setModoOnline] = useState(false);
  const wsRef = useRef(null);
  const [roomId, setRoomId] = useState(null);
  const [handOver, setHandOver] = useState(false);

  const pushMsg = (m) => setMensagens((s) => [m, ...s].slice(0, 30));

  const entrarNaMesa = (index) => {
    const nome = prompt("Digite seu nome:");
    if (!nome) return;
    const novo = [...players];
    novo[index] = { ...novo[index], nome };
    setPlayers(novo);
    if (modoOnline && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "join", index, nome, roomId }));
    }
  };

  const distribuir = () => {
    const novoBaralho = criarBaralho();
    const novoPlayers = players.map((p) => ({ ...p, mao: [] }));
    for (let i = 0; i < 4; i++) {
      novoPlayers[i].mao = novoBaralho.splice(0, 3);
    }
    const novaVira = novoBaralho.shift();
    setBaralho(novoBaralho);
    setVira(novaVira);
    setPlayers(novoPlayers);
    setMesa([null, null, null, null]);
    setRodadasGanhas([0, 0, 0, 0]);
    setTrucoLevel(1);
    setTrucoProposedBy(null);
    setHandOver(false);
    const primeiro = (dealer + 1) % 4;
    setTurno(primeiro);
    pushMsg(`Cartas distribuídas. Vira: ${novaVira.valor + novaVira.naipe}`);
  };

  const jogarCarta = (playerIndex, cartaIndex) => {
    if (handOver) { pushMsg("A mão já terminou. Distribua novamente."); return; }
    if (players[playerIndex].nome === null) { pushMsg("Posição vazia."); return; }
    if (playerIndex !== turno) { pushMsg("Não é seu turno."); return; }
    const novoPlayers = players.map((p) => ({ ...p }));
    const [carta] = novoPlayers[playerIndex].mao.splice(cartaIndex, 1);
    const novaMesa = [...mesa];
    novaMesa[playerIndex] = carta;
    setPlayers(novoPlayers);
    setMesa(novaMesa);
    pushMsg(`${players[playerIndex].nome} jogou ${carta.valor + carta.naipe}`);
    let p = (playerIndex + 1) % 4;
    let tent = 0;
    while (players[p].nome === null && tent < 4) { p = (p + 1) % 4; tent++; }
    setTurno(p);
    if (novaMesa.every((c) => c !== null)) {
      setTimeout(() => terminarRodada(novaMesa), 500);
    }
  };

  const terminarRodada = (mesaAtual) => {
    let vencedorIndex = null;
    let melhorCarta = null;
    for (let i = 0; i < 4; i++) {
      const c = mesaAtual[i];
      if (!c) continue;
      if (vencedorIndex === null) {
        vencedorIndex = i;
        melhorCarta = c;
      } else {
        const cmp = comparaCartas(c, melhorCarta, vira);
        if (cmp > 0) {
          vencedorIndex = i;
          melhorCarta = c;
        }
      }
    }
    if (vencedorIndex === null) {
      pushMsg("Rodada empatada (erro).");
      return;
    }
    pushMsg(`Rodada ganha por ${players[vencedorIndex].nome} (${melhorCarta.valor + melhorCarta.naipe})`);
    const novasRodadas = [...rodadasGanhas];
    novasRodadas[vencedorIndex] = (novasRodadas[vencedorIndex] || 0) + 1;
    setRodadasGanhas(novasRodadas);
    setMesa([null, null, null, null]);
    setTurno(vencedorIndex);
    const vencedorDaMao = novasRodadas.findIndex((r) => r >= 2);
    if (vencedorDaMao !== -1) {
      const pontos = trucoLevel;
      const equipes = [[0,2],[1,3]];
      const equipeVence = equipes[0].includes(vencedorDaMao) ? 0 : 1;
      const novoPlayers = players.map((p) => ({ ...p }));
      equipes[equipeVence].forEach((pi) => { novoPlayers[pi].pontos += pontos; });
      setPlayers(novoPlayers);
      pushMsg(`Mão ganha por ${players[vencedorDaMao].nome} — equipe ${equipeVence} ganha ${pontos} ponto(s)`);
      setHandOver(true);
      setDealer((d) => (d + 1) % 4);
      setTrucoLevel(1);
      setTrucoProposedBy(null);
      const equipesPts = [
        novoPlayers[0].pontos + novoPlayers[2].pontos,
        novoPlayers[1].pontos + novoPlayers[3].pontos,
      ];
      if (equipesPts[0] >= 12 || equipesPts[1] >= 12) {
        pushMsg(`Jogo finalizado! Placar: Equipe 0: ${equipesPts[0]} — Equipe 1: ${equipesPts[1]}`);
      }
    }
  };

  const proporTruco = (byIndex) => {
    if (players[byIndex].nome === null) { pushMsg("Posição vazia."); return; }
    if (trucoProposedBy !== null) { pushMsg("Já existe um Truco pendente."); return; }
    const idx = TRUCO_NIVEIS.indexOf(trucoLevel);
    const proximo = TRUCO_NIVEIS[Math.min(idx + 1, TRUCO_NIVEIS.length - 1)];
    if (proximo === trucoLevel) { pushMsg("Já no máximo de truco."); return; }
    setTrucoLevel(proximo);
    setTrucoProposedBy(byIndex);
    pushMsg(`${players[byIndex].nome} propôs Truco! Nível agora: ${proximo}. Aguardando resposta.`);
  };

  const responderTruco = (responderIndex, resposta) => {
    if (trucoProposedBy === null) { pushMsg("Nenhum Truco pendente."); return; }
    const proponente = trucoProposedBy;
    if (responderIndex === proponente) { pushMsg("Proponente não pode responder."); return; }

    if (resposta === "correr") {
      const equipes = [[0,2],[1,3]];
      const equipeProponente = equipes[0].includes(proponente) ? 0 : 1;
      const pontos = trucoLevel;
      const novoPlayers = players.map((p) => ({ ...p }));
      equipes[equipeProponente].forEach((pi) => { novoPlayers[pi].pontos += pontos; });
      setPlayers(novoPlayers);
      pushMsg(`${players[responderIndex].nome} correu! Equipe do proponente ganha ${pontos} ponto(s).`);
      setHandOver(true);
      setTrucoProposedBy(null);
      setTrucoLevel(1);
      setDealer((d) => (d + 1) % 4);
      return;
    }

    if (resposta === "aceitar") {
      pushMsg(`${players[responderIndex].nome} aceitou o Truco. Jogo continua (nível ${trucoLevel}).`);
      setTrucoProposedBy(null);
      return;
    }

    if (resposta === "aumentar") {
      const idx = TRUCO_NIVEIS.indexOf(trucoLevel);
      const proximo = TRUCO_NIVEIS[Math.min(idx + 1, TRUCO_NIVEIS.length - 1)];
      if (proximo === trucoLevel) { pushMsg("Já no máximo de truco."); return; }
      setTrucoLevel(proximo);
      setTrucoProposedBy(responderIndex);
      pushMsg(`${players[responderIndex].nome} aumentou o Truco! Nível agora: ${proximo}.`);
      return;
    }
  };

  useEffect(() => {
    if (!modoOnline) return;
    const url = prompt("Informe a URL do servidor WebSocket (ex: ws://localhost:4000). Cancel para modo local:");
    if (!url) {
      setModoOnline(false);
      pushMsg("Conexão WS cancelada; permanecendo em modo local.");
      return;
    }
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      pushMsg("Conectado ao servidor WS.");
      const rid = prompt("Insira room id (ou deixe em branco para criar):") || `room-${Math.random().toString(36).slice(2,6)}`;
      setRoomId(rid);
      ws.send(JSON.stringify({ type: "joinRoom", roomId: rid }));
    };

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.type === "state") {
          if (msg.state) {
            setPlayers((p) => msg.state.players || p);
            setMesa(msg.state.mesa || [null, null, null, null]);
            setVira(msg.state.vira || null);
            setTrucoLevel(msg.state.trucoLevel || 1);
            setTurno(msg.state.turno ?? 0);
            setBaralho(msg.state.baralho || []);
            pushMsg("Estado sincronizado do servidor.");
          }
        } else if (msg.type === "chat") {
          pushMsg(`[WS] ${msg.text}`);
        } else if (msg.type === "action") {
          pushMsg(`[WS action] ${JSON.stringify(msg.action)}`);
        }
      } catch (err) {
        console.error("WS parse erro", err);
      }
    };

    ws.onclose = () => {
      pushMsg("Conexão WS fechada.");
      wsRef.current = null;
      setModoOnline(false);
    };

    ws.onerror = (e) => { pushMsg("Erro WS (ver console)."); console.error(e); };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [modoOnline]);

  const broadcastState = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const payload = {
        type: "state",
        roomId,
        state: {
          players,
          mesa,
          vira,
          trucoLevel,
          turno,
          baralho,
          rodadasGanhas,
          dealer,
          handOver,
        },
      };
      wsRef.current.send(JSON.stringify(payload));
      pushMsg("Estado enviado ao servidor.");
    }
  };

  const resetGame = () => {
    setPlayers([
      { nome: null, mao: [], pontos: 0, index: 0 },
      { nome: null, mao: [], pontos: 0, index: 1 },
      { nome: null, mao: [], pontos: 0, index: 2 },
      { nome: null, mao: [], pontos: 0, index: 3 },
    ]);
    setBaralho([]);
    setVira(null);
    setMesa([null, null, null, null]);
    setRodadasGanhas([0,0,0,0]);
    setTrucoLevel(1);
    setTrucoProposedBy(null);
    setTurno(0);
    setDealer(0);
    setHandOver(false);
    pushMsg("Jogo reiniciado.");
  };

  const mesaDisplay = useMemo(() => {
    return mesa.map((c, i) => (c ? c.valor + c.naipe : "—"));
  }, [mesa]);

  const PlayerCard = ({ player, index }) => {
    const equipe = index % 2 === 0 ? 0 : 1;
    const isTurn = turno === index && !handOver;
    return (
      <div className="rounded bg-gray-100 border min-w-[150px] text-center shadow">
        <div className="font-semibold text-gray-800">{player.nome ?? `Vazio (${index})`}</div>
        <div className="text-sm text-gray-600">Equipe: {equipe} • Pontos: {player.pontos}</div>
        <div className="text-xs text-gray-500">Cartas: {player.mao.length}</div>
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex justify-center gap-2 flex-wrap">
            {player.mao.map((c, i) => (
              <button
                disabled={!isTurn}
                key={c.id}
                onClick={() => jogarCarta(index, i)}
                className={`px-2 py-1 rounded border ${isTurn ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                title={isTurn ? "Clique para jogar esta carta" : "Não é seu turno"}
              >
                {c.valor + c.naipe}
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-center">
            <button onClick={() => proporTruco(index)} className="px-3 py-1 rounded bg-green-600 text-white">Trucar</button>
            {trucoProposedBy !== null && trucoProposedBy !== index && (
              <>
                <button onClick={() => responderTruco(index, "aceitar")} className="px-3 py-1 rounded bg-blue-600 text-white">Aceitar</button>
                <button onClick={() => responderTruco(index, "aumentar")} className="px-3 py-1 rounded bg-yellow-600 text-white">Aumentar</button>
                <button onClick={() => responderTruco(index, "correr")} className="px-3 py-1 rounded bg-red-600 text-white">Correr</button>
              </>
            )}
            <button onClick={() => { if (!player.nome) entrarNaMesa(index); }} className="px-3 py-1 rounded bg-gray-300">{player.nome ? "—" : "Entrar"}</button>
          </div>
          <div className="text-xs text-center text-blue-500 mt-1">{isTurn ? "Seu turno" : ""}</div>
        </div>
      </div>
    );
  };

  return (
     <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-br from-green-50 to-green-100 p-6">
      <h2 className="text-3xl font-bold text-green-800 tracking-wide">Truco — Mesa</h2>
      <div className="flex gap-4">
        <button onClick={distribuir} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          Distribuir Cartas
        </button>
        <button onClick={resetGame} className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          Reset
        </button>
      </div>
      <div className="relative w-full max-w-6xl h-[600px] border-2 rounded-xl bg-white shadow-xl p-6 backdrop-blur-sm bg-opacity-90">
        <div className="absolute left-1/2 transform -translate-x-1/2 top-4">
          <PlayerCard player={players[0]} index={0} />
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <PlayerCard player={players[1]} index={1} />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4">
          <PlayerCard player={players[2]} index={2} />
        </div>
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <PlayerCard player={players[3]} index={3} />
        </div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-56 rounded-xl bg-gradient-to-br from-green-700 to-green-800 text-white flex flex-col items-center justify-center shadow-2xl border border-green-600">
          <div className="font-bold text-2xl mb-2">MESA</div>
          <div className="text-sm mt-1">Vira: {vira ? (vira.valor + vira.naipe) : "—"}</div>
          <div className="mt-4 text-lg">
            <div className="flex items-center gap-4">
              {mesaDisplay.map((carta, i) => (
                <div key={i} className="w-16 h-24 bg-white rounded-lg shadow-md flex items-center justify-center text-green-800 font-bold text-xl">
                  {carta}
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs mt-4">Truco: {trucoLevel} • Dealer: {dealer}</div>
          <div className="mt-2 text-sm">
            Rodadas: {rodadasGanhas.map((r,i) => `${i}:${r}`).join(" | ")}
          </div>
        </div>
      </div>
      <div className="w-full max-w-6xl flex gap-6">
        <div className="w-2/3 bg-white p-4 rounded-xl shadow-lg border">
          <div className="font-semibold text-lg text-green-800 mb-3">Mensagens</div>
          <div className="h-48 overflow-auto flex flex-col-reverse gap-2 px-2">
            {mensagens.map((m, i) => (
              <div key={i} className="text-sm text-gray-700 py-1 px-2 rounded hover:bg-gray-50">• {m}</div>
            ))}
          </div>
        </div>
        <div className="w-1/3 bg-white p-4 rounded-xl shadow-lg border">
          <div className="font-semibold text-lg text-green-800 mb-3">Placar</div>
          <div className="text-sm mb-2 bg-gray-50 p-2 rounded">Equipe 0 (jog 0+2): {players[0].pontos + players[2].pontos}</div>
          <div className="text-sm mb-2 bg-gray-50 p-2 rounded">Equipe 1 (jog 1+3): {players[1].pontos + players[3].pontos}</div>
          <div className="mt-4 border-t pt-3">
            <div className="text-xs text-gray-600">Dealer: {dealer}</div>
            <div className="text-xs text-gray-600">Truco level: {trucoLevel}</div>
            <div className="text-xs text-gray-600">Mão finalizada: {handOver ? "Sim" : "Não"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Partida;