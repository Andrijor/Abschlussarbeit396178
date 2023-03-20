<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
    
    <div id="page-content">
        <RouterView />
    </div>

    <div id="no-portrait">
        <div class="error-glass">
            <h1>Error: This site only supports being used on a computer and in landscape mode.</h1>
        </div>
    </div>
</template>

<style>

* {
    transition: height 0.3s, width 0.3s;
}

#page-content {
    
    min-height: 100vh;
    width:100%;
    margin: 0px;
    min-width: 300px;

    /* fallback for old browsers */
    background: var(--aj-background-old);

    /* Chrome 10-25, Safari 5.1-6 */
    background: var(--aj-background-old-chrome-safari);

    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    background: var(--aj-background);

    overflow: auto;
    /* Make the scrollbar invisible, but keep the functionality */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    
}

/* Make the scrollbar invisible, but keep the functionality */
#page-content::-webkit-scrollbar {
    display: none; /* Chrome */
}

#no-portrait {
    min-width: 300px;
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5%;

    /* fallback for old browsers */
    background: var(--aj-background-old);

    /* Chrome 10-25, Safari 5.1-6 */
    background: var(--aj-background-old-chrome-safari);

    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    background: var(--aj-background);

    overflow: auto;
    /* Make the scrollbar invisible, but keep the functionality */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}
.error-glass {
    background: var(--aj-glass-background);
    border-radius: var(--aj-glass-border-radius);
    box-shadow: var(--aj-glass-box-shadow);
    backdrop-filter: var(--aj-glass-backdrop-filter);
    -webkit-backdrop-filter: var(--aj-glass-webkit-backdrop-filter);
    padding: var(--aj-glass-padding);
    position: var(--aj-glass-position);
    border: var(--aj-glass-border);

}
#no-portrait h1 {
        color: var(--color-text);
}
@media (orientation: landscape) { 
    #no-portrait {
        display: none;
    }
    
}
@media (orientation: portrait) { 
    #page-content {
        display: none;
    }
}

</style>
