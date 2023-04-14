import { useState } from 'react'

import { ToastContainer, toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Card = ({carify, provider, price, setPasses, passes}) => {
  const [buy, setBuy] = useState(null);
  const [cancel, setCancel] = useState(null);
  const [transfer, setTransfer] = useState(null);
  const [renew, setRenew] = useState(null);
  const [address, setAddress] = useState(null);

    const success = async (e) => {
        toast.success(e, {
            position: "top-left",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
    }
    const alreadyOwned = async (e) => {
        toast.error(e, {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
    }
    
    const empty = async (e) => {
        toast.warn(e, {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
    }



    const buyHandler = async () => {
        const owned = await carify.isOwned(buy)

        const signer = provider.getSigner();

        if (buy.trim().length !== 0) {
            if (owned !== true){
                success("Success")
                const transaction = await carify.connect(signer).buyPass(buy, { value: price });
                await transaction.wait()
            }else{
                alreadyOwned("Already Owned")
            }
        } else {
            empty("Empty")
          }
    }

    const cancelHandler = async () => {
        const owned = await carify.isOwned(cancel)
        const signer = provider.getSigner();

        if (cancel.trim().length !== 0) {

            if (owned === true) {
                try {
                    const pass = await carify.getPass(cancel)
                    console.log(pass.id)
                    await carify.connect(signer).cancelPass(cancel, pass.id);
                    
                } catch (error) {
                    alreadyOwned("Not the owner of the pass")   
                }


            } else{
                alreadyOwned("License Plate Does Not Exist")
            }
        } else {
            empty("Empty")
        }

    }

    const transferHandler = async () => {
        const owned = await carify.isOwned(transfer)
        const signer = provider.getSigner();

        if (transfer.trim().length !== 0) {

            if (owned === true) {
                try {
                    const pass = await carify.getPass(transfer)
                    await carify.connect(signer).transferPass(address, pass.id)
                    
                } catch (error) {
                    alreadyOwned("Not the owner of the pass")   
                }


            } else{
                alreadyOwned("License Plate Does Not Exist")
            }
        } else {
            empty("Empty")
        }

        
    }

    const renewHandler = async () => {

        const signer = provider.getSigner();
        const owned = await carify.isOwned(renew)

        if (renew.trim().length !== 0) {

            if (owned === true) {
                success("Renewing")
                const result = await carify.connect(signer).renew(renew, { value: price })
                await result.wait()

                // const expiration = await carify.getPass(licensePlate).expirationDate
                // setRenew(expiration)
            } else{
                alreadyOwned("License Plate Does Not Exist")
            }
        } else {
            empty("Empty")
          }

    }

    return (
        <div className="container">
            <div className="login-box">
                <h2>Buy</h2>
                    <form>
                        <div className="user-box">
                            <input type="text" placeholder="Ex: BD5ISMR" maxLength="7"
                            onChange={(e) => { setBuy(e.target.value) }}
                            
                            />
                            <ToastContainer transition={Flip}/>
                            <label>Register Parking Pass</label>
                            <a className='hover:bg-green-500' onClick={buyHandler}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Buy Pass
                            </a>
                        </div>
                    </form>
            </div>

            <div className="login-box">
                <h2>Cancel</h2>
                    <form>
                        <div className="user-box">
                            <input type="text" placeholder="Ex: BD5ISMR" maxLength="7"
                            onChange={(e) => { setCancel(e.target.value) }}
                            />
                            <label>Cancel Parking Pass</label>

                            <a className='hover:bg-red-500' onClick={cancelHandler}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Cancel Pass
                            </a>
                        </div>
                    </form>
            </div>

            <div className="login-box">
                <h2>Renew</h2>
                    <form>
                        <div className="user-box">
                            <input type="text" placeholder="Ex: BD5ISMR" maxLength="7"
                            onChange={(e) => { setRenew(e.target.value) }}
                            />
                            <label>Renew Parking Pass</label>
                            {/* <h1>{renew}</h1> */}

                            <a className="hover:bg-[#03e9f4]" onClick={renewHandler}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Renew Pass
                            </a>
                        </div>
                    </form>
            </div>
            <div className="login-box">
                <h2>Transfer</h2>
                    <form>
                        <div className="user-box side-by-side ">
                            <input type="text" placeholder="Ex: BD5ISMR" maxLength="7"
                            onChange={(e) => { setTransfer(e.target.value) }}
                            />
                            <label>Transfer Parking Pass</label>
                            <input className="" type="text" placeholder="Ex: 0x7099...79C8"
                            onChange={(e) => { setAddress(e.target.value) }}
                            />
                        </div>
                        <a className='hover:bg-slate-300' onClick={transferHandler}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Transfer Pass
                            </a>
                    </form>
            </div>
        </div>
    );

}

export default Card;