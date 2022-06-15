import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

interface CoinType {
  currentPrice: number;
  id: string;
  image: string;
  marketCap: number;
  name: string;
  priceChangePercentage24H: number;
  symbol: string;
  totalVolume: number;
}

const transformData = (data: any) => {
  return data.map((coin: any): CoinType => {
    return {
      currentPrice: coin.current_price,
      id: coin.id,
      image: coin.image,
      marketCap: coin.market_cap,
      name: coin.name,
      priceChangePercentage24H: coin.price_change_percentage_24h,
      symbol: coin.symbol,
      totalVolume: coin.total_volume,
    };
  });
};

const App: React.FC = () => {
  const [coins, setCoins] = useState<CoinType[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isFetched, setIsFetched] = useState<boolean>(false);

  useEffect(() => {
    const fetchCoins = async () => {
      const result = await axios(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1`
      );
      setCoins(transformData(result.data));
      setIsFetched(true);
    };
    fetchCoins();
  }, []);

  const handleChange = (e: any) => {
    setSearch(e.target.value);
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="coin-app">
      <div className="coin-search">
        <h1 className="coin-text">Search a currency</h1>
        <form>
          <input
            type="text"
            placeholder="Search"
            className="coin-input"
            onChange={handleChange}
          />
        </form>
      </div>
      <div className="coin-des">
        <h3>Name</h3>
        <h3>Symbol</h3>
        <h3>Price</h3>
        <h3>Volume</h3>
        <h3>Price Change</h3>
        <h3>Marketcap</h3>
      </div>
      {isFetched ? (
        filteredCoins.map((coin) => {
          return (
            <div className="coin-container" key={coin.id}>
              <div className="coin-row">
                <div className="coin">
                  <img src={coin.image} alt="crypto" />
                  <h1>{coin.name}</h1>
                  <p className="coin-symbol">{coin.symbol}</p>
                </div>
                <div className="coin-data">
                  <p className="coin-price">${coin.currentPrice}</p>
                  <p className="coin-volume">
                    ${coin.totalVolume?.toLocaleString()}
                  </p>
                  {coin.priceChangePercentage24H < 0 ? (
                    <p className="coin-percentage red">
                      {coin.priceChangePercentage24H?.toFixed(2)}%
                    </p>
                  ) : (
                    <p className="coin-percentage green">
                      {coin.priceChangePercentage24H?.toFixed(2)}%
                    </p>
                  )}
                  <p className="coin-marketcap">
                    Mkt Cap: ${coin.marketCap?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div style={{ marginTop: '30px' }}>Loading...</div>
      )}
    </div>
  );
};

export default App;
