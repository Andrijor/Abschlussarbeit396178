<template>
    <div id="content">
      <NavbarComponent/>
      <div id="chapters">
            <RouterLink id="chapter-0" type="button" class="glass" to="/course" @click="gameState.setCurrentChapter(0)">
                <span>
                    Start from the beginning
                </span>
                    
            </RouterLink>
            <button v-for="index in gameState.chapterCount - 1" type="button" class="chapter-box glass col-12">

                <RouterLink v-if="gameState.chapterUnlocked[index]" to="/course"  @click="setChapter(index)">
                    
                        <div class="chapter-title col-12">Chapter</div>
                        <div  class="chapter-number">
                            <span>
                                {{ index }}
                            </span>
                        </div>
                    </RouterLink>
                
                <RouterLink v-else to="/chapters">
                        <div class="chapter-title col-12">Chapter</div>
                        <div class="chapter-unavailable">
                            <span>
                                Unavailable
                            </span>
                        </div>
                </RouterLink>
            </button>
                
            
            
            
            

      </div>
    </div>
  </template>

<script setup>
import NavbarComponent from "@/components/NavbarComponent.vue";
import { useCounterStore } from "@/stores/genericStore"

const gameState = useCounterStore();
function setChapter(index){
    if (gameState.currentChapter != index){
        gameState.setCurrentChapter(index);
    }
    
}
</script>

<style scoped>
button {
    color: var(--vc-text)
}

a {
    color: var(--vc-text);
    text-decoration: none;
}

span {
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    margin: 0px;
    padding: 0px;
}

#content {
    height: 100vh;
    width: 100%;
}

#chapters {
    height: 90vh;
    width: 100%;
    min-width: 300px;

    display: grid;
    grid-template-rows: 0.1fr;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 0.1fr;
    
    justify-items: center;
    align-items: center;
    
    padding: 1em 5em 0em 5em;
    gap: 1em;
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
}

.chapter-box {    
    justify-self: stretch;
    align-self: stretch;
    height: 100%;
    width: 100%;
}

#chapter-0 {
    grid-column: span 3;
    font-size: 3vh;
    justify-self: stretch;
    text-align: center;
}

.chapter-title {
    display: inline-block;
    font-size: 4vh;
    text-align: center;
    vertical-align: middle;
    margin: 0px;
}

.chapter-number {

    display: flex;
    font-size: 8vh;
    text-align: center;
    align-items: center;
    margin: 0px;
    
}
.chapter-unavailable {
    display: flex;
    font-size: 3vh;
    text-align: center;
    align-items: center;
    margin: 0px;
    
}
</style>