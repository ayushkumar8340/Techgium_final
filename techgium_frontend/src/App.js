import React, { useState } from "react";
import io from "socket.io-client";
import Initializer from "./component/Inititalizer";
import $ from "jquery";
import axios from 'axios';
import "./App.css";
import "./fontawesome.min.css"

function App() {
  const [socket, setSocket] = useState(null);

  const createNewSocket = async (length, breadth) => {
    const newSocket = io(`http://${window.location.hostname}:3000`, { transports : ['websocket'] });
    // newSocket.emit("start", JSON.stringify([length, breadth]));
    await axios.post('http://localhost:3000/', {data: {length, breadth}});
    setSocket(newSocket);
  };

  const deleteSocket = () => {
    axios.get('http://localhost:3000/stop');
    setSocket(null);
  };
  $("input").on("focusin", function () {
    $(this).parent().find("label").addClass("active");
  });

  $("input").on("focusout", function () {
    if (!this.value) {
      $(this).parent().find("label").removeClass("active");
    }
  });

  return (

    <div className="App">
      <div className="chat-container">
        <Initializer
          socket={socket}
          createNewSocket={createNewSocket}
          deleteSocket={deleteSocket}
        />
      </div>
    </div>
  );
}

export default App;
