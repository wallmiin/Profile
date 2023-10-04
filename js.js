// Get Cards
window.onload = () => {
  var EDITING = false;
  var CACHED_CARDS = {};

  const cardsContainer = document.querySelector(".cards"); // Parent Obj of every Card
  const nullState = document.querySelector(".nullState"); // Container displayed if no cards
  const newCardWindow = document.querySelectorAll(".initialiseCardWindow"); // Genesis Window

  const wizardStepOne = document.querySelector(".front-card");
  const wizardStepTwo = document.querySelector(".back-card");
  const stepOneData = document.querySelector(".front-text");
  const stepTwoData = document.querySelector(".back-text");

  var cards = document.querySelectorAll(".card"); // An Array of every Card

  const CONTROLS = {
    EDIT: document.querySelector(".edit-card"),
    DELETE: document.querySelector(".delete-card"),
    PREVIOUS: document.querySelector(".previous"),
    HISTORY: document.querySelector(".card-history"),
    PAGINATION: document
      .querySelector(".card-pagination")
      .innerHTML.split(" / ")[0],
    NEXT: document.querySelector(".next"),
    TEXT: document.querySelector(".card-pagination"),
    PARENT: document.querySelector(".card-controls"),
    CREATE_CARD: document.querySelector(".card-wizard"),
    CANCEL: document.querySelectorAll(".one-zero"),
    FIRST_STEP: document.querySelector(".one-two"),
    SECOND_STEP: document.querySelector(".two-three"),
    LAST_STEP: document.querySelector(".three-finish"),
  };

  function showCards() {
    nullState.style.display = "none";

    cardsContainer.style.display = "flex";
    CONTROLS.PARENT.style.display = "grid";
  }

  function showNullState() {
    nullState.style.display = "flex";

    cardsContainer.style.display = "none";
    CONTROLS.PARENT.style.display = "none";
  }

  function refreshPagination() {
    if (!cards[0]) {
      return showNullState();
    }
    cards[CONTROLS.PAGINATION - 1].classList.remove("current");
    CONTROLS.TEXT.innerHTML = `1 / ${cards.length}`;
    CONTROLS.PAGINATION = document
      .querySelector(".card-pagination")
      .innerHTML.split(" / ")[0];
    cards[0].classList.add("current");
  }

  function refreshListeners() {
    cards = document.querySelectorAll(".card");
    cards.forEach((face) => {
      face.removeEventListener("click", flipCard, true);
      face.addEventListener("click", flipCard, true);
    });
  }

  CONTROLS.EDIT.addEventListener("click", () => {
    // Get Current Card & Details

    cardsContainer.style.display = "none";
    CONTROLS.PARENT.style.display = "none";
    CONTROLS.CREATE_CARD.style.display = "block";
    EDITING = true;

    stepOneData.innerText =
      cards[CONTROLS.PAGINATION - 1].children[0].innerText;
    stepTwoData.innerText =
      cards[CONTROLS.PAGINATION - 1].children[1].innerText;
  });

  CONTROLS.DELETE.addEventListener("click", async () => {
    // Get Current Card, Remove Card, Refresh Pagination
    let card = cards[CONTROLS.PAGINATION - 1];
    CACHED_CARDS[card.id] = card;
    card.remove();
    await refreshPagination();
    await refreshListeners();
    await refreshPagination();
  });

  CONTROLS.PREVIOUS.addEventListener("click", () => {
    if (cards.length == 1) {
      return 0;
    }

    cards[CONTROLS.PAGINATION - 1].classList.remove("current");
    if (CONTROLS.PAGINATION == 1) {
      CONTROLS.PAGINATION = cards.length;
      cards[CONTROLS.PAGINATION - 1].classList.add("current");
      CONTROLS.TEXT.innerHTML = `${CONTROLS.PAGINATION} / ${cards.length}`;
      return 1;
    }
    CONTROLS.PAGINATION--;
    cards[CONTROLS.PAGINATION - 1].classList.add("current");
    CONTROLS.TEXT.innerHTML = `${CONTROLS.PAGINATION} / ${cards.length}`;
    return 1;
  });

  CONTROLS.NEXT.addEventListener("click", () => {
    if (cards.length == 1) {
      return 0;
    }

    cards[CONTROLS.PAGINATION - 1].classList.remove("current");

    if (CONTROLS.PAGINATION == cards.length) {
      CONTROLS.PAGINATION = 1;
      cards[0].classList.add("current");
      CONTROLS.TEXT.innerHTML = `${CONTROLS.PAGINATION} / ${cards.length}`;
      return 1;
    }
    CONTROLS.PAGINATION++;
    cards[CONTROLS.PAGINATION - 1].classList.add("current");
    CONTROLS.TEXT.innerHTML = `${CONTROLS.PAGINATION} / ${cards.length}`;
    return 1;
  });

  CONTROLS.HISTORY.addEventListener("click", () => {
    // Show the Panel of Previous Cards
  });

  function flipCard(face) {
    face = face.path[0];
    face.classList.toggle("flip");
  }

  if (cards.length == 0) {
    showNullState();
  } else {
    showCards();
  }

  // Create a New Card Window
  newCardWindow.forEach((initCardWindow) => {
    initCardWindow.addEventListener("click", () => {
      showNullState();
      nullState.style.display = "none";
      CONTROLS.CREATE_CARD.style.display = "block";
    });
  });

  CONTROLS.FIRST_STEP.addEventListener("click", () => {
    // Hide Step 1, Show Step 2
    wizardStepOne.style.display = "none";
    wizardStepTwo.style.display = "table";
  });

  CONTROLS.CANCEL[0].addEventListener("click", () => {
    CONTROLS.CREATE_CARD.style.display = "none";
    cards.length == 0 ? (nullState.style.display = "grid") : showCards();
  });

  CONTROLS.CANCEL[1].addEventListener("click", () => {
    wizardStepOne.style.display = "table";
    wizardStepTwo.style.display = "none";
  });

  CONTROLS.LAST_STEP.addEventListener("click", () => {
    if (EDITING) {
      let newFront = stepOneData.innerText;
      let newBack = stepTwoData.innerText;

      let editCard = new Card(CONTROLS.PAGINATION - 1);
      editCard.editCard(cards, newFront, newBack);

      stepOneData.innerHTML = stepTwoData.innerHTML = "";

      wizardStepOne.style.display = "table";
      wizardStepTwo.style.display = "none";
      CONTROLS.CREATE_CARD.style.display = "none";
      refreshListeners();
      refreshPagination();
      showCards();

      EDITING = false;
      return 0;
    }
    // Get User Input for Front & Back of Card, submit to new Card
    let c1 = new Card(
      cards.length + 1,
      stepOneData.innerText,
      stepTwoData.innerText
    );
    stepOneData.innerHTML = "";
    stepTwoData.innerHTML = "";
    c1.createCard(cardsContainer);

    wizardStepOne.style.display = "table";
    wizardStepTwo.style.display = "none";
    CONTROLS.CREATE_CARD.style.display = "none";

    refreshListeners();
    refreshPagination();
    showCards();
  });

  refreshPagination();
  refreshListeners();

  // nullState.style.display="none";
  CONTROLS.CREATE_CARD.style.display = "none";
  cardsContainer.style.display = "none";
};

// Card

class Card {
  constructor(id, front, back) {
    this.id = id;
    this.front = front;
    this.back = back;

    this.editCard = (cards, toEditFront, toEditBack) => {
      let front = cards[id].children[0];
      let back = cards[id].children[1];

      front.innerText = toEditFront;
      back.innerText = toEditBack;
    };

    this.createCard = (cardsContainer) => {
      var cardBase = document.createElement("div"); // Create HTML Element
      cardBase.id = this.id;
      cardBase.classList.add("card");
      this.id == 1 ? cardBase.classList.add("current") : "";

      var cardFront = document.createElement("div");
      cardFront.classList.add("card__front");
      cardFront.innerHTML = this.front;

      var cardBack = document.createElement("div");
      cardBack.classList.add("card__back");
      cardBack.innerHTML = this.back;

      cardBase.append(cardFront);
      cardBase.append(cardBack);

      cardsContainer.append(cardBase);
    };
  }
}
