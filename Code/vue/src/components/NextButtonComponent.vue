<template>
    <button id="next-button" class=" col-12" type="button" @click.left.prevent.exact="$emit('nextWasPressed')" @keydown.enter.prevent.exact="$emit('nextWasPressed')">
        <div id="grid">
            <div></div>
            <div class="button-text">Next</div>
            <div></div>
        </div>
    </button>
</template>

<script setup>
import { onMounted } from "vue";
import { useCounterStore } from "@/stores/genericStore";

const gameState = useCounterStore();
defineEmits(['nextWasPressed']);


onMounted(() => {
    document.querySelector('#next-button').focus();
});

</script>

<style scoped>

* {
    color: var(--color-text);
    font-size: 18px;
}

#next-button {

    border: 0px solid white;
    border-radius: 10px 10px 10px 10px;
    height: 100%;

    background: var(--aj-glass-background);
    box-shadow: var(--aj-glass-box-shadow);
    backdrop-filter: var(--aj-glass-backdrop-filter);
    -webkit-backdrop-filter: var(--aj-glass-webkit-backdrop-filter);
    border: var(--aj-glass-border);
}
#next-button:hover {
    background-color: var(--send-button-color-background-hover);
}
#grid {
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-columns: 1fr;
}
</style>