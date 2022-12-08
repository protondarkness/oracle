import logo from './logo.svg';
import './App.css';
import React , {useState, useEffect} from "react";
import ReactDOM from 'react-dom/client';
import axios from "axios";
//import ('@metamask/onboarding');
//require('web3');
//require('eth-sig-util');
const { ethereum } = window;

async function getAccount() {

  let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
  console.log(account);

  return( account);
}

async function checkConnection() {
  let opened =  await ethereum.request({ method: 'eth_accounts' });

  return(opened);
}

function getConnection(){
    let accs = checkConnection();
    return accs;
}

function EtherCheck(props) {
    let innerName = props.buttonName;
 return (
   <button onClick={() => getAccount()} className="btn btn-primary btn-lg btn-block mb-3" >{innerName}</button>
  );

}

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'Message to encrypt'};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.clearText = this.clearText.bind(this);
    this.state = {accountData: null}

  }


    async componentDidMount() {

   const accData = await checkConnection(); // Using await to get the result of async func
   this.setState({ accountData :accData });
   console.log(this.state.accountData);
}

//componentDidUpdate(nextProps, nextState){
//    console.log('h1');
//    if(nextState.accountData != this.state.accountData){
//    this.state.accountData = nextState.accountData;
//    console.log('h2');
//    }
//}

  handleChange(event) {

  this.setState({value: event.target.value
                });
                }
  //clearText(event){ this.setState({value: ''});  }

  handleSubmit = (e) => {
   e.preventDefault();
    axios
      .post('https://jsonplaceholder.typicode.com/posts', {
         title: this.state.value
      })
      .then((response) => {

         this.setState({ title: '' });

      })
      .catch((error) => console.log(error));
};




  render() {

    return (
        <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12 d-flex align-items-stretch">

        <div className="card full-width">
        <div className="card-body">
        <h4>Account: {this.state.accountData}</h4>
        <EtherCheck
        buttonName= {'connect metamask'}
        />

      <form onSubmit={this.handleSubmit}>
           <input  type="text" className="info-text alert alert-warning" id="encryptMessageInput" value={this.state.value} onChange={this.handleChange} />

        <input type="submit" value="Submit" className="btn btn-primary btn-lg btn-block mb-3"/>
        </form>
        </div>
        </div>
        </div>
    );
  }
}


//async function submitVote(){
//    const exampleMessage = encryptMessageInput.value;
//    try {
//      const from = accounts[0];
//      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
//      const sign = await ethereum.request({
//        method: 'personal_sign',
//        params: [msg, from, ''],
//      });
//      signTypedDataResult.innerHTML = sign;
//     // personalSignVerify.disabled = false;
//    } catch (err) {
//      console.error(err);
//      signTypedDataResult.innerHTML = `Error: ${err.message}`;
//    }
//  };




function App() {

  return (
    <div id="encryptMessageInput">


       <NameForm/>
    </div>
  );

}
export default App;
