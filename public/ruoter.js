function check_key(key) {
    const db = firebase.database();
    db.ref("router/" + key).once("value").then(
        res => {
            check_target(res.val());
        }
    ).catch(
        err => {
            homepage();
        }
    );
};

function check_target(target) {
    try {
        const url_obj = new URL(target);
        if (window.confirm("即將為你跳轉，目標網址：" + target + "，麻煩使用者注意連結之安全性。")) {
            window.location.href = target;
        }
    }
    catch (error) {
        homepage();
    }
};

function homepage() {
};

window.addEventListener("load", function () {
    const plain_url = window.location.href;
    const url_obj = new URL(plain_url);
    const key = url_obj.searchParams.get("n");
    if (key !== null) {
        check_key(key);
    }
    else {
        homepage();
    }
});