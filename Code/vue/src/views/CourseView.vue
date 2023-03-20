<template>
    <div id="content" class="col-12">
        <NavbarComponent />
        <div class="col-12 col-sm-12 col-md-5 col-lg-3">
            <div class="chat-container glass">
                <h4 id="chapter" class="text-center">Chapter {{ gameState.chapterString }}</h4>
                <div class="progress progress-bar-custom">
                    <div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">{{ gameState.progressBar }}</div>
                    
                </div>
                <!--<button @click="progressUpdate">ddd</button>-->
                <MessageHolder id="message-holder" :messages="messages" />

                <div v-if="userCanType" id="input-field" class="user-input d-flex">
                    <TextareaAutosize
                        class="text-input col-10"
                        v-model="textarea"
                        :placeholder="placeholderMessage"
                        @onEnterPressed="sendMessage"
                    />
                    <button class="col-2" type="button" id="send-button" @click="sendMessage">
                        <span id="send-icon" class="bi bi-send-fill"></span>
                    </button>
                    
                    <!--<button @click="gameState.addKeyword(60, 50, 30, 3.5, 'Neural Network', 26.08032153026167)">ffff</button>
                    <button @click="gameState.addLine(1, 2, 2, 3, 43189479)">ccccc</button>-->
                    <!--<button @click="addShape(gameState.count.toString())">ffff</button>
                    
                    <button @click="addImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.cameraegg.org%2Fwp-content%2Fuploads%2F2015%2F08%2Faf-s-nikkor-24mm-f-1.8-g-ed-lens-sample-images-2.jpg&f=1&nofb=1&ipt=148aba21203fdaa4680b5bcf8fe38841dd297ff10f46ee2187bd6efd313d8130&ipo=images')">ccccc</button>-->
                </div>
                <div v-else>
                    <NextButtonComponent id="next-button" @nextWasPressed="takeMessageFromQueue()"/>
                </div>
            </div>
        </div>

        <!-- ACTIVITY AREA -->
        <div id="activities" class="glass col-12 col-sm-12 col-md-6 col-lg-8">

            <UnityComponent v-if="gameState.currentActivity == 'unity'" class="col-12" game="MLTraining" :context="unityContext" :aspectX="1" :aspectY="1"/>

            <div id="conceptual-map-parent" class="col-12" v-else-if="gameState.currentActivity == 'concept'">
                <ConceptualMapComponent /> <!--@processedKeyword="clearKeyword"-->
            </div>
            <div id="image-carousel-parent" class="col-12" v-else-if="gameState.currentActivity == 'slides'">
                <ImageCarouselComponent @processedNewSlide="clearSlide" :newSlide="slideContainer"/>
            </div>

        </div>
        
    </div>
</template>

<script>
export default {
    name: "CourseView",

}
</script>

<script setup>
import MessageHolder from '@/components/MessageHolder.vue'
import TextareaAutosize from '@/components/TextareaAutosize.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import UnityComponent from '@/components/UnityComponent.vue'
import NextButtonComponent from '@/components/NextButtonComponent.vue'
import ConceptualMapComponent from '@/components/ConceptualMapComponent.vue'
import ImageCarouselComponent from '@/components/ImageCarouselComponent.vue'
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { useCounterStore } from "@/stores/genericStore"

const IP = 'http://127.0.0.1:5000';
//const IP = 'http://192.168.122.12:5000';
//const IP = 'https://a726-79-210-168-175.eu.ngrok.io';



const unityContext = ref({
    context: undefined,
});

const slideContainer = ref({
    slide: NaN
});

const clearSlide = function(){
    slideContainer.value.slide = NaN;
}
/*function progressUpdate(){
    gameState.updateProgressBar(Number(textarea.value))
}*/

const textarea = ref('');
const gameState = useCounterStore();

watch(() => gameState.progressBar,
(percent) => {
    var newStr = percent.replace("%", "");
    var number = Number(newStr);
    if (number >= 80 && gameState.currentChapter < 10){
        addMessage('no-auth', 'You have unlocked the next chapter and can use \\next.');
        addMessage('no-auth', 'Please note, the progress in the current chapter will be deleted if you use the next command.');
        addMessage('no-auth', 'And please make sure to complete the conceptual map for the chapter using \\concept!');
    }
});

