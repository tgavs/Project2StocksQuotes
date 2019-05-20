var urlSymbols = "/api/symbols"

var symbolsData=[]

d3.json(urlSymbols).then(function (dataS) {
    console.log(dataS)
    symbolsData = [dataS.symbols];   
});

console.log(symbolsData)

const Autocomplete = {
    name: "autocomplete",
    template: "#autocomplete",
    props: {
        items: {
            type: Array,
            required: false,
            default: () => []
        },
        isAsync: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data() {
        return {
            isOpen: false,
            results: [],
            search: "",
            isLoading: false,
            arrowCounter: 0
        };
    },

    methods: {
        onChange() {
            // Let's warn the parent that a change was made
            this.$emit("input", this.search);

            // Is the data given by an outside ajax request?
            if (this.isAsync) {
                this.isLoading = true;
            } else {
                // Let's search our flat array
                this.filterResults();
                this.isOpen = true;
            }
        },

        filterResults() {
            // first uncapitalize all the things
            this.results = this.items.filter(item => {
                return item.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
            });
        },
        setResult(result) {
            this.search = result;
            this.isOpen = false;
        },
        onArrowDown(evt) {
            if (this.arrowCounter < this.results.length) {
                this.arrowCounter = this.arrowCounter + 1;
            }
        },
        onArrowUp() {
            if (this.arrowCounter > 0) {
                this.arrowCounter = this.arrowCounter - 1;
            }
        },
        onEnter() {
            this.search = this.results[this.arrowCounter];
            this.isOpen = false;
            this.arrowCounter = -1;
        },
        handleClickOutside(evt) {
            if (!this.$el.contains(evt.target)) {
                this.isOpen = false;
                this.arrowCounter = -1;
            }
        }
    },
    watch: {
        items: function (val, oldValue) {
            // actually compare them
            if (val.length !== oldValue.length) {
                this.results = val;
                this.isLoading = false;
            }
        }
    },
    mounted() {
        document.addEventListener("click", this.handleClickOutside);
    },
    destroyed() {
        document.removeEventListener("click", this.handleClickOutside);
    }
};

new Vue({
    el: "#app",
    name:"app",
    data:{
        symbols: ['Apple', 'Banana', 'Orange', 'Mango', 'Pear', 'Peach', 'Grape', 'Tangerine', 'Pineapple']
    },
    components: {
        autocomplete: Autocomplete
    }
});
