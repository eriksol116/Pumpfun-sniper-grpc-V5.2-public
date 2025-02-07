# 🚀 **PumpFun Sniper Bot v5.2 (using Geyser(Yellowstone))** 

Pumpfun sniper bot V5.2 snipe new token within 1 or 2 blocks after token mint. so this bot snipe token very fast and sell them anytime.
Bot always make profit. There are some sell strategy.

Welcome to the **PumpFun Sniper Bot v5.2**! This bot watches for new `pump.fun` token mints on the Solana blockchain in real-time by using Geyser(Yellowstone), making it the perfect tool to monitor token launches. 🌟

### 🎯 **Key Features**

- 🛰️ **Real-time WebSocket Streaming**: 
  Connects to Solana's blockchain through Helius RPC WebSocket or  VibeStation RPC WebSocket and listens for new transactions, specifically targeting `pump.fun` mint instructions.
  
- 🔍 **Filter Pump.fun Token Mints**: 
  Filters transactions by program IDs and instruction discriminators related to `pump.fun`.

- 📊 **Formatted Data**: 
  Logs essential transaction details like the transaction signature, creator's wallet, and the minted token address when a new `pump.fun` token is detected.

- ⚡ **Efficient Stream Handling**: 
  Handles WebSocket stream events efficiently, ensuring no loss of data and continuous monitoring.

---


## 📞 **Stay Connected**

Gmail: tom.kinddev@gmail.com

Telegram: [@erikerik116](https://t.me/erikerik116)

Discord: @erikerik116

## 🧑‍💻 **GMGN**

This bot always make profit.

Link : **[https://gmgn.ai/sol/address/DYW2cn4vCDLm3AW66E2ubujoudaXxdyu7TeMDE9iD8Vo](https://gmgn.ai/sol/address/DYW2cn4vCDLm3AW66E2ubujoudaXxdyu7TeMDE9iD8Vo)**

![gmgn-pumpfun-sniper-grpc](https://github.com/user-attachments/assets/659f879f-a33a-4cc4-b578-3d97faa030d0)


![grpc-sniper-filter-success](https://github.com/user-attachments/assets/cc873fbb-f164-4d3a-b6f4-237fb7454ba1)


## 🧑‍💻 **Transactions**

Token mint : https://solscan.io/tx/2zjrjqA6Jfrqc8FpasmfY4Eedgci36QoXVHCr2dS8MGQ7F4hEN8TQJ37TetYP75cj1u9kh4Eu7NgDvRvqZ425GBW

![grpc-buy-1-block-mint](https://github.com/user-attachments/assets/5ad5c0a9-1931-41fd-a088-630e58866078)

Token but : https://solscan.io/tx/2fJctjpCnidkCQqcWupj9rcyVYRYVNodNWV6982RDmXyXmiHVozvgPrBwqWwvhQiEvFJ8BsaUXN1HPF2GW856VXb

![grpc-buy-1-block-buy](https://github.com/user-attachments/assets/1bc5edcb-716d-4e5f-9fef-0ff10bc8cf16)


## 🧑‍💻 **Recording Video**



https://github.com/user-attachments/assets/a6860c28-c8f4-4172-8765-1923db08d4ad




## 🚀 **Getting Started**

Follow these steps to get your **PumpFun Sniper Bot v5.2** up and running!

### Installation

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/eriksol116/Pumpfun-sniper-grpc-V5.2-public.git
    ```

2. **Install Dependencies**:

    Navigate to the project directory and run the following command:

    ```bash
    cd Pumpfun-sniper-grpc-V5.2-public
    npm install
    ```

3. **Configure API Token**:

    Replace the API token in the `ENDPOINT` variable:

    ```ts
    const ENDPOINT = "http://ultra.swqos.solanavibestation.com/?api_key=";
    ```
    And set other variables in env file.

4. **Run the Bot**:

    Start the bot by running:

    ```bash
    npm run start
    ```

---

## 🧑‍💻 **Sell Requirments**

1. PRICE_CHECK_INTERVAL (ms) :
   Interval in milliseconds for checking the take profit and stop loss conditions
   Set to zero to disable take profit and stop loss.

2. TAKE_PROFIT : x %

3. STOP_LOSS : x  %

4. SELL_SLIPPAGE : x %

5. SKIP_SELLING_IF_LOST_MORE_THAN : x %
   If token loses more than X% of value, bot will not try to sell

6. PRICE_CHECK_DURATION (ms) : x %
   Time in milliseconds to wait for stop loss/take profit conditions
   If you don't reach profit or loss bot will auto sell after this time
   Set to zero to disable take profit and stop loss

7. AUTO_SELL - true/false

8. MAX_SELL_RETRIES - Maximum number of retries for selling a token


This is finish version bot.
But it's MVP code. If u need perfect code, contact me.
