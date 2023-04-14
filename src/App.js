import { useEffect, useReducer, useState } from 'react'
import { ethers } from 'ethers'

// ABIs
import ABI from './abis/Carify.json'

// Compnents
import Navigation from './components/Navigation'
import Card from "./components/Card"

// Config
import config from './config.json';


function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [carify, setCarify] = useState(null)

  const [remainingSpots, setRemainingSpots] = useState(null)
  const [passes, setPasses] = useState([])
  const [cost, setCost] = useState(null)
  const [price, setPrice] = useState(null)
  const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0);
  


  const loadBlockchainData = async () => {

    //Allows to changed accounts automatically
    window.ethereum.on('accountsChanged', async () => {
      if (window.etherum !== "undefined") {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account);
      }
    })

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()

    const carify = new ethers.Contract(config[network.chainId].Carify.address, ABI, provider)
    setCarify(carify)

    //Remaining Spots
    const maxSpots = await carify.maxSpots();
    const totalPassHolders = await carify._tokenIdCounter();
    let remainingSpots = maxSpots - totalPassHolders;
    setRemainingSpots(remainingSpots)

    //Parking Pass Price
    const amount = await carify.price();
    const cost = ethers.utils.formatEther(parseInt(amount._hex).toString())
    setCost(cost)

    const price = await carify.price();
    setPrice(price)

    forceUpdate()
  }

  useEffect(() => {
    loadBlockchainData()

  }, [reducerValue]) 


  return (

    <div>
      <Navigation account={account} setAccount={setAccount}/>
      <Card carify={carify} provider={provider} price ={price} setPasses={setPasses}
      passes={passes}/>

      <div>
        <h1 className='absolute font-mono font text-white'> {remainingSpots} Spots left</h1>
        <p className='absolute font-mono font text-white'>PRICE: {cost} ETH</p>
      </div>
    </div>

  );
}

export default App;
