<template>
    <div id="unity-base">
        <iframe scrolling="no" id="unity-game" :style="aspect"></iframe>
    </div>
</template>

<script setup>

    import { ref, onMounted, onBeforeUnmount } from "vue";
    
    const props = defineProps({
        game: String,
        aspectX: Number,
        aspectY: Number
    });

    const aspect = "aspect-ratio: " +  props.aspectX.toString() +  " / " + props.aspectY.toString();
    const base = ref();
    const iframe = ref();

    const resizeIFrame = function() {
        if (base.value.clientWidth / props.aspectX < base.value.clientHeight / props.aspectY){
            iframe.value.style.width = "100%"
            iframe.value.style.height = ""
        } else {
            iframe.value.style.height = "100%"
            iframe.value.style.width = ""
        }
    }

    onMounted(() => {
        
        base.value = document.querySelector("#unity-base");
        iframe.value = document.querySelector("#unity-game");
        
        window.addEventListener('resize', resizeIFrame);
        resizeIFrame();

        //console.log(iframe.value);
        iframe.value.setAttribute('src', '/src/UnityBuilds/' + props.game +'/index.html');

        

        window.addEventListener('message', logUnityMessage);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeIFrame);
        window.removeEventListener('message', logUnityMessage);
    });

    const logUnityMessage = function(e) {
        if (e.data[0] == 'hello') {
            console.log(e);
        }
    }
    
</script>

<style scoped>
    #unity-base {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        justify-items: center;
        align-items: center;
        height: 100%;
        min-width: 200px;
    }
</style>