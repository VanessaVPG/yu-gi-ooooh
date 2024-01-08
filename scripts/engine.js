const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById('score_points'),
  },
  cardSprites: {
    avatar: document.getElementById('card-image'),
    name: document.getElementById('card-name'),
    type: document.getElementById('card-type'),
  },
  playersSides: {
    player1: "player-cards",
    player2: "computer-cards",

  },
  fieldCards: {
    player: document.getElementById('player-field-card'),
    computer: document.getElementById('computer-field-card'),
  },
  actions: {
    button: document.getElementById('next-duel'),
  },
}



const pathImages = "./assets/icons/"

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [1],
  },
]


async function drawnSelectedCard(cardId) {
  state.cardSprites.avatar.src = cardData[cardId].img;
  state.cardSprites.name.innerText = cardData[cardId].name;
  state.cardSprites.type.innerText = "Atribute: " + cardData[cardId].type;
}
async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(cardId, fieldSide) {
  const cardImage = document.createElement('img');
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute('src', `${pathImages}card-back.png`)
  cardImage.setAttribute('data-id', cardId)
  cardImage.classList.add('card');
  

  if (fieldSide === state.playersSides.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawnSelectedCard(cardId)
    })
    cardImage.addEventListener('click', () => {
      setCardField(cardImage.getAttribute('data-id'));
    })
  }

  return cardImage;

}

async function removeAllCardsImages() {
  let cards = document.querySelector("#computer-cards");
  let imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  cards = document.querySelector("#player-cards");
  imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function checkDuelResult(playerCardId, computerCardId) {
  let duelResults = "Empate";
  let playerCard = cardData[playerCardId];
  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = "Ganhou";
    playAudio("win");
    state.score.playerScore++;
  } else if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "Perdeu";
    playAudio("lose");
    state.score.computerScore++;
  } else {
    duelResults = "Empate";
  }
  return duelResults;
}

async function drawButton(text) {
  state.actions.button.innerText = text;
  state.actions.button.style.display = "block";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} |  Lose: ${state.score.computerScore}`;
}

async function resetDuel() {
  state.cardSprites.avatar.src = '';
  state.actions.button.style.display = "none";
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";
  drawCards(5, state.playersSides.player1);
  drawCards(5, state.playersSides.player2);

}

async function setCardField(cardId) {
  await removeAllCardsImages();
  let computerCardId = await getRandomCardId();
  
  await ShowHiddenCardFieldsImages(true);

  await hiddenCardDetails();

  await drawCardsInfields(cardId, computerCardId);

  let duelResults = await checkDuelResult(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults)
}

async function ShowHiddenCardFieldsImages(value) {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";
  if (value) {
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
  }
}

async function hiddenCardDetails() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
}

async function drawCardsInfields(cardId, computerCardId) {
  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomCardId = await getRandomCardId();
    const cardImage = await createCardImage(randomCardId, fieldSide);
    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function playAudio(status) {
  const audio = new Audio(`./assets/audios/${status}.wav`);
  try {
    await audio.play();
  } catch (error) {
    console.log(error);
  }
}
function init() {
  ShowHiddenCardFieldsImages(false);
  drawCards(5, state.playersSides.player1);
  drawCards(5, state.playersSides.player2);
  const bgm = document.getElementById('bgm');
  bgm.play();
}

init();