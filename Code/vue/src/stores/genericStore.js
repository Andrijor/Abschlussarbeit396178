import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { Carousel } from "bootstrap/dist/js/bootstrap.min.js"

export const useCounterStore = defineStore("generic", () => {

  // REFERENCES
  

  /* Example so I don't forget how things work */
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  const progressBar = computed(() => totalKeywordsPerChapter[currentChapter.value] == 0 ? "100%" : Math.floor(currentConceptShapes.value.length*100/totalKeywordsPerChapter[currentChapter.value]) + "%");

  /* For loading code */
  const code = ref([0, 0, 0, 0, 0, 0, 0, 0]);
  const codeKeyboard = ref([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const codeIndex = ref(0);
  
  /* For controlling the theme */
  const prefersDarkTheme = ref(false);

  /* Constants for reference */
  const totalSlides = [4, 7, 9, 8, 6, 4, 5, 6, 6, 4];
  const slideProperties = ref();
  fetch('src/assets/slide_assets/image_properties.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      slideProperties.value = (JSON.parse(JSON.stringify(data)));
    })

  const questionKeywordPairs = ref();
  fetch('src/assets/slide_assets/question_keyword_pairs.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      questionKeywordPairs.value = (JSON.parse(JSON.stringify(data)));
    })
  
  const totalKeywordsPerChapter = {
    0: 13,
    1: 17,
    2: 25,
    3: 17,
    4: 23,
    5: 16,
    6: 22,
    7: 26,
    8: 22,
    9: 18,
    10: 0
  }
  
  /* For controlling the current state */
  const chapterString = computed(() => currentChapter.value <= 9 ? "0" + currentChapter.value.toString() : currentChapter.value.toString());

  const playTicTacToe = ref(false);
  const themeWasSet = ref(false);
  const currentActivity = ref("slides");

  const userStartedChapter = ref(true); // CHANGE THIS BACK TO FALSE
  const currentChapter = ref(0);
  const chapterCount = ref(11);
  const chapterUnlocked = ref([]);
  const currentConceptShapes = ref([]);
  const currentConceptLines = ref([]);
  
  const currentSlides = ref([{
    id: '00_00',
    index: 0,
    src: "src/assets/slide_assets/00_00.png",
    title: "",
    caption: ""
  }]);

  // ACTIONS
    
  const addSlide = function(id){
    const format = /0\d_0\d/;
    if (id == undefined || id == ''){
      return;
    }

    if (format.test(id)){

      let chapter = parseInt(id.split('_')[0]);
      let slideNumber = parseInt(id.split('_')[1]);

      if (currentChapter.value == chapter && slideNumber <= totalSlides[chapter]) {

        if (currentSlides.value.length == 1 && currentSlides.value[0].id == "00_00"){
          currentSlides.value.pop();
        }

        let imageAlreadyInArray = currentSlides.value.find((img) => {
            return img.id == id;
        });

        if (imageAlreadyInArray == undefined){
          
          let format = '.png';

          if (id == "02_08") {
            format = '.gif';
          }

          let properties = slideProperties.value.slides.find((slide) => {
            return slide.slide_id == id;
          });

          currentSlides.value.push({
            id: id,
            index: currentSlides.value.length,
            src: "src/assets/slide_assets/" + id + format,
            title: properties.title,
            caption: properties.caption
          });
          
        }
      }
    }
  }

  const setKeywordWidth = function(id, width){
    let keyword = currentConceptShapes.value.find((k) => {
      return k.id == id;
    });
    keyword.width = width;
  }

  const suggestQuestion = function(){
    //console.log(questionKeywordPairs.value);
    let chapters = questionKeywordPairs.value.chapters;

    for (let i = 0 ; i < chapters.length ; i++){

      let chapter = chapters[i];
      if (chapter.chapter_id == currentChapter.value){

        for (let j = 0 ; j < chapter.question_keywords.length ; j++){

          let keyword = chapter.question_keywords[j].keyword;

          let searchKeyword = currentConceptShapes.value.find((shape) => {
            return shape.content == keyword;
          });

          if (searchKeyword == undefined){
            return chapter.question_keywords[j].question;
          }
        }
      }
    }
    return "";
  }

  const addKeyword = function(x, y, id, fontSize, content, width) {
    let word = currentConceptShapes.value.find((s) => {
      return s.content == content;
    });

    if (word != undefined) {
      return;
    }

    let color = prefersDarkTheme.value ? 'FFFFFF' : '000000';
    let inverseColor = '#' + invertHex(color);
    
    currentConceptShapes.value.push({
        x: x,
        y: y,
        width: width,
        height: fontSize + 2,
        color: '#' + color,
        inverseColor: inverseColor,
        id: id,
        content: content
    });
    
  }
  const invertHex = function(hex) {
    let res = (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).slice(1).toUpperCase()

    return res
  }

  for (let i = 0 ; i < chapterCount.value ; i++){
    chapterUnlocked.value.push(false);
  }
  chapterUnlocked.value[0] = true;

 
  const resetSlides = function(){
    let carousel = undefined;
    let imageCarousel = null;
    if(currentActivity.value == "slides"){
      imageCarousel = document.querySelector("#image-carousel");
      if (imageCarousel != null){
        carousel = Carousel.getOrCreateInstance(imageCarousel)
      }
    }

    let checkInit = currentSlides.value.find((s) => {
      return s.id == "00_00";
    });

    if(checkInit == undefined){
      currentSlides.value.shift();

      currentSlides.value.unshift({
        id: '00_00',
        index: 0,
        src: "src/assets/slide_assets/00_00.png",
        title: "",
        caption: ""
      });
    }

    if(carousel != undefined){
      carousel.to(0);
    }
   
    while(currentSlides.value.length > 1){
      currentSlides.value.pop();
      //console.log("Length: " + currentSlides.value.length);
    }
    
  }

  const resetConcept = function(){
    currentConceptShapes.value = [];
    currentConceptLines.value = [];
  }

  const removeLine = function(line) {
    currentConceptLines.value = currentConceptLines.value.filter((l) => {
      return (
        !(( l.oid == line.oid &&
          l.os == line.os &&
          l.tid == line.tid && 
          l.ts == line.ts) || 

        ( l.oid == line.tid && 
          l.os == line.ts && 
          l.tid == line.oid && 
          l.ts == line.os))
          )});    
  }
  
  function addLine(originShape, originSide, targetShape, targetSide, id){
    let uniqueLine = currentConceptLines.value.find((l) => {
      return (
          (l.oid == originShape && l.os == originSide && l.tid == targetShape && l.ts == targetSide) || 
          (l.oid == targetShape && l.os == targetSide && l.tid == originShape && l.ts == originSide))});

    if (uniqueLine != undefined) return;
    let color = prefersDarkTheme.value ? 'FFFFFF' : '000000';
    currentConceptLines.value.push({
        // oid origin shape id
        oid: originShape,
        // os origin side
        os: originSide,
        // tid target shape id
        tid: targetShape,
        // ts target side
        ts: targetSide,
        width: 2,
        color: '#' + color,
        id: id
    });
  }

  function getPreferredTheme() {
    return prefersDarkTheme.value;
  }
  function toggleThemeFlag(value) {
    themeWasSet.value = value;
  }

  function increment() {
    count.value++;
  }
  function decrease() {
    count.value--;
  }

  function nextChapter() {
    currentChapter.value++;
  }
  function setCurrentChapter(ch) {
    if (ch < chapterCount.value ) {
      currentChapter.value = ch;
    }
  }
  function setStartedChapter(hasStartedChapter) {
    userStartedChapter.value = hasStartedChapter;
  }
  function setTheme(useDarkTheme) {
    prefersDarkTheme.value = useDarkTheme;
  }
  function setActivityTo(str) {
    currentActivity.value = str;
  }

  const stringIcons = [
    "⏫",                // 0
    "⏬",              // 1 
    "⏪",              // 2
    "⏩",             // 3
    "✅",                // 4
    "❎",                 // 5
    "➕",                 // 6
    "➖",                 // 7
  ];

  const stringIconsToIndex = {
    "⏫": 0,                // 0
    "⏬": 1,              // 1 
    "⏪": 2,              // 2
    "⏩": 3,             // 3
    "✅": 4,                // 4
    "❎": 5,                 // 5
    "➕": 6,                 // 6
    "➖": 7                 // 7
  };

  function pad(s, size) {    
    while (s.length < size) s = "0" + s;
    return s;
  }


  const countOnes = (str) => {
    const re = /1/g
    return ((str || '').match(re) || []).length
  }
  function chunkString(str, length) {
    return str.match(new RegExp('.{1,' + length + '}', 'g'));
  }

  const unlockChapter = function(ch){
    chapterUnlocked.value[ch] = true;
  }

  function getBreakCode(){
    var breakCode = "";

    // Theme
    var theme = prefersDarkTheme.value ? 1 : 0;
    var themeBin = theme.toString(2);
    breakCode = breakCode + themeBin;

    // Last Unlocked Chapter -- current upper limit 31 (5 bits)
    var currentLast = 0;
    for (let i = 0 ; i < chapterCount.value ; i++){
      currentLast = i;

      if (chapterUnlocked.value[i] == false){
        currentLast--;
        break;
      }

    }
    var currentLastBin = parseInt(currentLast, 10).toString(2);
    currentLastBin = pad(currentLastBin, 5);
    breakCode = breakCode + currentLastBin;

    var gameBin = "0000000000000";
    breakCode = breakCode + gameBin;

    var checksum = countOnes(breakCode);
    //console.log("Ones: " + checksum);
    //console.log("Parsed ones: " +parseInt(checksum, 10));
    var checksumBin = checksum.toString(2);
    //console.log("Binary String: " + checksumBin);
    checksumBin = pad(checksumBin, 5);
    //console.log("Binary padded"+checksumBin);

    breakCode = breakCode + checksumBin;
    breakCode = chunkString(breakCode, 3);
    //console.log(breakCode);
    for (let i = 0 ; i < breakCode.length ; i++){
      breakCode[i] = stringIcons[parseInt(breakCode[i], 2)];
    }

    //console.log(breakCode);
    return breakCode;
  }

  const setBreakCode = function(){
    //console.log(code.value);
    let checkFull = true;
    for (let i = 0 ; i < 8 ; i++){
      if(code.value[i] == 0){
        checkFull = false;
        break;
      }
    }
    if (!checkFull){
      return;
    }

    let binCode = "";

    for (let i = 0 ; i < 8 ; i++){
      let octal = (code.value[i] - 1).toString(2);
      octal = pad(octal, 3);
      binCode = binCode + octal;
    }
    //console.log(binCode);
    var checksumFlag = countOnes(binCode.slice(0, 19)) == parseInt(binCode.slice(19, 24), 2);
    //console.log(binCode.slice(0, 19));
    //console.log(countOnes(binCode.slice(0, 19)));
    //console.log(binCode.slice(19, 24));
    //console.log(parseInt(binCode.slice(19, 25), 2));

    if (!checksumFlag) {
      //console.log(binCode);
      return;
    }

    let theme = parseInt(binCode.slice(0, 1), 2);
    setTheme(theme == 1);

    let lastUnlocked = parseInt(binCode.slice(1, 6), 2);
    //console.log("Last: " +lastUnlocked)

    for (let i = 0 ; i < chapterUnlocked.value.length ; i++){
      chapterUnlocked.value[i] = false;
    }

    for (let i = 0 ; i <= lastUnlocked ; i++){
      chapterUnlocked.value[i] = true;
    }
    
  }
  const icons = [
    "bi-square-fill",             // 0 
    "bi-arrow-up-square-fill",    // 1
    "bi-arrow-down-square-fill",  // 2
    "bi-arrow-left-square-fill",  // 3
    "bi-arrow-right-square-fill", // 4
    "bi-check-square-fill",       // 5
    "bi-x-square-fill",           // 6
    "bi-plus-square-fill",        // 7
    "bi-dash-square-fill"         // 8
  ];
  const inputIcons = [
    "bi-arrow-up",                // 0
    "bi-arrow-down",              // 1 
    "bi-arrow-left",              // 2
    "bi-arrow-right",             // 3
    "bi-check-lg",                // 4
    "bi-x-lg",                    // 5
    "bi-plus-lg",                 // 6
    "bi-dash-lg",                 // 7
    "bi-backspace"                // 8
  ];

  

  // WATCHERS
  if (sessionStorage.getItem("currentChapter")){
    currentChapter.value = JSON.parse(sessionStorage.getItem("currentChapter"));
  }

  if (sessionStorage.getItem("lastUnlocked")){
 
    let lastUnlocked = JSON.parse(sessionStorage.getItem("lastUnlocked"));

    for (let i = 0 ; i < chapterUnlocked.value.length ; i++){
      chapterUnlocked.value[i] = false;
    }

    for (let i = 0 ; i <= lastUnlocked ; i++){
      chapterUnlocked.value[i] = true;
    }
  }

  if (sessionStorage.getItem("darkTheme")){
    prefersDarkTheme.value = JSON.parse(sessionStorage.getItem("darkTheme"));
  }

  if (sessionStorage.getItem("themeWasSet")){
    themeWasSet.value = JSON.parse(sessionStorage.getItem("themeWasSet"));
  }

  watch(
    chapterUnlocked,
    () => {
      var currentLast = 0;
      for (let i = 0 ; i < chapterCount.value ; i++){
        currentLast = i;
  
        if (chapterUnlocked.value[i] == false){
          currentLast--;
          break;
        }
  
      }

      sessionStorage.setItem("lastUnlocked", JSON.stringify(currentLast));
    },
    { deep: true }
);

  watch(
      currentChapter,
      (ch) => {
          sessionStorage.setItem("currentChapter", JSON.stringify(ch));
      },
      { deep: true }
  );

  watch(
    prefersDarkTheme,
    (val) => {
        sessionStorage.setItem("darkTheme", JSON.stringify(val));
    },
    { deep: true }
  );

  watch(
    themeWasSet,
    (val) => {
        sessionStorage.setItem("themeWasSet", JSON.stringify(val));
    },
    { deep: true }
  );

  const resetChapter = function(){
    //console.log("RESETTING");

    resetConcept();
    setActivityTo("slides");
    resetSlides();

    
  }

  return { count, doubleCount, increment, decrease, code, icons, codeIndex, codeKeyboard, inputIcons, currentChapter, chapterString, nextChapter, playTicTacToe, userStartedChapter, setStartedChapter, setTheme, prefersDarkTheme, themeWasSet, toggleThemeFlag, getPreferredTheme, chapterCount, chapterUnlocked, setCurrentChapter, currentActivity, setActivityTo, addLine, removeLine, currentConceptShapes, currentConceptLines, addKeyword, currentSlides, addSlide, setKeywordWidth, resetConcept, resetSlides, progressBar, getBreakCode, setBreakCode, unlockChapter, resetChapter, suggestQuestion };
});
