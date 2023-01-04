import React, { useState } from 'react'
import firebase from '../firebase';
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
import axios from 'axios';

const SignUp = () => {
    const [firstName, setFirstName] = useState('')
    const [middleName, setMiddleName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    

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
        signUp()
      };

    const signUp = () => {
        const appVerifier = window.recaptchaVerifier;
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
                    axios.post('http://localhost:5001/user/signup', {
                        firstName: firstName,
                        middleName: middleName,
                        lastName: lastName,
                        phoneNumber: phoneNumber,
                        address: address,
                        registrationToken: currentToken
                    }, 
                    {
                        headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${user.multiFactor.user.accessToken}` 
                        }   
                        }).then(response => {
                        console.log(response.data)
                    })
                    }
            })
            })
            // ...
          }).catch((error) => {
            console.log(error)
            // Error; SMS not sent
            // ...
          });
    }
    const onSignSubmit = (e) => {
        e.preventDefault()
        setUpRecaptcha()
    }
   
    return (
        <div>
          <div id='recaptcha-container'></div>
            <div>
                <form onSubmit={onSignSubmit} style={{ width: '20%', marginTop: 250, marginLeft: 'auto',marginRight:'auto',display: 'flex', flexDirection: 'column' }}>
                    <input style={{marginTop: 5, marginBottom: 5, padding: 5, borderColor: 'white'}} type='text' placeholder='First Name' value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
                    <input style={{marginTop: 5, marginBottom: 5, padding: 5, borderColor: 'white'}} type='text' placeholder='Middle Name' value={middleName} onChange={(e)=>setMiddleName(e.target.value)}/>
                    <input style={{marginTop: 5, marginBottom: 5, padding: 5, borderColor: 'white'}} type='text' placeholder='Last Name' value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
                    <input style={{marginTop: 5, marginBottom: 5, padding: 5, borderColor: 'white'}} type='text' placeholder='Phone Number' value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)}/>
                    <input style={{marginTop: 5, marginBottom: 5, padding: 5, borderColor: 'white'}} type='text' placeholder='Address' value={address} onChange={(e)=>setAddress(e.target.value)}/>
                    <input style={{marginTop: 5, marginBottom: 5, padding: 5, borderColor: 'white'}} type='submit'/>                        
                </form>
            </div>

        </div>
    )
}

export default SignUp
