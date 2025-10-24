export default function Pontuacao({ placar }) {
    return (
      <div className="flex items-center justify-center gap-10 text-2xl font-bold text-green-900 mb-4">
        <div>🟢 Time 1: {placar.time1}</div>
        <div>🔴 Time 2: {placar.time2}</div>
      </div>
    );
  }
  