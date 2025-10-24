export default function Mesa({ mesa, vira, manilha }) {
    return (
      <div className="bg-green-800 w-64 h-40 rounded-xl flex flex-col items-center justify-center text-white text-xl font-bold shadow-lg">
        <span>MESA</span>
  
        {vira && (
          <div className="text-sm mt-1 opacity-80">
            Vira: <span className="bg-yellow-200 text-black px-2 py-1 rounded">{vira}</span>
          </div>
        )}
  
        {manilha && (
          <div className="text-sm mt-1 text-yellow-300">
            Manilha: {manilha}
          </div>
        )}
  
        <div className="flex gap-3 text-lg mt-3">
          {mesa.map((c, i) => (
            <div key={i}>
              {c ? (
                <span className="px-3 py-1 bg-white text-black rounded-lg shadow">
                  {c}
                </span>
              ) : (
                <span className="text-white opacity-40">•</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  