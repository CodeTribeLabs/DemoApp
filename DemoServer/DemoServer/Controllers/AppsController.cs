using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using DemoServer.DataProviders;
using DemoServer.Models;

namespace DemoServer.Controllers
{
    public class PlayData
    {
        public int AcctId { get; set; }
        public string AppId { get; set; }
        public int BetAmount { get; set; }
        public string Deck { get; set; }
        public string Action { get; set; }
        public string Digest { get; set; }
    }

    public class ResultData
    {
        public int AcctId { get; set; }
        public string AppId { get; set; }
        public string Result { get; set; }
        public string WinState { get; set; }
        public int Winnings { get; set; }
        public int GameCredits { get; set; }
        public int GameCurrency { get; set; }
    }


    [Route("api/[controller]")]
    [ApiController]
    public class AppsController : ControllerBase
    {
        private IAppsDataProvider _appsDataProvider;
        private IUserDataProvider _userDataProvider;

        private byte[] _cardPile52 = new byte[]
        {
             1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
            27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52
        };

        public AppsController(IAppsDataProvider appsDataProvider, IUserDataProvider userDataProvider)
        {
            this._appsDataProvider = appsDataProvider;
            this._userDataProvider = userDataProvider;
        }

        //[Authorize]
        [HttpGet]
        public async Task<List<App>> Get()
        {
            return await this._appsDataProvider.GetApps();
        }

        [HttpPost("play")]
        public async Task<IActionResult> Play([FromBody] PlayData playData)
        {
            User user = await this._userDataProvider.GetUser(Convert.ToInt32(playData.AcctId));
            ResultData resultData = new ResultData();

            if (user != null)
            {
                if (user.GameCredits >= playData.BetAmount)
                {
                    switch (playData.AppId)
                    {
                        case "2": PlayHigher(playData, resultData); break;
                        default: PlayHighLow(playData, resultData); break;
                    }
                }
                else
                    return BadRequest();
            }
            else
                return NotFound();
            
            if(resultData.WinState != "DRAW")
            {
                await this._userDataProvider.UpdateUserCredits(user.AcctId, resultData.Winnings, 0);
            }

            resultData.AcctId = playData.AcctId;
            resultData.AppId = playData.AppId;
            resultData.GameCredits = user.GameCredits;
            resultData.GameCurrency = user.GameCurrency;

            return Ok(resultData);
        }

        private void PlayHighLow(PlayData playData, ResultData resultData)
        {
            Random rnd = new Random();
            int card = rnd.Next(1, 53); // Generate a ramdom number between 1 and 52
            int rank = GetRankFromValue(card);
            int bet = playData.BetAmount;

            if (rank == 7)
                resultData.WinState = "DRAW";
            else
            {
                if (playData.Action == "HIGH")
                    resultData.WinState = (rank > 7) ? "WIN" : "LOSE";
                else
                    resultData.WinState = (rank < 7) ? "WIN" : "LOSE";
            }

            resultData.Result = "C" + card.ToString();
            resultData.Winnings = (resultData.WinState == "WIN") ? bet : (resultData.WinState == "LOSE") ? -bet : 0;
        }

        private void PlayHigher(PlayData playData, ResultData resultData)
        {
            byte[] shuffledCards = ShuffleCardPile();
            int openedCard = Convert.ToInt32(playData.Deck);
            int bet = playData.BetAmount;

            // Pick the first 4 cards from the shuffled cards
            // If one of the picked cards is equal to the opened card, swap it with the 5th card from the deck
            int card1 = SwapCard(openedCard, shuffledCards[0], shuffledCards[4]);
            int card2 = SwapCard(openedCard, shuffledCards[1], shuffledCards[4]);
            int card3 = SwapCard(openedCard, shuffledCards[2], shuffledCards[4]);
            int card4 = SwapCard(openedCard, shuffledCards[3], shuffledCards[4]);

            switch(playData.Action)
            {
                case "1": resultData.WinState = GetHigherResult(openedCard, card1); break;
                case "2": resultData.WinState = GetHigherResult(openedCard, card2); break;
                case "3": resultData.WinState = GetHigherResult(openedCard, card3); break;
                case "4": resultData.WinState = GetHigherResult(openedCard, card4); break;
            }

            resultData.Result = card1.ToString() + "-" + card2.ToString() + "-" + card3.ToString() + "-" + card4.ToString();
            resultData.Winnings = (resultData.WinState == "WIN") ? bet : (resultData.WinState == "LOSE") ? -bet : 0;
        }   

        private int SwapCard(int openedCard, int card, int swapCard)
        {
            int targetCard = card;

            if (openedCard == card)
                targetCard = swapCard;

            return targetCard;
        }

        private string GetHigherResult(int openedCard, int selectedCard)
        {
            string result = "";
            int openedCardRank = GetRankFromValue(openedCard);
            int selectedCardRank = GetRankFromValue(selectedCard);

            if (selectedCardRank > openedCardRank)
                result = "WIN";
            else if (selectedCardRank < openedCardRank)
                result = "LOSE";
            else
                result = "DRAW";

            return result;
        }

        public static int GetRankFromValue(int value)
        {   // Get the actual card rank regardless of suit
            int rank = value;

            if (value != 99 && value < 53)
            {   // Card Value: 1 - 52
                // Clubs (1-13), Diamonds (14-26), Spades (27-39), Hearts (40-52), Jokers (53-54)
                rank = value % 13;
                if (rank == 0)
                    rank = 13;
            }

            return rank;
        }

        private byte[] ShuffleCardPile()
        {
            byte[] shuffledIndeces;

            shuffledIndeces = ShuffleElements<byte>(_cardPile52);

            return shuffledIndeces;
        }

        private static T[] ShuffleElements<T>(T[] elements)
        {   // This implements Fisher–Yates shuffle algorithm, get a random position and swap it with the current one
            T[] elementsClone = (T[])elements.Clone(); // Clone the source array

            Random r = new Random();

            int len = elementsClone.Length;
            for (int i = len; i > 0; i--)
            {
                int j = r.Next(i);
                T k = elementsClone[j];
                elementsClone[j] = elementsClone[i - 1];
                elementsClone[i - 1] = k;
            }

            return elementsClone;
        }
    }
}