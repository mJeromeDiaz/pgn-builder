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

  pgnToJson (pgn) {
    const result = { headers: [], moves: [] };
    const lines = pgn.split('\n');
    let moveSection = false;
    let moveNumber = 1;
    let turn = 'w';

    for (const line of lines) {
      if (line.trim() === '') {
        moveSection = true;
        continue;
      }

      if (!moveSection) {
        const match = line.match(/\[(\w+)\s+"(.*)"\]/);
        if (match) {
          result.headers.push({ [match[1]]: match[2] });
        }
      } else {
        const moves = line.split(/\d+\./).filter(m => m.trim() !== '');
        for (const move of moves) {
          const parts = move.trim().split(/\s+/);
          for (const part of parts) {
            if (part.match(/^[a-h][1-8]|[NBRQK]?x?[a-h][1-8]|O-O(-O)?/)) {
              result.moves.push({
                move: part,
                moveNumber,
                turn,
                variations: []
              });
              turn = turn === 'w' ? 'b' : 'w';
              if (turn === 'w') moveNumber++;
            }
          }
        }
      }
    }

    return result;
  }

  jsonToPgn (json) {
    let pgn = '';

    // Headers
    json.headers.forEach(header => {
      const key = Object.keys(header)[0];
      pgn += `[${key} "${header[key]}"]\n`;
    });
    pgn += '\n';

    // Moves
    let currentMoveNumber = 1;
    json.moves.forEach((move, index) => {
      if (move.turn === 'w') {
        pgn += `${move.moveNumber}. `;
      } else if (index === 0) {
        pgn += `1... `;
      }
      pgn += `${move.move} `;

      if (move.variations && move.variations.length > 0) {
        move.variations.forEach(variation => {
          pgn += '(';
          variation.forEach((variationMove, vIndex) => {
            if (variationMove.turn === 'w' || vIndex === 0) {
              pgn += `${variationMove.moveNumber}${variationMove.turn === 'b' ? '...' : '.'} `;
            }
            pgn += `${variationMove.move} `;
          });
          pgn += ') ';
        });
      }

      currentMoveNumber = move.moveNumber;
    });

    return pgn.trim();
  }
}

export default ChessPGN;