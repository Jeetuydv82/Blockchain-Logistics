// client/src/context/WalletContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account,   setAccount]   = useState(null);
  const [balance,   setBalance]   = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading,   setLoading]   = useState(false);

  // Auto reconnect on page load
  useEffect(() => {
    checkConnection();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged',    () => window.location.reload());
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
}, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkConnection = async () => {
    if (!window.ethereum) return;
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setConnected(true);
        await fetchBalance(accounts[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBalance = async (address) => {
    try {
      const balance = await window.ethereum.request({
        method : 'eth_getBalance',
        params : [address, 'latest']
      });
      const eth = parseInt(balance, 16) / 1e18;
      setBalance(eth.toFixed(3));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setConnected(false);
      setBalance(null);
      toast.info('Wallet disconnected');
    } else {
      setAccount(accounts[0]);
      setConnected(true);
      fetchBalance(accounts[0]);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not found! Please install it.');
      window.open('https://metamask.io', '_blank');
      return;
    }
    setLoading(true);
    try {
      // Request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Check network — must be Hardhat (chainId 31337 = 0x7a69)
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0x7a69') {
        toast.warning('Please switch to Hardhat Local network!');
        try {
          await window.ethereum.request({
            method  : 'wallet_switchEthereumChain',
            params  : [{ chainId: '0x7a69' }]
          });
        } catch (switchError) {
          // Network not added yet — add it
          await window.ethereum.request({
            method : 'wallet_addEthereumChain',
            params : [{
              chainId           : '0x7a69',
              chainName         : 'Hardhat Local',
              rpcUrls           : ['http://127.0.0.1:8545'],
              nativeCurrency    : { name:'ETH', symbol:'ETH', decimals:18 }
            }]
          });
        }
      }

      setAccount(accounts[0]);
      setConnected(true);
      await fetchBalance(accounts[0]);
      toast.success('Wallet connected!');

    } catch (err) {
      toast.error('Failed to connect wallet');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setConnected(false);
    setBalance(null);
    toast.info('Wallet disconnected');
  };

  const shortAddress = (addr) =>
    addr ? `${addr.slice(0,6)}...${addr.slice(-4)}` : '';

  return (
    <WalletContext.Provider value={{
      account, balance, connected, loading,
      connectWallet, disconnectWallet, shortAddress
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);