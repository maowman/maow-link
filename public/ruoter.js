let router_js = new Vue({
    el: "#router_dom",
    data: {
        key: null,
        target: null
    },
    methods: {
        check_key: function () {
            const db = firebase.database();
            db.ref("router/" + this.key).once("value").then(
                res => {
                    this.target = res.val();
                    this.check_target();
                }
            ).catch(
                err => {
                    console.log(err);
                }
            )

        },
        check_target: function () {
            try{
                const url_obj = new URL(this.target);
                window.location.href = this.target;
            }
            catch (error){
                console.log(error);
            }
        }
    },
    mounted: function () {
        const plain_url = window.location.href;
        const url_obj = new URL(plain_url);
        this.key = url_obj.searchParams.get("n");
        if (this.key !== null) {
            this.check_key();
        }
    }
})