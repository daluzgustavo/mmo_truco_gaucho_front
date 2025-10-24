export function criarBaralho() {
    const naipes = ["♠", "♥", "♦", "♣"];
    const valores = ["4", "5", "6", "7", "Q", "J", "K", "A", "2", "3"];
    let baralho = [];
  
    for (let n of naipes) {
      for (let v of valores) {
        baralho.push({ carta: v + n });
      }
    }
  
    return baralho.sort(() => Math.random() - 0.5);
  }
  