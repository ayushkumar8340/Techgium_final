const rosnodejs = require('rosnodejs');
const express = require('express');
const app = express();
const cv = require('opencv4nodejs');
const http = require('http');
const server = http.createServer(app);
const { Server, Socket } = require("socket.io");
const { CV_16S } = require('opencv4nodejs');
const io = new Server(server);
// const wCap = new cv.VideoCapture(0);

var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "*");
    next();
};

// mongoose
//   .connect(`mongodb://localhost/techgium`)
//   .then(() => console.log("connected to MongoDB"))
//   .catch((err) => console.error("could not connect to MongoDB...", err));

app.use(express.json());
app.use(allowCrossDomain);
rosnodejs.initNode('/my_node').then(() => {
    const nh = rosnodejs.nh;
    nh.subscribe('/express', 'std_msgs/String', (msg) => {
        console.log(msg);
        io.emit('data', msg);
    });
    nh.subscribe('/express_video', 'std_msgs/String', (msg) => {
        // const image = cv.imencode('.jpg', msg).toString('base64');
        io.emit("stream", msg);
        
    });
    // nh.subscribe('manager_profile', 'std_msgs/String', (msg) => {
        
    // })
}).catch(err => console.log(err))

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

app.post('/', async (req, res) => {
    const length = req.body.data.length;
    const breadth = req.body.data.breadth;
    const nh = rosnodejs.nh;
    const pub = nh.advertise('/ros_start', 'std_msgs/String');
    const dt = JSON.stringify({ flag: 1, length: length, breadth: breadth });
    // console.log(dt);
    pub.publish({ data: dt });
    res.status(200).send();
});

app.get('/stop', async (req, res) => {
    const nh = rosnodejs.nh;
    const pub = nh.advertise('/flag_stop', 'std_msgs/String');
    const dt = JSON.stringify({ flag: 0 });
    pub.publish({ data: dt });
    res.status(200).send();
});

app.get('/get_profile', async (req, res) => {
    const nh = rosnodejs.nh;
    const pub = nh.advertise('/profile_flag', 'std_msgs/String');
    const dt = JSON.stringify({flag: 1});
    pub.publish({data: dt});
    res.status(200).send();
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});

