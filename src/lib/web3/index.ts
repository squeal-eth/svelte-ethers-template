import { ethers } from "ethers";

const ethereum = window["ethereum"];
const provider = new ethers.providers.Web3Provider(ethereum);
const chain = ethereum.networkVersion;
const signer = provider.getSigner();

const CONTRACT = (address, abi, prov) =>
  new ethers.Contract(address, abi, prov);
export { ethereum, provider, chain, signer, CONTRACT };
