import {winnerText} from "./WinnerOverlay";

it("checks the winning combinations",() => {

expect(winnerText(["Alan", "Josh"], 7)).toBe("Alan and Josh win!");
expect(winnerText(["Alan", "Josh"], 2)).toBe("Everybody ties!");
expect(winnerText(["Alan"], 2)).toBe("Alan wins!");
expect(winnerText(["Alan", "Josh", "Stephen"], 2)).toBe("Alan, Josh, and Stephen win!");
})
