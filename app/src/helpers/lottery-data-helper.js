
import { customlocaleString } from 'src/helpers'

export {
  parseLotteryData,
  checkForWinnerTicket,
};

function parseLotteryData(lotteryData) {
  return lotteryData.map(item => {
    return {
      contestNumber: item.concurso,
      date: item.data,
      drawnNumbers: item.dezenas.map(num => Number(num)),
      prizeForNextContest: item.acumuladaProxConcurso,
      awards: {
        sena: {
          winners: item.premiacoes[0].vencedores,
          prize: item.premiacoes[0].premio,
        },
        quina: {
          winners: item.premiacoes[1].vencedores,
          prize: item.premiacoes[1].premio,
        },
        quadra: {
          winners: item.premiacoes[2].vencedores,
          prize: item.premiacoes[2].premio,
        }
      },
    }
  })
}

function checkForWinnerTicket(selectedNumbers, lotteryData) {
  // Selected 6 numbers?
  if (selectedNumbers.length !== 6) {
    return [];
  }

  let results = [];

  for (const contest of lotteryData) {
    const hits = [];

    for (const i of selectedNumbers) {
      if (contest.drawnNumbers.includes(i)) {
        hits.push(i);
      }
    }

    if (hits.length == 4) {
      results.push(getPrizeText('quadra', hits, contest));
    } else if (hits.length === 5) {
      results.push(getPrizeText('quina', hits, contest));
    } else if (hits.length === 6) {
      results.push(getPrizeText('sena', hits, contest));
    }
  }

  return results;
}

const getPrizeText = (prize, hits, contest) => {
  // First line - which contest, date and how many hits
  const firstLine = (
    <span>No concurso <i>{contest.contestNumber}</i>,
      em {contest.date}, você acertaria a <b>{prize}</b>{prize !== 'sena' && ` com ${hits.join(', ')}`}.
    </span>);


  // Second line - winners and prize
  let secondLine;

  if (contest.awards[prize].winners > 1) {
    secondLine = <span>Na ocasião, {customlocaleString(contest.awards[prize].winners)} pessoas acertaram e cada uma levou <b>R$ {contest.awards[prize].prize}</b>.</span>
  } else if (contest.awards[prize].winners === 1) {
    secondLine = <span>Na ocasião, {customlocaleString(contest.awards[prize].winners)} pessoa acertou e levou <b>R$ {contest.awards[prize].prize}</b>.</span>
  } else {
    const noWinnerfragment = `Na ocasião, ninguém acertou.`;
    if (contest.prizeForNextContest) {
      secondLine = <span>{noWinnerfragment}<br />Aproximadamente <b>{contest.prizeForNextContest}</b> foram acumulados para o próximo concurso.</span>
    } else {
      secondLine = <span>{noWinnerfragment}</span>
    }
  }

  return { contestNumber: contest.contestNumber, firstLine, secondLine };
}
// TODO: testes unitários nesse arquivo