const placeholderMessage = ref('Your message here.');
const messages = ref([
    { author: 'no-auth', content: 'Send "\\start" to begin the chapter.', id: 0, timestamp: Date.now() },

]);

const messageQueue = ref([]);
const userCanType = computed(() => messageQueue.value.length == 0);

const addMessage = (author, content) => {
    var newMessage = {
            id: messages.value.length,
            author: author,
            timestamp: Date.now(),
            content: content,
        }
    messages.value.push(newMessage);
}

// Functions
function getTextWidth(inputText) {

    let canvas = document.createElement("canvas");
    //let height = canvas.clientHeight;
    let canvasWidth = document.querySelector("#activities").clientWidth - 30;
    let fontsize = 3.5 * canvasWidth / 100;
    let font = fontsize + "px sans-serif";
    let context = canvas.getContext("2d");
    context.font = font;
    //console.log(context.measureText(inputText).width);
    //textWidth.value = 
    //console.log(textWidth.value);
    //document.removeChild(canvas);
    return (context.measureText(inputText).width * 100 / canvasWidth) + 2;
 }

function takeMessageFromQueue(){
    
    let msg = messageQueue.value.shift();
    //console.log(msg);
    //console.log("The author is " + typeof(msg['author']));

    if (typeof(msg['image']) == 'string' && msg['image'] != ''){// if it's not undefined, it's a string
        //console.log(msg['image']);
        gameState.addSlide(msg['image']);
        slideContainer.value.slide = gameState.currentSlides.length;
    }

    if (typeof(msg['keyword']) == 'string' && msg['keyword'] != ''){
        
        //console.log(typeof(msg['keyword']), msg['keyword']);
        gameState.addKeyword(40, 80, gameState.currentConceptShapes.length, 3.5, msg['keyword'], getTextWidth(msg['keyword']));
    }

        
    
    addMessage(msg['author'], msg['message'])
}

function useCommand(command){
    
    if (command == "start"){

        addMessage('user', textarea.value)
        const path = IP + '/startChapter'
        //const path = 'http://192.168.122.12:5000/startChapter'
        axios
            .get(path, { params: { chapter_id: gameState.currentChapter } })//, headers:{'ngrok-skip-browser-warning':''}
            .then((res) => {

                if(res.data.length == 0) return;
                gameState.setStartedChapter(true);
                messageQueue.value = res.data;
                takeMessageFromQueue();
            })
            .catch((err) => {
                console.error("No Server Found");
                console.error(err);
            })
        
    } else if (command.slice(0,4) == "goto"){
        let commandArray = command.split(" ")
        let prevChapter = gameState.currentChapter;  

        if (commandArray.length == 2 && commandArray[0] == "goto" && !isNaN(parseInt(commandArray[1]))){
            //console.log(parseInt(commandArray[1]));
            gameState.setCurrentChapter(commandArray[1]);

            if (gameState.currentChapter == prevChapter){
                addMessage('no-auth', "Chapter " + commandArray[1] + " is not available or doesn't exist.")
            } else {
                addMessage('user', textarea.value)
                addMessage('no-auth', "Jumping to chapter " + gameState.chapterString)

            }
            
        } else {
            addMessage('user', textarea.value)
            addMessage('no-auth', "Command formatted incorrectly")
        }

    } else if (command == "next"){
        addMessage('user', textarea.value)
        gameState.nextChapter();
        addMessage('no-auth', "Starting Chapter " + gameState.chapterString)
        // Make it like \Start!
    } else if (command == "break"){
        addMessage('no-auth', gameState.getBreakCode());
    } else if (command == "unity" || command == "concept" || command == "slides"){
        addMessage('user', textarea.value)
        addMessage('no-auth', "Changing activity...")
        gameState.setActivityTo(command);
    } else if (command == "red" && gameState.currentActivity == 'unity'){

        unityContext.value.context.send('GameManager', 'colorCircleRed')
    } else if (command == "green" && gameState.currentActivity == 'unity'){
        unityContext.value.context.send('GameManager', 'colorCircleGreen')
    } else {
        addMessage('user', textarea.value)
        addMessage('no-auth', "Command not recognized")
    }
    textarea.value = ''
    return;
}

