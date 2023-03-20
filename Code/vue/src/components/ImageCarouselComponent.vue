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
import { onMounted, watch } from 'vue';
import { useCounterStore } from "@/stores/genericStore"
import { Carousel } from "bootstrap/dist/js/bootstrap.min.js"
const gameState = useCounterStore();

const props = defineProps({
    newSlide : Object
});

const emits = defineEmits([
    'processedNewSlide'
]);

onMounted(() => {
    
    let carouselElement = document.querySelector("#image-carousel");
    let carousel = new Carousel(carouselElement);

    watch(props.newSlide, () => {
        if (isNaN(props.newSlide.slide)){
            return;
        }
        carousel.to(props.newSlide.slide - 1);
        emits('processedNewSlide');
    }, { flush: 'post'});
});

</script>

<style scoped>

#base {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    justify-items: center;
    align-items: center;
    /*height: 100%;*/
    width: auto;
    height: auto;
    min-width: 200px;
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