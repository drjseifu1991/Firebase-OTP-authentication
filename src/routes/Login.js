import React, { useState } from 'react'
import axios from 'axios';
import firebase from '../firebase'
import { useNavigate } from 'react-router-dom'
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import firebaseConfig from '../firebaseConfig';

const Login = () => {
  const setUpRecaptcha = () => {
    const auth = getAuth()
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'normal',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
        console.log('recptacha created')
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
      }
    }, auth);
    login()
  };
    const [phoneNumber, setPhoneNumber] = useState('')
    const navigate = useNavigate()

    const onSignIn = (e) => {
      e.preventDefault()
      setUpRecaptcha()
    }

    const login = (e) => {
      const appVerifier = window.recaptchaVerifier;
      console.log(firebase)
      firebase.auth().
      signInWithPhoneNumber(phoneNumber, appVerifier)
          .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            const code = window.prompt('Enter OTP')
            confirmationResult.confirm(code)
            .then(result => {
              const user = result.user
              console.log(user.multiFactor.user.accessToken)
              firebase.messaging().getToken().then((currentToken) => {
                console.log(currentToken)
                if(currentToken) {
                    axios.post('http://localhost:5001/user/login',{
                        registrationToken: currentToken
                    },
                    {
                        headers: {
                            "Access-Control-Allow-Origin" : "*",
                            "Content-type": "Application/json",
                            Authorization: `Bearer ${user.multiFactor.user.accessToken}`
                        }
                    })
                }
              })
            })
            // ...
          }).catch((error) => {
            // Error; SMS not sent
            // ...
          });
    }
    
    return (
      <div>
        <div id='recaptcha-container'></div>
        {
          (
            <div>
               <form onSubmit={onSignIn} style={{ width: '20%', marginTop: 250, marginLeft: 'auto',marginRight:'auto',display: 'flex', flexDirection: 'column' }}>
                  <input style={{marginTop: 10, marginBottom: 5, padding: 5, borderColor: 'white'}} type='text' placeholder='Phone Number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                  <input style={{marginTop: 10, marginBottom: 5, padding: 5, borderColor: 'white'}} type='submit' value='LOGIN'/>
                </form> 
                <button style={{marginTop: 10, marginBottom: 5, padding: 5, borderColor: 'white'}} onClick={()=> navigate('/signup')}>I am New User</button>
            </div>
          )
        }
      </div>
    )
}

export default Login