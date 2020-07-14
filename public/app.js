function to_char(n) {
    if (Number.isInteger(n) && n >= 0 && n <= 61) {
        if (n >= 0 && n <= 25) {
            return String.fromCharCode(n + 97);
        } else if (n >= 26 && n <= 51) {
            return String.fromCharCode(n - 26 + 65);
        } else if (n >= 52 && n <= 61) {
            return String.fromCharCode(n - 52 + 48);
        }
    } else {
        return "";
    }
}

function gen_hash(length) {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += to_char(Math.floor(Math.random() * 63));
    }
    return result;
}

let control_js = new Vue({
    el: "#control_dom",
    data: {
        input_url: null,
        help_text: "",
        help_class: "",
        valid_url: false,
        icon_class: "fas fa-question",
        checkbox: false,
        hash: {
            body: "",
            length: 8,
            flag: true
        },
        preview_url: "",
        costom: "",
        costom_lenth: 16,
        loading: false,
        done: false,
        result: ""
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
        },
        new_hash: function () {
            if (this.hash.flag === true) {
                this.hash.flag = false;
                if (this.checkbox === false) {
                    this.costom = "";
                }
                try {
                    this.costom = this.costom.match(/[A-Za-z0-9]/g).join("").substring(0, this.costom_lenth);
                }
                catch (error) {
                    this.costom = ""
                }
                if (this.costom === '') {
                    this.hash.body = gen_hash(this.hash.length);
                }
                else {
                    this.hash.body = this.costom + "_" + gen_hash(this.hash.length / 2);
                }

                const db = firebase.database();
                db.ref("router/" + this.hash.body).once("value").then(
                    res => {
                        control_js.hash.flag = true;
                        if (res.exists()) {
                            control_js.new_hash();
                        }
                    }
                ).catch(
                    err => {
                        control_js.hash.flag = true;
                        console.log(err);
                    }
                );
            }
        },
        submit: function () {
            if (this.valid_url === false) {
                window.alert("警告，不合格式的目標網址");
                return;
            }
            if (recaptcha_js.status === false) {
                window.alert("警告，請完成recaptcha認證");
                return;
            }
            const data = {
                token: recaptcha_js.token,
                target: this.input_url,
                hash: this.hash.body
            }
            this.loading = true;
            fetch("https://us-central1-maow-link.cloudfunctions.net/generate", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(
                    response => response.json()
                )
                .then(
                    response => {
                        control_js.loading = false;
                        if (response.status === true) {
                            control_js.done = true;
                            control_js.result = response.result;
                        }
                        else {
                            alert("伺服器出現錯誤，麻煩稍後再試");
                            console.log(response.result)
                        }
                    }

                )
                .catch(
                    error => {
                        control_js.loading = false;
                        console.log(error);
                        alert("伺服器出現錯誤，麻煩稍後再試");
                        console.log(response.result);
                    }
                );
        }

    },
    mounted: function () {
        this.new_hash();
    }
});

let recaptcha_js = new Vue({
    el: "#recapcha_dom",
    data: {
        token: null,
        status: false
    },
    methods: {
        success: function (token) {
            this.token = token;
            this.status = true;
        },
        fail: function () {
            this.token = null;
            this.status = false;
        }

    },
    mounted: function () {

    }
})


function recaptcha_success(token) {
    recaptcha_js.success(token);
}

function recaptcha_fail() {
    recaptcha_js.fail();
}