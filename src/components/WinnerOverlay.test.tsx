import {winnerText} from "./WinnerOverlay";

it("checks the winning combinations",() => {

const md = [{id: 0, name: "Alan"}, {id : 1, name: "Josh"}]

const other = {id: 3, name: "XX"};

expect(winnerText(["0", "1"], [...md, other])).toBe("Alan and Josh win!");
expect(winnerText(["0", "1"], md)).toBe("Everybody ties!");
expect(winnerText(["0"], [md[0]])).toBe("Alan wins!");
expect(winnerText(["0", "1", "2"], [...md, {name: "Stephen", id: 2}, other]))
    .toBe("Alan, Josh, and Stephen win!");
})
