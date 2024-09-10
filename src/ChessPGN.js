class ChessPGN {
  constructor() {
    this.headers = {};
    this.moves = [];
    this.currentVariation = null;
    this.isInVariation = false;
  }

  // Méthode pour ajouter un en-tête
  setHeader (key, value) {
    this.headers[key] = value;
  }

  // Méthode pour ajouter un coup en format SAN
  addMove (sanMove, comment = "", isVariation = false) {
    const moveObject = {
      move: this._convertSANtoPGN(sanMove),
      comment: this._replaceAnnotationsWithNAG(comment),
      variations: [],
    };

    if (isVariation && this.currentVariation) {
      this.currentVariation.variations.push(moveObject);
    } else {
      this.moves.push(moveObject);
      this.currentVariation = moveObject;
    }
  }

  // Convertir les annotations SAN en NAG
  _replaceAnnotationsWithNAG (comment) {
    const nagMap = {
      "!": "$1",
      "?": "$2",
      "!!": "$3",
      "??": "$4",
      "!?": "$5",
      "?!": "$6",
    };

    Object.keys(nagMap).forEach((symbol) => {
      const regex = new RegExp(`\\${symbol}`, "g");
      comment = comment.replace(regex, nagMap[symbol]);
    });

    return comment;
  }

  // Conversion SAN -> PGN
  _convertSANtoPGN (sanMove) {
    // Traite la promotion, les ambiguïtés, les signes + et #, etc.
    // https://fr.wikipedia.org/wiki/Portable_Game_Notation#SAN
    // Exemple : "e8=Q", "Nce4", "O-O+", "e5#"...
    return sanMove.replace(/(\w)\=([QRBN])/g, "$1=$2");
  }

  // Méthode pour récupérer le PGN
  getPGN () {
    let pgn = "";

    // Ajout des en-têtes
    Object.keys(this.headers).forEach((key) => {
      pgn += `[${key} "${this.headers[key]}"]\n`;
    });
    pgn += "\n";

    // Ajout des coups
    let moveIndex = 1;
    this.moves.forEach((moveObj, index) => {
      if (index % 2 === 0) pgn += `${moveIndex}. `;
      pgn += this._formatMoveWithVariations(moveObj);
      if (index % 2 === 1) moveIndex++;
    });

    return pgn.trim();
  }

  // Formater les coups avec les variantes
  _formatMoveWithVariations (moveObj) {
    let moveStr = moveObj.move;
    if (moveObj.comment) moveStr += ` {${moveObj.comment}}`;

    moveObj.variations.forEach((variation) => {
      moveStr += ` (${this._formatMoveWithVariations(variation)})`;
    });

    return moveStr + " ";
  }
}

