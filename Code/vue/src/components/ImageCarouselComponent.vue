<template>
    <div id="base">
        <div id="image-carousel" class="carousel carousel-fade" data-bs-interval="false">

            <div class="carousel-indicators">
                <button class="indicator" v-for="image in gameState.currentSlides" type="button" data-bs-target="#image-carousel" :data-bs-slide-to="image.index" :class="[ image.index == 0 ? 'active' : '']" aria-current="true" aria-label="Slide 1"></button>
            </div>

            <div class="carousel-inner">
                <div v-for="image in gameState.currentSlides" class="carousel-item" :class="[ image.index == 0 ? 'active' : '']">
                    <img :src="image.src" class="d-block w-100" alt="...">
                    <!--<div class="carousel-caption d-none d-md-block glass">
                        <h5>{{ image.title }}</h5>
                        <p>{{ image.caption }}</p>
                    </div>-->
                </div>
            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#image-carousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>

            <button class="carousel-control-next" type="button" data-bs-target="#image-carousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>

        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue';
import { useCounterStore } from "@/stores/genericStore"
import { Carousel } from "bootstrap/dist/js/bootstrap.min.js"
const gameState = useCounterStore();

const props = defineProps({
    newSlide : Object
});

const emits = defineEmits([
    'processedNewSlide'
]);

let baseSize = "0px";
let carouselElement;
let carousel;

onMounted(() => {
    
    carouselElement = document.querySelector("#image-carousel");
    carousel = new Carousel(carouselElement);

    watch(gameState.currentSlides, () => {
        carousel.to(gameState.currentSlides.length - 1);
        
    }, { flush: 'post'});

    //addEventListener(onresize, updateComponentSize());
    //updateComponentSize();
});

onBeforeUnmount(() =>{
    //removeEventListener(onresize, updateComponentSize());
    carousel.dispose();
    //console.log("Dispose!!");
    //console.log(carousel);
});

function updateComponentSize() {

    let parent = document.querySelector("#activities");
    let parentHeight = parent.clientHeight;
    let parentWidth = parent.clientWidth;

    if (parentHeight >= parentWidth){
        baseSize = parentWidth + "px";
    } else {
        baseSize = parentHeight + "px";
    }
    //console.log(`Parent height: ${parentHeight}px`);
    //console.log(`Parent width: ${parentWidth}px`);
    //console.log("Updatinnnnnnnn");
    //console.log(baseSize);
}

</script>

<style scoped>

#base {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-width: 200px;
}

#image-carousel {
    max-width: 89vh;
    max-height: 89vh;
    height: auto;
    width: auto;
}

img {
    height: 100%;
    -webkit-filter: drop-shadow(2px 2px 0 white)
                drop-shadow(-2px 2px 0 white)
                drop-shadow(2px -2px 0 white)
                drop-shadow(-2px -2px 0 white);

    filter: drop-shadow(2px 2px 0 white)
            drop-shadow(-2px 2px 0 white)
            drop-shadow(2px -2px 0 white)
            drop-shadow(-2px -2px 0 white);
}

h5, p {
    color: var(--color-text);
    margin: 0px;
}

.glass {
    background: var(--aj-glass-background-opaque);
    border-radius: var(--aj-glass-border-radius);
    box-shadow: var(--aj-glass-box-shadow);
    backdrop-filter: var(--aj-glass-backdrop-filter);
    -webkit-backdrop-filter: var(--aj-glass-webkit-backdrop-filter);
    padding: var(--aj-glass-padding);
    margin: 0px;
    border: var(--aj-glass-border);
}
.carousel-control-next-icon, .carousel-control-prev-icon {
    
    -webkit-filter: drop-shadow(1px 1px 0 black)
                drop-shadow(-1px 1px 0 black)
                drop-shadow(1px -1px 0 black)
                drop-shadow(-1px -1px 0 black);

    filter: drop-shadow(1px 1px 0 black)
            drop-shadow(-1px 1px 0 black)
            drop-shadow(1px -1px 0 black)
            drop-shadow(-1px -1px 0 black);
  

}
.indicator {
    background-color: var(--color-text);
}

</style>