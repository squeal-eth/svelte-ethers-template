<script lang="ts">
  import { onMount } from "svelte";
  import { BigNumber } from "ethers";

  import { CONTRACT, ethereum, provider, signer } from "./lib/web3";
  import { connect, requestNetwork } from "./lib/web3/helpers";
  import ABI from "./lib/web3/abi.json";

  const CONTRACT_ADDRESS = "0xa2c31e73F45496fC9Fb23598f860591D33ea3968"; //randomice rinkeby

  let account = "";
  let contract: any = null;
  async function init() {
    const accounts = await connect();
    contract = CONTRACT(CONTRACT_ADDRESS, ABI, provider);
    contractWithSigner = contract.connect(signer);
    account = accounts[0];
    requestNetwork({ chainId: "0x4" }); // request to connect to rinkeby, 0x1 for mainnet
  }

  $: {
    if (ethereum) {
      ethereum.on("chainChanged", function () {
        window.location.reload();
      });
    } else {
      console.log("No ethereum?");
    }
  }

  //call init as soon as the app loads
  onMount(() => {
    if (ethereum) init();
  });

  //Interact with contract, place your abi.json and address ./lib/web3
  let transactionHash;
  let contractWithSigner;

  async function getNftPrice() {
    return await contractWithSigner.cost();
  }
  async function mintNFT() {
    const cost = await getNftPrice();

    let { hash } = await contractWithSigner.mint(account, {
      value: BigNumber.from(cost).toString(),
      gasLimit: 250000,
    });
    transactionHash = hash;
  }
</script>

{#if ethereum}
  {#if !account}
    <button on:click={init}>Connect</button>
  {:else}
    <p>connected as {account}</p>
    <div>
      <button on:click={mintNFT}>Mint</button>
      {#if transactionHash}
        <a href="https://rinkeby.etherscan.io/tx/{transactionHash}"
          >https://rinkeby.etherscan.io/tx/{transactionHash}</a
        >
      {/if}
    </div>
  {/if}
{:else}
  <p>Please install metamask</p>
{/if}
