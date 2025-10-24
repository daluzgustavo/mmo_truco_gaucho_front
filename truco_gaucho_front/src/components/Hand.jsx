export default function Hand({ mao, onPlay }) {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {mao.map((c, i) => (
          <button
            key={i}
            onClick={() => onPlay(i)}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 shadow-md"
          >
            {c.carta}
          </button>
        ))}
      </div>
    );
  }
  