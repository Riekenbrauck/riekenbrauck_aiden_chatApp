import ChatMessage  from './modules/ChatMessage.js';

const socket = io();

function logConnect({sID, message}) {
    console.log(sID, message);
    vm.socketID = sID;
}


function appendMessage(message){
    vm.messages.push(message);
}

//createe new vue instance
const vm = new Vue ({
    data: {
        socketID: "",
        nickname: "",
        message: "",
        messages: []
    },

    methods: {
        dispatchMessage(){
            //emit message event from the client side
            socket.emit('chat message', { content: this.message, name: this.dispatchMessage.nickname ||
            "Anon"});

            //rest the message feild
            this.message = "";
        }
    },

    components: {
        newmessage: ChatMessage
    }


}).$mount(`#app`);

socket.on('connected', logConnect);
socket.addEventListener('chat message', appendMessage);
socket.addEventListener('disconnect', appendMessage);