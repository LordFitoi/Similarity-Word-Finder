let app = new Vue({
    el: "#app",
    data: {
        groupSubstrs: [],
        inputWord: "",
        inputText: "",
        biasDepth: 0.5,
        similarList: [],
        wordDictionary: [],
        appTitle: "similarity word finder",
        appDescription: `Description: This is a web application that allows you to search for
        words similar within a given text. To use it, you only need to place
        the words to search in "Words to Find" box and the text to analyze in
        "Text to Analyze" box. By: LordFitoi (Nahum Santana)`
    },
    filters: {
        fltPorcent: function(float) {
            return Number.parseFloat(float*100).toFixed(2) + "%";
        }
    },
    methods: {

        formatString: function (str) {
            return str.replaceAll(/[^a-zA-ZñÑ ]/g, "").toLowerCase()
        },

        getGroup: function() {
            let str = this.formatString(this.inputWord);
            let wordList = str.split(" ");
            
            this.groupSubstrs = [];
            wordList.forEach((word) => {
                this.groupSubstrs.push(this.getSubstrs(word));
            })
            this.groupSubstrs = this.groupSubstrs.flat();
        },

        /*
        * Verifica si cada palabra del texto es similar a la del grupo de palabras.  
        * @param {Event} recibe el evento disparador.
        * @returns {Null}
        */
        similarWords: function(event) {
            event.preventDefault();
            this.getGroup();
            let str = this.formatString(this.inputText);
            let wordList = str.split(" ");
            let probList = [];
            this.wordDictionary = [];

            wordList.forEach((word) => {
                // Obtiene los substrings de cada palabra:
                if (/\S/.test(word)) {
                    let wordSubstrs = this.getSubstrs(word);
                    let wordProb = 0;
                    
                    // Comprueba si los substrings:
                    for (let i = 0; i < wordSubstrs.length; i++) {
                        if (this.groupSubstrs.includes(wordSubstrs[i])) {
                            wordProb ++;
                        }
                    }
                    
                    wordProb = Math.sqrt(wordProb / wordSubstrs.length);
                    if (wordProb >= this.biasDepth && this.wordDictionary.includes(word) == 0){
                        let object = {
                            name: word,
                            prob: wordProb
                        };
                        probList.push(object);
                        this.wordDictionary.push(word);
                    }
                }
            })
            this.similarList = probList;
        },

        /*
        * Obtiene los substrings de una palabra. 
        * @param {String} la palabra a analizar
        * @returns {Array {String} }
        */
        getSubstrs: function(str) {
            let substrLength = Math.min(3, str.length);
            let substrs = [];
            
            for (let i = 0; i < str.length - substrLength + 1; i++) {
                substrs.push(str.slice(i, i + substrLength))
            }
            return substrs;
        },

    }
})