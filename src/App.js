import './App.css';
import { useState,useEffect } from 'react';
import axios from 'axios';




function App() {
const [current,setCurrent] = useState('');

const [external,setExternal] = useState('');


const [vpn,setVpn] = useState(null);


const url = 'https://api.ipgeolocation.io/timezone?apiKey=fc7b5b8f8bea481487222550f39fe933&tz=';


const timezone = async (url) => {
  try {

    const response = await axios.get(url)
    const data = await (response.data)
    setVpn(data)
    console.log(data)
    
  }
   catch (error) {
    console.log(error)
  }
}


const servers = {
iceServers:[
  {
    urls:['stun:stun1.l.google.com:19302','stun:stun2.l.google.com:19302'],
  },

],
iceCandidatePoolSize:10,
};


function determineIps(){
  const pc = new RTCPeerConnection(servers);
  pc.createDataChannel("");
  pc.createOffer().then(offer => pc.setLocalDescription(offer))

  pc.onicecandidate = (ice) => {
    if(!ice || !ice.candidate || !ice.candidate.candidate){
      console.log("all done")
      pc.close();
      return;
    }

    let split = ice.candidate.candidate.split(" ");
    if(split[7] === "host"){

      
      console.log(`Local Ip: ${split[4]}`);
      setCurrent(split[4])
    
    }else{


      
      console.log(`External Ip  ${split[4]}`);
      setExternal(split[4])
    
    }
  };


}


// function getStartup(data,systemTimezone){


//   if(data === systemTimezone){
//     console.log("COUNRY CHECKER",data,systemTimezone);
//   }else{
    
//     console.log("COUNRY CHECKER",data,systemTimezone);


//   }

// }


// const machine = Intl.DateTimeFormat().resolvedOptions().timeZone



useEffect(() => {


 setInterval(() => {
    determineIps();
    timezone(url);
  }, 5000);

  return () => {
    determineIps();
    timezone(url);
  };



},[])

return (
    <div className="App">
     
    {vpn && <div>
      
       {current && <h1>Current Ip Address is  {external}</h1>}
     
   {vpn.geo.ip === external ? <h1>NO VPN DETECTED</h1> : <h1>Vpn DETECTED , VPN IP IS {vpn.geo.ip}</h1> }
      
      </div>}
   
    </div>
  );
}

export default App;
