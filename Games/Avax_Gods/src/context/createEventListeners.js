import { ethers } from "ethers";
import { ABI } from "../contract";
import { playAudio, sparcle } from "../utils/animation";
import { attackSound, defenseSound } from "../assets";

const emptyAccount = "0x0000000000000000000000000000000000000000";
const addNewEvent = (eventFilter, provider, cb) => {
  provider.removeListener(eventFilter); //to not have multiple listeners on same event at same time
  provider.on(eventFilter, (logs) => {
    const parsedLogs = new ethers.utils.Interface(ABI).parseLog(logs);
    cb(parsedLogs);
  });
};
const getCards = (cardRef) => {
  const { left, top, width, height } = cardRef.current.getBoundingClientRect();
  return {
    pageX: left + width / 2,
    pageY: top + height / 2.25,
  };
};
export const createEventListeners = ({
  navigate,
  contract,
  provider,
  walletAddress,
  setShowAlert,
  setUpdateGameData,
  player1Ref,
  player2Ref,
}) => {
  const newPlayerEventFilter = contract.filters.NewPlayer();
  addNewEvent(newPlayerEventFilter, provider, ({ args }) => {
    if (walletAddress.toLowerCase() === args.owner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "success",
        message: "Player has been successfully registered",
      });
    }
  });


  const newGameTokenEventFilter = contract.filters.NewGameToken();
  addNewEvent(newGameTokenEventFilter, provider, ({ args }) => {
    if (walletAddress.toLowerCase() === args.owner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "success",
        message: "Player game token has been successfully created",
      });
      navigate("/create-battle");
    }
  });

  const newBattleEventFilter = contract.filters.NewBattle();
  addNewEvent(newBattleEventFilter, provider, ({ args }) => {
    if (
      walletAddress.toLowerCase() === args.player1.toLowerCase() ||
      walletAddress.toLowerCase() === args.player2.toLowerCase()
    ) {
      navigate(`/battle/${args.battleName}`);
    }

    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });
  const BattleMoveEventFilter = contract.filters.BattleMove();
  addNewEvent(BattleMoveEventFilter, provider, ({ args }) => {
  });

  const RoundedEndedEventFilter = contract.filters.RoundEnded();
  addNewEvent(RoundedEndedEventFilter, provider, ({ args }) => {
    for (let i = 0; i < args.damagedPlayers.length; i += 1) {
      if (args.damagedPlayers[i] !== emptyAccount) {
        if (args.damagedPlayers[i] === walletAddress) {
          sparcle(getCards(player1Ref));
        } else if (args.damagedPlayers[i] !== walletAddress) {
          sparcle(getCards(player2Ref));
        }
        playAudio(attackSound);
      } else {
        playAudio(defenseSound);
      }
    }
    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  const BattleEndedEventFilter = contract.filters.BattleEnded();
  addNewEvent(BattleEndedEventFilter, provider, ({ args }) => {
     if(walletAddress.toLowerCase()==args.winner.toLowerCase())
     {
      setShowAlert({status: true,
        type: "success",
        message: "You won!",})
     }
     else
     {
      setShowAlert({status: true,
        type: "failure",
        message: "You lost!",})
     }
     navigate("/")
  });
};
