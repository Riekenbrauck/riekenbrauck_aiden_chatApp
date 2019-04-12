import ChatMessage  from './modules/ChatMessage.js';

const socket = io();

function logConnect({sID, message}) {
    console.log(sID, message);
    vm.socketID = sID;
}


var date = new Date();
	socket.emit('chat message', { content: "New user", name: "Bot", time: date});

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
        dispatchMessage() {
			// only send message if there's a message to send
			if (this.message) {
				var date = new Date();
				socket.emit('chat message', { content: this.message, name: this.nickname || 'Anon', time: date});
			}
			// reset the message field
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

(function() {
    const DOM_STRINGS = {
        chatForm: '.chat-form',
        chatBox: '.chat-box',
        emoteList: '.emote-list',
        emotesButton: '.emotes-button',
        emoteItem: '.emote-item',
        messages: '.messages'
    }
    
    const URLS = {
        cors: 'https://cors-anywhere.herokuapp.com/',
        twitchApiUrl: 'https://twitchemotes.com/api_cache/v3/global.json'
    }
    //Save the EMOTE data in a variable
    let emoteJSON;
    //Create a random user-id for a visitor
    const userId = Math.round(Math.random() * 500);
    
    //Replaces each instance of an emote name with an img tag containing the emote src
    function replaceEmoteNameWithImgDOM(text) {
        const textArr = text.split(' ');
        const a =  textArr.map(word => {
            if(word === "") return "";
            if(emoteJSON[word]) {
                return(
                    `<img
                        class="message-emote" 
                        src="https://static-cdn.jtvnw.net/emoticons/v1/${emoteJSON[word].id}/1.0"
                        data-emotename=${word} 
                        alt="${word}"
                    />`
                );
            }
            return word;
        });
        return a.join(' ');
    }
    
    function appendMessageToMessageList(text) {
        const messages = document.querySelector(DOM_STRINGS.messages)
        const messageDOM = 
        `
        <div class="message">
            <span class="message-username">codepen-user-${userId}:</span>
            <div class="message-text">${replaceEmoteNameWithImgDOM(text)}</div>
        </div>
        `;
        messages.insertAdjacentHTML('beforeend', messageDOM);
        messages.scrollTop = messages.scrollHeight;
    }
    
    function handleFormSubmit(event) {
        event.preventDefault();
        const text = document.querySelector(DOM_STRINGS.chatBox).value;
        if(text === '') return;
        appendMessageToMessageList(text);
        this.reset();
    }
    
    function updateTextArea(txt) {
        document.querySelector(DOM_STRINGS.chatBox).value += ` ${txt} `;
    }
    
    function handleEmoteClick(event) {
        if(event.target === this) return;
        
        const emoteName = event.target.dataset['emotename'];
        updateTextArea(emoteName)
    }
    
    //Handles Emote Button Click
    function handleEmotesButton(event) {
        document.querySelector(DOM_STRINGS.emoteList).classList.toggle('emote-list-active')
    }
    
    //Adds Emote to Emote Box
    function appendEmoteToEmoteBox(name, id) {
        const emote_list = document.querySelector(DOM_STRINGS.emoteList);
        const emote_elem = 
           ` <li class="emote-item" data-emotename=${name}>
                 <img 
                    class="emote-image"
                    src="https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0"
                    data-emotename=${name}
                    alt="${name}"
                 />
             </li>
          `;
        emote_list.insertAdjacentHTML('beforeend', emote_elem);
        
    }
    
    function addEmotesToEmotesList(emotes) {
        emoteJSON = emotes;
        for(let emote in emotes) {
            const emote_id   = emotes[emote].id;
            appendEmoteToEmoteBox(emote, emote_id);
        }
    }
    
    function fetchEmotes() {
        fetch(`${URLS.cors}${URLS.twitchApiUrl}`)
            .then(res => res.json())
            .then(addEmotesToEmotesList)
    }
    
    function setupEventListeners() {
        //Listen for Emote Button Click
        document.querySelector(DOM_STRINGS.emotesButton).addEventListener('click', handleEmotesButton)
        //Listen for Emote Img Click
        document.querySelector(DOM_STRINGS.emoteList).addEventListener('click', handleEmoteClick);
        //Handle form on submit
        document.querySelector(DOM_STRINGS.chatForm).addEventListener('submit', handleFormSubmit);
    }
    
    function init() {
        setupEventListeners();
        fetchEmotes();
        const messages = document.querySelector(DOM_STRINGS.messages);
        messages.scrollTop = messages.scrollHeight;
    }
    
    init()
    
})();