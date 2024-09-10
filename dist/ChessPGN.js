"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ChessPGN = /*#__PURE__*/function () {
  function ChessPGN() {
    _classCallCheck(this, ChessPGN);
    this.headers = {};
    this.moves = [];
    this.currentVariation = null;
    this.isInVariation = false;
  }

  // Méthode pour ajouter un en-tête
  return _createClass(ChessPGN, [{
    key: "setHeader",
    value: function setHeader(key, value) {
      this.headers[key] = value;
    }

    // Méthode pour ajouter un coup en format SAN
  }, {
    key: "addMove",
    value: function addMove(sanMove) {
      var comment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var isVariation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var moveObject = {
        move: this._convertSANtoPGN(sanMove),
        comment: this._replaceAnnotationsWithNAG(comment),
        variations: []
      };
      if (isVariation && this.currentVariation) {
        this.currentVariation.variations.push(moveObject);
      } else {
        this.moves.push(moveObject);
        this.currentVariation = moveObject;
      }
    }

    // Convertir les annotations SAN en NAG
  }, {
    key: "_replaceAnnotationsWithNAG",
    value: function _replaceAnnotationsWithNAG(comment) {
      var nagMap = {
        "!": "$1",
        "?": "$2",
        "!!": "$3",
        "??": "$4",
        "!?": "$5",
        "?!": "$6"
      };
      Object.keys(nagMap).forEach(function (symbol) {
        var regex = new RegExp("\\".concat(symbol), "g");
        comment = comment.replace(regex, nagMap[symbol]);
      });
      return comment;
    }

    // Conversion SAN -> PGN
  }, {
    key: "_convertSANtoPGN",
    value: function _convertSANtoPGN(sanMove) {
      // Traite la promotion, les ambiguïtés, les signes + et #, etc.
      // https://fr.wikipedia.org/wiki/Portable_Game_Notation#SAN
      // Exemple : "e8=Q", "Nce4", "O-O+", "e5#"...
      return sanMove.replace(/(\w)\=([QRBN])/g, "$1=$2");
    }

    // Méthode pour récupérer le PGN
  }, {
    key: "getPGN",
    value: function getPGN() {
      var _this = this;
      var pgn = "";

      // Ajout des en-têtes
      Object.keys(this.headers).forEach(function (key) {
        pgn += "[".concat(key, " \"").concat(_this.headers[key], "\"]\n");
      });
      pgn += "\n";

      // Ajout des coups
      var moveIndex = 1;
      this.moves.forEach(function (moveObj, index) {
        if (index % 2 === 0) pgn += "".concat(moveIndex, ". ");
        pgn += _this._formatMoveWithVariations(moveObj);
        if (index % 2 === 1) moveIndex++;
      });
      return pgn.trim();
    }

    // Formater les coups avec les variantes
  }, {
    key: "_formatMoveWithVariations",
    value: function _formatMoveWithVariations(moveObj) {
      var _this2 = this;
      var moveStr = moveObj.move;
      if (moveObj.comment) moveStr += " {".concat(moveObj.comment, "}");
      moveObj.variations.forEach(function (variation) {
        moveStr += " (".concat(_this2._formatMoveWithVariations(variation), ")");
      });
      return moveStr + " ";
    }
  }]);
}();
var _default = exports["default"] = ChessPGN;