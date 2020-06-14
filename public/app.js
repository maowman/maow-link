let control_js = new Vue({
    el: "#control_dom",
    data: {
        input_url: null,
        help_text: "",
        help_class: "",
        valid_url: false,
        icon_class: "fas fa-question"
    },
    methods: {
        check_url: function () {
            try {
                const url_obj = new URL(this.input_url);
                this.help_text = "正確的網址格式";
                this.help_class = "is-success";
                this.valid_url = true;
                this.icon_class = "fas fa-check";
            }
            catch (e) {
                this.help_text = "錯誤的網址格式";
                this.help_class = "is-danger";
                this.valid_url = false;
                this.icon_class = "fas fa-times"
            }
            if (this.input_url === "") {
                this.help_text = "";
                this.help_class = "";
                this.valid_url = false;
                this.icon_class = "fas fa-question";
            }
        }
    },
    mounted: function () {
    }
});

let recaptcha_js = new Vue({
    el: "#recapcha_dom",
    data: {

    },
    methods: {

    },
    mounted: function () {

    }
})


