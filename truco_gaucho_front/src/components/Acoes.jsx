export default function Acoes({ onTrucar, onCorrer }) {
    return (
      <div className="flex flex-col gap-2 mt-3">
        <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700" onClick={onCorrer}>
          Correr
        </button>
  
        <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700" onClick={onTrucar}>
          Trucar!
        </button>
      </div>
    );
  }
  