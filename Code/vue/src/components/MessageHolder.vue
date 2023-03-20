<template>
    <div class="chatbox">
        <div class="message-container col-12" ref="scrolly">
            <div
                v-for="message in messages"
                :key="message.id"
                class="message-box d-flex flex-row"
                :class="[message.author == 'bot' ? activeClass : 'justify-content-end', 'justify-content-start']"

            >
                <div class="message" :class="message.author">{{ message.content }}</div>
                <!---<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                alt="avatar 1" style="width: 45px; height: 100%;">-->
            </div>
            <br/>
        </div>
    </div>
</template>

<script>


export default {
    name: 'MessageHolder',
}
</script>

<script setup>
import { ref, watch } from 'vue'

        const props = defineProps({
            messages: Array,
            activeClass: Boolean,
        }) 
        const scrolly = ref(null)

        watch(props.messages, () => {
            
            /*// CHROME
            if (navigator.userAgent.indexOf("Chrome") != -1 ) {
                console.log("Google Chrome");
            }
            // FIREFOX
            else if (navigator.userAgent.indexOf("Firefox") != -1 ) {
                console.log("Mozilla Firefox");
            }
            // INTERNET EXPLORER
            else if (navigator.userAgent.indexOf("MSIE") != -1 ) {
                console.log("Internet Exploder");
            }
            // EDGE
            else if (navigator.userAgent.indexOf("Edge") != -1 ) {
                console.log("Internet Exploder");
            }
            // SAFARI
            else if (navigator.userAgent.indexOf("Safari") != -1 ) {
                console.log("Safari");
            }
            // OPERA
            else if (navigator.userAgent.indexOf("Opera") != -1 ) {
                console.log("Opera");
            }
            // YANDEX BROWSER
            else if (navigator.userAgent.indexOf("YaBrowser") != -1 ) {
                console.log("YaBrowser");
            }
            // OTHERS
            else {
                console.log("Others");
            }*/

            //console.log('SCROLL')
            
            //console.log(scrolly.value)
            // chrome looks at offset height, scroll height and then scroll top = their difference
            // firefox uses offset height and scroll height and scroll top max = 188, then scrolltop is the actual scroll value, but during the watch, scroll top updates to the old scrolltopmax value
            /*if (scrolly.value.scrollTopMax > 0){
                scrolly.value.scrollTo(0, scrolly.value.scrollTopMax)
            }*/
            
            scrolly.value.scrollTop = scrolly.value.scrollHeight - scrolly.value.offsetHeight;
            
            /*for (let i = 0; i < scrollyElements.length; i++) {
                let el = scrollyElements[i]
                console.log(el)
                el.scrollTop = el.scrollTopMax
                console.log(el.scrollTop)
                console.log(el.scrollTopMax)
                console.log(el.scrollHeight)
            }*/
        }, {flush: 'post'})
    
</script>

<style scoped>
.chatbox {

    background: var(--aj-glass-background);
    border-radius: var(--aj-glass-border-radius);
    box-shadow: var(--aj-glass-box-shadow);
    backdrop-filter: var(--aj-glass-backdrop-filter);
    -webkit-backdrop-filter: var(--aj-glass-webkit-backdrop-filter);

    /* Basic settings */
    height: 90vh;
    /*position: relative;*/

    /* Setting a height and making it stretch with flex lets it scroll. */
    min-height: 0px;
    flex: 1 1 auto;
    justify-self: flex-end;


    align-items: safe flex-end;
    overflow-y: auto;
    /* Make the scrollbar invisible, but keep the functionality */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    
}

/* Make the scrollbar invisible, but keep the functionality */
.chatbox::-webkit-scrollbar, .message-container::-webkit-scrollbar {
    display: none; /* Chrome */
}
.message-container {
    overflow-y: auto;
    height: 100%;
    padding: 0.75em;
    /* Make the scrollbar invisible, but keep the functionality */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;

    -webkit-box-direction: normal;
    -moz-box-direction: normal;

    -webkit-box-orient: vertical;
    -moz-box-orient: vertical;

    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;

    -webkit-flex-wrap: nowrap;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    
    -webkit-box-pack: start;
    -moz-box-pack:start;
    
    -webkit-justify-content: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    
    -webkit-align-content: stretch;
    -ms-flex-line-pack: stretch;
    align-content: stretch;
    
    -webkit-box-align: stretch;
    -moz-box-align: stretch;
    -webkit-align-items: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    
}

.message-box {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
}
.message {
    /* Style the basis for any message */

    margin-bottom: 0.6em;
    padding: 0.6em 0.8em;
    /*transition: 0.5s;*/

    /*box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.5);*/
    /*position: relative;*/
}

.no-auth {
    /* Style the no-auth messages. These should be "system" announcements 
    justify-self: center;*/
    border-radius: 20px;
    flex: 1;
    text-align: center;
    background-color: var(--aj-no-auth-message-background-color);

}

.user {
    /* Style the user's messages. */
    border-radius: 20px 20px 0px 20px;
    justify-self: flex-end;
    background-color: var(--aj-user-message-background-color);
}

.bot {
    /* Style the bot's messages. */
    border-radius: 20px 20px 20px 0px;
    justify-self: flex-start;
    background-color: var(--aj-bot-message-background-color);
}

.logo {
    border-radius: 50%;
    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.7);
    object-fit: cover;
    width: 35px;
    height: 35px;
}

.user .logo {
    left: auto;
    right: 10px;
}


</style>
