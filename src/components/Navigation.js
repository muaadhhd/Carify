import { ethers } from 'ethers';
import '../index.css'
import logo from '../assets/plogo.png';

const Navigation = ({ account, setAccount }) => {
    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account);
    }

    return (
        <nav className='flex justify-between items-center h-16 text-white 
        relative shadow-sm font-mono'>
            <div className='md:flex-[3] flex-initial justify-center items-center'>
                <a href='/'>
                    <img src={logo} alt='logo' 
                    className='h-100 w-40 absolute top-0 left-0 cursor-pointer'/>
                </a>
            </div>
            <div className='wrapper'>
            <h2 className='absolute left-[500px] text-2xl top-[65px]'>Parking App</h2>
                {account ? (
                    <button
                        type="button"
                        className='glowbutton'
                    >
                        {account.slice(0, 6) + '...' + account.slice(38, 42)}
                </button>
                ):(
                    <button
                        type='button'
                        className='glowbutton'
                        onClick={connectHandler}
                    >
                        connect
                    </button>
                    
                )}

                <a href='https://github.com/muaadhhd' className='glowbutton absolute left-[900px]'>
                    About
                </a>

            </div>
        </nav>

    );
}

export default Navigation;