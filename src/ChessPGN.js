class ChessPGN {
  constructor() {
    this.headers = {};
    this.moves = [];
    this.currentVariation = null;
    this.isInVariation = false;
  }

  setHeader (key, value) {
    this.headers[key] = value;
  }

  addMove (sanMove, comment = "", isVariation = false) {
    const moveObject = {
      move: this._convertSANtoPGN(sanMove),
      comment: comment,
      variations: [],
    };

    if (isVariation) {
      if (!this.currentVariation) {
        // Si on commence une nouvelle variante, on l'ajoute au dernier coup
        const lastMove = this.moves[this.moves.length - 1];
        lastMove.variations.push([moveObject]);
        this.currentVariation = lastMove.variations[lastMove.variations.length - 1];
      } else {
        // Sinon, on ajoute le coup à la variante courante
        this.currentVariation.push(moveObject);
      }
    } else {
      this.moves.push(moveObject);
      this.currentVariation = null;
    }
  }

  _convertSANtoPGN (sanMove) {
    return sanMove.replace(/(\w)=([QRBN])/g, "$1=$2");
  }

  getPGN () {
    let pgn = "";
    Object.keys(this.headers).forEach((key) => {
      pgn += `[${key} "${this.headers[key]}"]\n`;
    });
    pgn += "\n";

    pgn += this._formatMoves(this.moves);
    return pgn.trim();
  }

  _formatMoves (moves, startIndex = 1, isVariation = false) {
    let pgn = "";
    let moveIndex = startIndex;

    moves.forEach((moveObj, index) => {
      if (index === 0 && isVariation) {
        if (moveIndex % 2 === 0) {
          pgn += `${Math.floor(moveIndex / 2)}... `;
        }
      } else if (moveIndex % 2 === 1) {
        pgn += `${Math.floor(moveIndex / 2) + 1}. `;
      }

      pgn += moveObj.move;
      if (moveObj.comment) pgn += ` {${moveObj.comment}}`;

      if (moveObj.variations.length > 0) {
        moveObj.variations.forEach(variation => {
          pgn += ` (${this._formatMoves(variation, moveIndex, true)})`;
        });
      }

      pgn += " ";
      moveIndex++;
    });

    return pgn.trim();
  }
}

export default ChessPGN;
/*****  avec traitement nag
class ChessPGN {
 constructor() {
   this.headers = {};
   this.moves = [];
   this.currentVariation = null;
   this.isInVariation = false;
 }

 setHeader (key, value) {
   this.headers[key] = value;
 }

 addMove (sanMove, annotation = "", comment = "", isVariation = false) {
   const moveObject = {
     move: this._convertSANtoPGN(sanMove),
     annotation: this._convertAnnotationToNAG(annotation),
     comment: comment,
     variations: [],
   };

   if (isVariation) {
     if (!this.currentVariation) {
       const lastMove = this.moves[this.moves.length - 1];
       lastMove.variations.push([moveObject]);
       this.currentVariation = lastMove.variations[lastMove.variations.length - 1];
     } else {
       this.currentVariation.push(moveObject);
     }
   } else {
     this.moves.push(moveObject);
     this.currentVariation = null;
   }
 }

 _convertSANtoPGN (sanMove) {
   return sanMove.replace(/(\w)=([QRBN])/g, "$1=$2");
 }

 _convertAnnotationToNAG (annotation) {
   const nagMap = {
     "!": "$1",
     "?": "$2",
     "!!": "$3",
     "??": "$4",
     "!?": "$5",
     "?!": "$6",
     "□": "$7",
     "=": "$10",
     "∞": "$13",
     "⩲": "$14",
     "⩱": "$15",
     "±": "$16",
     "∓": "$17",
     "+−": "$18",
     "−+": "$19",
   };
   return nagMap[annotation] || "";
 }

 getPGN () {
   let pgn = "";
   Object.keys(this.headers).forEach((key) => {
     pgn += `[${key} "${this.headers[key]}"]\n`;
   });
   pgn += "\n";

   pgn += this._formatMoves(this.moves);
   return pgn.trim();
 }

 _formatMoves (moves, startIndex = 1, isVariation = false) {
   let pgn = "";
   let moveIndex = startIndex;

   moves.forEach((moveObj, index) => {
     if (index === 0 && isVariation) {
       if (moveIndex % 2 === 0) {
         pgn += `${Math.floor(moveIndex / 2)}... `;
       }
     } else if (moveIndex % 2 === 1) {
       pgn += `${Math.floor(moveIndex / 2) + 1}. `;
     }

     pgn += moveObj.move;

     if (moveObj.annotation) {
       pgn += ` ${moveObj.annotation}`;
     }

     if (moveObj.comment) {
       pgn += ` {${moveObj.comment}}`;
     }

     if (moveObj.variations.length > 0) {
       moveObj.variations.forEach(variation => {
         pgn += ` (${this._formatMoves(variation, moveIndex, true)})`;
       });
     }

     pgn += " ";
     moveIndex++;
   });

   return pgn.trim();
 }
}

export default ChessPGN;
*/