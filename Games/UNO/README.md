# UNO Card Game (1v1):flower_playing_cards:
**UNO** is an American shedding-type card game that is played with a specially printed deck. The game's general principles put it into the crazy eights family of card games, and it is similar to the traditional European game mau-mau. It has been a Mattel brand since 1992.

🔴 Technologies used, **HTML, CSS, JS**

# **Screenshots 📸**

![](../../assets/images/UNO.png)

<br>


# How this game works:hourglass:

- The game will start automatically upon loading.

- The player and the CPU will each begin with 7 cards, and a number card will begin the Play Pile. The player will go first. The player can either click on a card of matching value or color to play it, play an Action Card (Reverse, Skip, Draw 2, Draw 4, Wild), or if no playable cards are available, click on the Draw Pile for a new card and forfeit their turn.

- Next the CPU will play, either playing an appropriate card or taking one from the Draw Pile.

- Draw 2 (+2) and Draw 4 (+4) cards will automatically add their amount to the victim's hand and advance the turn. Reverse and Skip cards will both skip the victim's turn (since there are only two players, Reverse essentially becomes a Skip). Wild cards may be played at any time.

- The immediate goal is to be the first one to have no cards, at which time the opposing player's cards will be totaled and added to their score according to the following rules:
   >numbered cards 0-9 = face value </br>
   >Reverse, Skip, +2 = 20pts</br>
   >Wild, Wild +4 = 50pts

- **The first player to reach 100 loses the game.**


## How CPU is playing!:computer:
The CPU will have two arrays it keeps track of two arrays:
```js
cpuHand = []
playableCards = []
```

Based on the last card played and it's properties, the CPU will loop through it's cpuHand array, and any card that matches either the value or color of the last card played will be pushed into the playableCards array along with any wilds the CPU may be holding.

Since part of the fun and strategy is knowing when to play your Action Cards, the CPU will randomize their strategy each turn, determined by a Math.Random() variable. If the randomizer is above 0.5, the CPU will prioritize playing Action Cards in an effort to keep their losing score low. If the randomizer is below 0.5, the CPU will hold onto their Action Cards for a later turn and instead play Number Cards. There will also be logic to skip the randomizer once the player gets below a certain number of cards, at which point the CPU will only prioritize Action Cards.

