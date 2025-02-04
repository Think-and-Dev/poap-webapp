import Web3 from 'web3';
import Web3Modal from 'web3modal';
import Portis from '@portis/web3';
// @ts-ignore
import WalletConnectProvider from '@walletconnect/web3-provider';
import { newKit } from '@celo/contractkit';
import CeloGlyph from 'images/celo-glyph.svg';

export const NETWORK = process.env.REACT_APP_ETH_NETWORK || '';

const celoKit = newKit(process.env.REACT_APP_CELO_RPC_URL || 'https://alfajores-forno.celo-testnet.org');

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
    },
  },
  portis: {
    package: Portis,
    options: {
      id: process.env.REACT_APP_PORTIS_APP_ID,
    },
  },
  'custom-celo': {
    display: {
      logo: CeloGlyph,
      name: 'Celo Wallet',
      description: 'Connect to your Celo Wallet account',
    },
    package: celoKit.web3,
    options: {
      id: process.env.REACT_APP_PORTIS_APP_ID,
    },
    connector: async (ProviderPackage: any, options: any) => {
      const provider = new ProviderPackage(options);

      await provider.enable();

      return provider;
    },
  },
};

type connectWalletResponse = {
  web3: any;
  networkError: boolean;
};

export const connectWallet = async (): Promise<connectWalletResponse> => {
  const web3Modal = new Web3Modal({
    network: NETWORK,
    cacheProvider: true,
    providerOptions,
  });

  try {
    const provider = await web3Modal.connect();
    console.log(provider);
    const _web3: any = new Web3(provider);

    const _network = await _web3.eth.net.getNetworkType();
    return {
      web3: _web3,
      networkError: _network && NETWORK.toLowerCase().indexOf(_network.toLowerCase()) === -1,
    };
  } catch (e) {
    console.log('Web3 modal error');
    console.log(e);
    return {
      web3: null,
      networkError: true,
    };
  }
};

export const shortAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;