const sendMessage = (e) => {
    
    if (e.keyCode != undefined && e.keyCode != 13) {
        return
    } else if (e.type == 'click' && textarea.value == '') {
        return
    }

    if (textarea.value.length == 0) return;

    if (textarea.value[0] == "\\" || textarea.value[0] == "+"){
        useCommand(textarea.value.slice(1, textarea.value.length));
        return;
    }


    const notOnlyWhiteSpace = /\S/g;

    if (textarea.value != '' && notOnlyWhiteSpace.test(textarea)) {
        //console.log(textarea.value)
        textarea.value = textarea.value.trim()
        
        if (textarea.value === '') {
            return
        }

        if (!gameState.userStartedChapter){
            addMessage('user', textarea.value);
            textarea.value = '';
            return
        }

    }

    addMessage('user', textarea.value);

    //if (textarea.value === '') return
    
    const path = IP + '/askQuestion'
    //const path = 'http://192.168.122.12:5000/askQuestion'
    axios
        .get(path, { params: { question: textarea.value, chapter_id: gameState.currentChapter }})
        .then((res) => {
            //console.log(typeof(res.data));
            if (typeof(res.data) == 'string'){
                // Process the actual answer
                processAnswer(res.data);

            } else if (typeof(res.data) == 'object'){
                if (res.data.answer != ""){
                    // Process the actual answer
                    processAnswer(res.data.answer);

                    // Process the keywords
                    if (res.data.keywords.length > 0){
                        for (let k of res.data.keywords){
                            //console.log(k);
                            gameState.addKeyword(40, 80, gameState.currentConceptShapes.length, 3.5, k, getTextWidth(k));
                        }
                    }
                    if (res.data.images.length > 0){
                        for (let i of res.data.images){
                            gameState.addSlide(i);
                            slideContainer.value.slide = gameState.currentSlides.length;
                        }
                    }
                    
                    //addMessage('bot', res.data)
                }
            }
        })
        .catch((err) => {
            console.error(err)
            console.error("No Server Found")
        })
        textarea.value = ''
    return
}

const processAnswer = function(answer){
    let upper = answer[0].toUpperCase();
    let str = answer.slice(1);
    addMessage('bot', upper + str)
}
</script>

<style scoped>

#content {
    height: 100vh;
    margin: 0px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
}

.chat-container {
    height: calc(90vh);

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}
#activities {
    height: 90vh;
    /*display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;*/
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(1, 1fr);
    justify-items: center;
    align-items: center;
}

#chapter {
    justify-self: flex-start;
    flex: 1 1;
}

#message-holder {
    flex: 16 1;
    justify-self: flex-end;
}

#message-holder::-webkit-scrollbar {
    display: none; /* Chrome */
}

#input-field {
    justify-self: flex-end;
    flex: 2 0;
}

#next-button {
    justify-self: flex-end;
    flex: 2 0;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
}

#send-button {
    background-color: rgba(41, 41, 255, 0);
    border: 0px solid white;
    border-radius: 0px 10px 10px 0px;
}
#send-button:hover {
    background-color: var(--send-button-color-background-hover);
}

.progress-bar-custom {
    height: 2em;
    --bs-progress-bg: var(--aj-glass-background);
    --bs-progress-bar-bg: rgba(213, 126, 235, 0.70);
}

.progress-bar {
    width: v-bind('gameState.progressBar');
    color: var(--color-text)
}

.glass {
    background: var(--aj-glass-background);
    border-radius: var(--aj-glass-border-radius);
    box-shadow: var(--aj-glass-box-shadow);
    backdrop-filter: var(--aj-glass-backdrop-filter);
    -webkit-backdrop-filter: var(--aj-glass-webkit-backdrop-filter);
    padding: var(--aj-glass-padding);
    position: var(--aj-glass-position);
    border: var(--aj-glass-border);
    margin: 0rem 0.5rem 0rem 0.5rem;

}
.user-input {
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
}

#send-icon {
    color: var(--vt-c-black);
}

#conceptual-map-parent {
    height: 100%;
}

</style>
