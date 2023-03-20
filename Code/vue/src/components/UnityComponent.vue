<template>
    <div id="unity-base" :style="aspect">
        <canvas id="unity-canvas" width="100%" height="100%"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import UnityWebgl from 'unity-webgl';
import UnityVue from 'unity-webgl/vue';

const props = defineProps({
    game: String,
    aspectX: Number,
    aspectY: Number,
    context: Object,
});


//const unityContext = ref(props.unityContext);

const aspect = "aspect-ratio: " +  props.aspectX.toString() +  " / " + props.aspectY.toString();
const activities = ref();
const base = ref();
const canvas = ref();

const resizeCanvas = function() {
    if ((activities.value.clientWidth / props.aspectX) < (activities.value.clientHeight / props.aspectY)){
        if (base.value.clientWidth >= activities.value.clientWidth || base.value.clientHeight >= activities.value.clientHeight){

            base.value.width = activities.value.clientHeight - 30;
            base.value.height = activities.value.clientHeight - 30;
            return;
        }
    } else {
        if (base.value.clientHeight >= activities.value.clientHeight || base.value.clientWidth >= activities.value.clientWidth){
            base.value.width = activities.value.canvasWidth - 30;
            base.value.height = activities.value.canvasWidth - 30;
            return;
        }
    }

    //canvas.value.style.position = 'relative';
    if ((activities.value.clientWidth / props.aspectX) < (activities.value.clientHeight / props.aspectY)){
        //console.log("Prefer Width")
        //console.log("Prefer W Width " + base.value.clientWidth + "Prefer W Height " + base.value.clientHeight);
        base.value.style.width = "100%";
        base.value.style.height = "";
        //console.log(base.value);
        canvas.value.width = base.value.clientWidth;
        canvas.value.height = base.value.clientWidth * (props.aspectY / props.aspectX);

    } else {
        //console.log("Prefer Height")
        //console.log("Prefer H Width " + base.value.clientWidth + "Prefer H Height " + base.value.clientHeight);
        
        base.value.style.height = "100%";
        base.value.style.width = "";
        //console.log(base.value);
        
        canvas.value.width = base.value.clientHeight * (props.aspectX / props.aspectY);
        canvas.value.height = base.value.clientHeight;
            
    }
}

onMounted(() => {

    
    activities.value = document.querySelector("#activities");
    base.value = document.querySelector("#unity-base");
    canvas.value = document.querySelector("#unity-canvas");
    
    props.context.context = new UnityWebgl( canvas.value, {
        loaderUrl: 'src/UnityBuilds/' + props.game +'/Build/' + props.game + '.loader.js',
        dataUrl: 'src/UnityBuilds/' + props.game +'/Build/' + props.game + '.data',
        frameworkUrl: 'src/UnityBuilds/' + props.game +'/Build/' + props.game + '.framework.js',
        codeUrl: 'src/UnityBuilds/' + props.game +'/Build/' + props.game + '.wasm',
        streamingAssetsUrl: 'src/UnityBuilds/' + props.game + 'StreamingAssets',
    
    });

    //props.unityContext.push(context)

    //console.log(props.context.context);
    
    //canvas.value.height = base.value.clientHeight;
    //canvas.value.width = base.value.canvasWidth;

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    //window.addEventListener('message', logUnityMessage);
});

onBeforeUnmount(() => {
    props.context.context.destroy();
    props.context.context.unload();
    //console.log(props.context.context); // it keeps an object without a unity instance
    window.removeEventListener('resize', resizeCanvas);
    //window.removeEventListener('message', logUnityMessage);
});


</script>

<style scoped>
    #unity-base {
        margin: 0px;
        padding: 0px;
        border: 0px;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        justify-items: center;
        align-items: center;
        /*display: flex;
        justify-content: center;
        align-items: center;*/
        min-width: 200px;
        width: auto;
        height: auto;
    }

    /*#unity-canvas {
        max-height: calc(90vh - 15px - 15px);
        height: 100%;
        width: 100%;
    }*/


</style>
