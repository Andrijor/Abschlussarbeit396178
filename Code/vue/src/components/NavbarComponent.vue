<template>
    <!-- Commands Modal -->
    <div class="modal fade" id="command-modal" tabindex="-1" aria-labelledby="Command Modal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content glass">
                <div class="modal-header">
                    <h5 class="modal-title">Chat Command List</h5>
                    <button type="button" class="btn btn-flexible" data-bs-dismiss="modal" aria-label="Close"><span class="bi bi-x-lg fs-5"></span></button>
                    
                    
                </div>
                <div class="modal-body">
                    <p>Commands can start with a backslash (\) or a plus sign (+).</p>
                    <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Command</th>
                            <th scope="col">Effect</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="command in commandList">
                            <th scope="row">{{ command.command }}</th>
                            <td>{{ command.effect }}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <!--<div class="modal-footer">
                    <button type="button" class="btn btn-flexible" data-bs-dismiss="modal">Close</button>
                </div>-->
            </div>
        </div>
    </div>
    <nav class="navbar col-12 navbar-dark bg-dark navbar-expand-sm">
        <div class="container-fluid ">
            <RouterLink to="/" class="navbar-brand">
                <img src="../assets/ChatBulbW.svg" class="logo align-text-center" />
                My Chatbot
            </RouterLink>

            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                @click="visible = !visible"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="navbar-collapse" :class="!visible ? 'collapse' : ''" id="navbarSupportedContent">

                <div class="navbar-nav me-auto mb-2 mb-lg-0">
                    <div class="nav-item">
                        <RouterLink to="/" class="nav-link">Home</RouterLink>
                    </div>
                    <div class="nav-item">
                        <RouterLink to="/chapters" class="nav-link">Chapters</RouterLink>
                    </div>
                    <div class="nav-item">
                        <RouterLink to="/course" class="nav-link">Course</RouterLink>
                    </div>
                    <div class="nav-item" data-bs-toggle="modal" data-bs-target="#command-modal">
                        <!-- Help Modal-->
                        <a class="nav-link">Commands</a>
                    </div>
                    <div class="nav-item" @click="switchTheme">
                        <a class="nav-link">Theme to: 
                            <span class="bi" :class="[gameState.prefersDarkTheme ? 'bi-brightness-high-fill' : 'bi-moon-stars-fill']"></span>
                        </a>
                        
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useCounterStore } from "@/stores/genericStore"

const gameState = useCounterStore();
const visible = ref(false);
const currentTheme = ref(null);
const commandList = ref([
    {
        command: '\\start',
        effect: 'Starts the chapter.'
    },
    {
        command: '\\unity',
        effect: 'Displays the current unity game, if any.'
    },
    {
        command: '\\slides',
        effect: 'Displays the image slideshow.'
    },
    {
        command: '\\concept',
        effect: 'Displays the conceptual map activity.'
    }
]);

function autoSetTheme(){
    if(currentTheme.value.matches){
        gameState.setTheme(false);
    } else {
        gameState.setTheme(true);
    }    
    switchTheme();
}

onMounted(() => {
    if (!gameState.themeWasSet) {
        currentTheme.value = window.matchMedia("(prefers-color-scheme: dark)")
        gameState.setTheme(currentTheme.value.matches)
        initialThemeSet();
    } else {
        initialThemeSet();
    }
    //currentTheme.value.addEventListener('change', autoSetTheme);
});

onBeforeUnmount(() => {
    //currentTheme.value.removeEventListener("change", autoSetTheme)
});

function initialThemeSet() {
    if (gameState.prefersDarkTheme) {
        document.querySelector('html').setAttribute('data-theme', 'dark');
    } else {
        document.querySelector('html').setAttribute('data-theme', 'light');
    }
    gameState.toggleThemeFlag(true)
}

function switchTheme() {
    if (!gameState.prefersDarkTheme) {
        document.querySelector('html').setAttribute('data-theme', 'dark');
    } else {
        document.querySelector('html').setAttribute('data-theme', 'light');
    }    
    gameState.setTheme(!gameState.prefersDarkTheme);
    gameState.toggleThemeFlag(true)
}
</script>

<style scoped>
.nav-item {
    color: var(--vt-c-white);
}

nav {
    z-index: 1000;
    left: 0px;
    top: 0px;
}

a{    
    font-size: 1rem;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.navbar-collapse {
    z-index: 999;
}
.logo {
    height: 2.5rem;
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
.glass {
    background: var(--aj-glass-background-opaque);
    border-radius: var(--aj-glass-border-radius);
    box-shadow: var(--aj-glass-box-shadow);
    backdrop-filter: var(--aj-glass-backdrop-filter);
    -webkit-backdrop-filter: var(--aj-glass-webkit-backdrop-filter);
    padding: var(--aj-glass-padding);
    position: var(--aj-glass-position);
    border: var(--aj-glass-border);
}

.modal-header, .modal-footer, thead, tbody {
    border: none;
}

th, td {
    color: var(--color-text);
}
</style>
