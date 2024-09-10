
## Exemple d'utilisation
 
```javascript
 const game = new ChessPGN();
 
 game.setHeader("Event", "F/S Return Match");
 game.setHeader("Site", "Belgrade, Serbia JUG");
 game.setHeader("Date", "1992.11.04");
 game.setHeader("Round", "29");
 game.setHeader("White", "Fischer, Robert J.");
 game.setHeader("Black", "Spassky, Boris V.");
 game.setHeader("Result", "1/2-1/2");

 game.addMove("e4");
 game.addMove("e5");
 game.addMove("Nf3");
 game.addMove("Nc6");
 game.addMove("Bb5", "", true); // Coup dans une variante
 game.addMove("a6", "a speculative move!?");

 console.log(game.getPGN());
```