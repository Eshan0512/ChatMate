/* Contains the main functions for the app */ 
console.log("App is alive")

let channels = [];
let messages = [];

let selectedChannel;

// init() function
function init() {
    // Display message in console
    console.log("App is initialized")

    // Call the respective functions
    getChannels();
    getMessages();
    loadMessagesIntoChannel();
    displayChannels();
    loadEmojis();

    // Initiate events
    document.getElementById("send-button").addEventListener("click", sendMessage);
    document.getElementById("emoticon-button").addEventListener("click", toggleEmojiArea);
    document.getElementById("close-emoticon-button").addEventListener("Click", toggleEmojiArea);
}

// ---------------------------------------- CHANNELS ---------------------------------------------------------------

// Get existing channels from Mock files or database
function getChannels() {
    channels = mockChannels;
}

function getMessages() {
    messages = mockMessages;
}

// Fucntion to load messages into the channel
function loadMessagesIntoChannel() {
    channels.forEach(channel => {
     messages.forEach(message => {
         if(message.channel === channel.id){      // If the message attribute is equal to the channel's id attribute....
             channel.messages.push(message);      // push messages into the respective channel 
         }
     })
    })
 }

// Load respective channels after clicking on it
function displayChannels() {
    // Create two variables to differentiate between favorite channels and regular channels
    const favoriteList = document.getElementById('favorite-channels');
    const regularList = document.getElementById('regular-channels');

    // Assign the two variables to an empty string
    favoriteList.innerHTML = "";
    regularList.innerHTML = "";

    channels.forEach((channel) => {
        const currentChannelHtmlString = '<li id="' + channel.id + '" onclick="switchChannel(this.id)"> <i class="material-icons">group</i><span class="channel-name">'+ channel.name + '</span> <span class="timestamp">'+ channel.latestMessage +'</span> </li>'

        if(channel.favorite) {
            favoriteList.innerHTML += currentChannelHtmlString;
        }
        else{
            regularList.innerHTML += currentChannelHtmlString; 
        }
    })
}


/**
 * Function to switch channels
 * @param {string} selectedChannelID 
 */

function switchChannel(selectedChannelID) {
    console.log(selectedChannelID);
    // Switch the highlighting to the different channels
    if(!!selectedChannel) {
        document.getElementById(selectedChannel.id).classList.remove("selected");   // Removes the "selected" class based on the id
    }                                                 
    document.getElementById(selectedChannelID).classList.add("selected")      // Adds the "selected" class to a new channel

    channels.forEach(channel => {
        if (channel.id === selectedChannelID) {
            selectedChannel = channel;
        }    
    })
    // Hide user prompt and show the input area the first time a user selects a channel
    if(!!document.getElementById("select-channel")) {
        document.getElementById("select-channel").style.display = "none";
        document.getElementById("input-field").style.display = "flex";
        document.getElementById("chat-area-header").style.display = "flex";
    }

    // call function showHeader() & showMessages()
    showHeader();
    showMessages();
}

// Function to change the channel name in the message area headbar
function showHeader() {
    document.getElementById("chat-area-header").getElementsByTagName('h1')[0].innerHTML = selectedChannel.name;    
    document.getElementById("favorite-button").innerHTML = (selectedChannel.favorite) ? "favorite" : "favorite_border"; // Change the icon based on the channel type (favorite or regular)
   
   /* if(selectedChannel.favorite){                                                   // If favorite = true, then....
        document.getElementById("favorite-button").innerHTML = "favorite";          // The logo changes to a heart  
    }
    else {                                                                          // If favorite = false, then...
        document.getElementById("favorite-button").innerHTML = "favorite_border";   // The logo changes to an empty heart
    }*/
}

//-----------------------------------------------------------MESSAGES--------------------------------------------------------------------------

/**
 * Message constructor function
 * @param {string} user - name of the user
 * @param {boolean} own - Own message or incoming
 * @param {string} text - The text message
 * @param {string} channelID - ID of the channel in which the message is sent
 */

function Message(user, own, text, channelID) {
    this.createdBy = user;
    this.createdOn = new Date(Date.now());
    this.own = own;
    this.text = text;
    this.channel = channelID;
}

// Event listener to send message
document.getElementById("send-button").addEventListener("click", sendMessage)

// Function to send messages
function sendMessage() {
    // Variable to store text message
    const text = document.getElementById('message-input').value;
    if(!!text) {
        const myUserName = "Eshan";
        const own = true;
        const channelID = selectedChannel.id;
        const message = new Message(myUserName, own, text, channelID)
        console.log("New message: ", message);
        selectedChannel.messages.push(message);
        document.getElementById("message-input").value = "";
        showMessages();
        displayChannels();
    }
    else {
        return;
    }
}

// Show the messages of the selected channel
function showMessages() {
    const chat = document.getElementById('chat');
    chat.innerHTML = "";

    selectedChannel.messages.forEach(message => {
        const messageTime = message.createdOn.toLocaleTimeString('de-DE', {
            hour: 'numeric',
            minute: 'numeric'
        });

        let currentChannelHtmlString;
        if(message.own) {
            currentChannelHtmlString = '<div class="message outgoing-message"> <div class="message-wrapper"> <div class="message-content"> <p>' + message.text + '</p> </div> <i class="material-icons">account_circle</i> </div><span class="timestamp">' + messageTime +'</span> </div>';
        }
        else{
            currentChannelHtmlString = '<div class="message incoming-message"> <div class="message-wrapper"> <i class="material-icons">account_circle</i> <div class="message-content"> <h3>' + message.createdBy + '</h3> <p>' + message.text + '</p> </div> </div> <span class="timestamp">' + messageTime + '</span> </div>';
        }

        chat.innerHTML += currentChannelHtmlString;
    })
    
}

// --------------------------------------------------------- EMOJIS -------------------------------------------------------------------

// Load emoji's into div
function loadEmojis() {
    for(let i = 0; i < emojis.length; i++){
        document.getElementById("emoji-list").innerHTML += '<span class="button">' + emojis[i] + '</span>'
    }

    const emojiInArea = document.getElementById("emoji-list").childNodes
    for(let i = 0; i < emojiInArea.length; i++) {
        emojiInArea[i].addEventListener('click', function(){
            document.getElementById("message-input").value += this.innerHTML;
            document.getElementById("send-button").style.color = "#00838f";
        })
    }
}

// Event to open and close the emoji area
document.getElementById("emoticon-button").addEventListener("click", toggleEmojiArea);
document.getElementById("close-emoticon-button").addEventListener("click", toggleEmojiArea);   // Mistake noted down. X button was not working as you typed Click instead of click.

function toggleEmojiArea() {
    const emojiArea = document.getElementById("emoji-area");
    const chatArea = document.getElementById("chat");
    emojiArea.classList.toggle("toggle-area");
    chatArea.style.height = (emojiArea.classList.contains('toggle-area')) ? "calc(100vh - 132px - 250px)" : "calc(100vh - 132px)";
    chatArea.scrollTop = chatArea.scrollHeight;
}