import { useEffect, useState } from 'react'

const Card = ({carify, provider, price}) => {
  const [licensePlate, setLicensePlate] = useState(null)

    const buyHandler = async (e) => {
    const signer = await provider.getSigner()
    
    licensePlate = await carify.connect(signer).buyPass(e, { value: price });
    console.log(licensePlate);
    setLicensePlate(licensePlate)

    }

    return (
        <div className="container">
            <div class="login-box">
                <h2>Parking App</h2>
                    <form>
                        <div class="user-box">
                            <input type="text" placeholder="Car's Plate..."
                            />
                            <label>Register Pass</label>

                            <a onClick={(e)=> { buyHandler(e)}}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Submit
                            </a>
                        </div>

                    </form>
            </div>
            <div class="login-box">
                <h2>Parking App</h2>
                    <form>
                        <div class="user-box">
                            <input type="text" name="" required=""/>
                            <label>Cancel Pass</label>
                        </div>
                        {/* <div class="user-box">
                            <input type="submit" name="" required=""/>
                            <label>Transfer Pass</label>
                        </div>
                        <div class="user-box">
                            <input type="text" name="" required=""/>
                            <label>Renew Pass</label>
                        </div> */}
                            <a href="#">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Submit
                            </a>
                    </form>
            </div>
        </div>
    );

}

export default Card;