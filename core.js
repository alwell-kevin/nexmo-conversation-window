
class ChatApp {
    constructor() {
        this.audio = document.getElementById('audio')
        this.enableButton = document.getElementById('enable')
        this.disableButton = document.getElementById('disable')
        this.sendCallButton = document.getElementById('callButton')
        this.setupUserEvents()
    }

    errorLogger(error) {
        console.log(error)
    }

    eventLogger(event) {
        return () => {
            console.log("'%s' event was sent", event)
        }
    }

    authenticate() {
        //This is where you would normally use the users session to authenticate the user and return their JWT.
        return USER_JWT
    }

    setupConversationEvents(conversation) {}

    //create an instance of the ConversationClient and login the current user in using the User JWT.
    joinConversation(userToken) {
        new Promise(function (resolve, reject) {
            new ConversationClient({
                    debug: false
                })
                .login(userToken) //returns a promise with the app
                .then(app => {
                    console.log('*** Logged into app', app)
                    resolve(app.getConversation(CONVERSATION_ID));
                })
                .catch(this.errorLogger)
        })
    }

    setupUserEvents() {
        console.log("in conversation events");
        this.sendCallButton.addEventListener("click", event => {
            event.preventDefault()
            const userToken = this.authenticate();

            if (userToken) {
                console.log("Submit Clicked")
                this.joinConversation(userToken).then(conversation => {
                    console.log("CONVERSATION WITH AUDIO STREAM: ", conversation)

                    conversation.media.enable().then(stream => {
                        // Older browsers may not have srcObject
                        if ("srcObject" in this.audio) {
                            this.audio.srcObject = stream;
                        } else {
                            // Avoid using this in new browsers, as it is going away.
                            this.audio.src = window.URL.createObjectURL(stream);
                        }

                        this.audio.onloadedmetadata = () => {
                            this.audio.play();
                        }

                        this.eventLogger('member:media')()
                    }).catch(this.errorLogger)
                })
            }
        })

        this.disableButton.addEventListener('click', () => {
            this.conversation.media.disable().then(this.eventLogger('member:media')).catch(this.errorLogger)
        })
    }
}

var chatApp = new ChatApp;

console.log(chatApp)