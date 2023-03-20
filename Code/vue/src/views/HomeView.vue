<template>
  <div id="content">
    <NavbarComponent/>
    <div id="home-sections" class="">
            <div id="presentation" class="col-11 col-sm-10 col-md-5 col-lg-3 col-xl-3">
                <div class="home-content"> <!--col-11 col-sm-10 col-md-5 col-lg-3-->
                    <h1>Welcome to My Chatbot</h1>
                    <p>This small course was developed by Andrés Jorge as part of his thesis to finish his BSc. degree in Computer Science at the TU Berlin.</p>
                </div>

                <div class="home-content">
                    <h1>How it works</h1>
                    <p>The Chatbot will introduce itself, then give you a little context about the current chapter and then you can ask questions.</p>
                    <p>When the chatbot answers, you will notice some keywords appearing. Connect them correctly to finish the chapter.</p>
                    <p>If you need a break, get a Progress Code first and make sure to take note of it! :)</p>
                </div>
            </div>
            <div class="d-none d-xs-none d-md-block col-1">

            </div>
            <div id="game-start-div" class="home-content col-11 col-sm-10 col-md-5 col-lg-3">

                <h1>Start Course</h1>
                
                <div class="col-6">
                    <RouterLink to="/course" class="router-link btn btn-flexible col-12">
                            From the beginning
                    </RouterLink>
                </div>
                <hr class="col-12">
                <h3>Load Progress from Code</h3>
                <div id="code-view" class="col-12">
                    <span v-for="x in Array.from(Array(8).keys())" class="bi code-icon" :class="gameState.icons[gameState.code[x]]"></span>
                </div>

                <div id="code-input" class="col-12">
                    <button v-for="x in Array.from(Array(9).keys())" :id="'code-' + x" class="btn btn-flexible bi code-icon-input" :class="gameState.inputIcons[x]" @click="typeCode(x)"></button>
                </div>

                <div class="col-6">
                    <button class="btn btn-flexible col-12">
                        Continue course
                    </button>
                </div>
            
            </div>
    </div>
  </div>
</template>

<script setup>
import { useCounterStore } from "@/stores/genericStore"
import NavbarComponent from "@/components/NavbarComponent.vue";
//import { useLocalStorage } from "@vueuse/core"

const gameState = useCounterStore();

function typeCode(value) {
    
    if (value == 8){
        
        if (gameState.codeIndex > 0) {

            gameState.code[gameState.codeIndex - 1] = 0;
            gameState.codeIndex--;
        }
        
    } else {
        
        if (gameState.codeIndex <= 7) {

            gameState.code[gameState.codeIndex] = value + 1;
            gameState.codeIndex++;

        }
    }
}

</script>
<style scoped>

    
.router-link {
    color: var(--button-color-text);
    text-decoration: none;
}

#content {
    height: 100vh;
    width: 100%;
    
}

#home-sections {
    height: 90vh;
    width: 100%;
    min-width: 300px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    /*display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(4, 1fr);
    
    grid-template-areas: 
    'presentation presentation A1 start-game start-game A2'
    'description description A1 start-game start-game A2'
    'description description A1 start-game start-game A2'
    'e e A1 start-game start-game A2';
    justify-items: stretch;
    align-items: stretch;*/
    
    margin: 2px;
    
}
/*#presentation {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
}
#description {
    grid-area: description;
}*/


#game-start-div {
    grid-area: start-game;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 1fr 1fr 0.5fr 0.5fr 2fr 2fr 1fr;
    justify-items: center;
    align-items: center;
    padding: 0.5em;
    overflow: hidden;
}

#code-view {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr ;
    grid-template-rows: 1fr 1fr;
    justify-content: space-evenly;
    gap: 0.1em;
    justify-items: center;
    align-items: center;
    
}
#code-input {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0.2em;
    justify-items: center;
    align-items: center;
}

#code-0 {
    grid-column: 1 / 2;
    grid-row: 1;
}
#code-1 {
    grid-column: 2 / 3;
    grid-row: 1;
}
#code-2 {
    grid-column: 3 / 4;
    grid-row: 1;
}
#code-3 {
    grid-column: 4 / 5;
    grid-row: 1;
}
#code-4 {
    grid-column: 1 / 2;
    grid-row: 2;
}
#code-5 {
    grid-column: 2 / 3;
    grid-row: 2;
}
#code-6 {
    grid-column: 3 / 4;
    grid-row: 2;
}
#code-7 {
    grid-column: 4 / 5;
    grid-row: 2;
}
#code-8 {
    grid-column: 5;
    grid-row: 1 / 3;
}

.code-icon {
    font-size: 3.2em;
    grid-column: span 1;
    grid-row: span 1;
}
.code-icon-input {
    font-size: 1.3em;
}

hr {
    border: var(--aj-hr);
    opacity: var(--aj-hr-opacity);
}


.home-content {
background: var(--aj-glass-background);
border-radius: var(--aj-glass-border-radius);
box-shadow: var(--aj-glass-box-shadow);
backdrop-filter: var(--aj-glass-backdrop-filter);
-webkit-backdrop-filter: var(--aj-glass-webkit-backdrop-filter);
padding: var(--aj-glass-padding);
position: var(--aj-glass-position);
border: var(--aj-glass-border);

margin-top: 0.5rem;
}

.btn-flexible {
background-color: var(--button-color-background);
color: var(--button-color-text);
border: var(--button-border);
}
.btn-flexible:hover {
background-color: var(--button-color-background-hover);
color: var(--button-color-text);
border: var(--button-border);
}
.code-icon {
color: var(--color-text);;
}
.code-icon-input {
color: var(--button-color-text);
border: var(--button-border);
}


</style>
