<template>
    <!--@keydown.shift.enter="el = el + '\n'"-->
    <textarea
        ref="el"
        class="input-field"
        type="text"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown.enter.exact="$emit('onEnterPressed', $event), preventEnter($event)"
        :value="modelValue"
        ></textarea>
</template>

<script setup>
//import autosize from "autosize/dist/autosize"
import { ref, onMounted } from "vue"; //onMounted, onBeforeMount

const emits = defineEmits([
    'update:modelValue',
    'onEnterPressed'
]);
const props = defineProps({
        modelValue: String,
        placeholder: String,
        //@input="$emit('update:modelValue', $event.target.value)"
        
    });

const el = ref('');
const preventEnter = (e) => {
    //console.log(e);
    e.preventDefault();
};
onMounted (() => {
    el.value.placeholder = props.placeholder;
    el.value.focus()
});
</script>

<style scoped>
.input-field {
    resize: none;
    margin: 0em;
    padding: 0.5em 0.8em;
    border-radius: 10px 0px 0px 10px;
    border: 0px solid white;
    /*transition: 0.5s;*/
    outline: none;
    font-size: 1em;
    box-sizing: border-box;
    overflow-y: scroll;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */

    
    background-color: var(--color-background);
    color: var(--color-text);
    
}
.input-field::-webkit-scrollbar {
    display: none;
}


</style>
