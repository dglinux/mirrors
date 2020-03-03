"use strict";

window.addEventListener("load", () => {
    fetch("./status.json").then(res => {
        return res.json();
    }).then(json => {
        renderList(json);
    });
});

function renderList(data) {
    function getImportance(state) {
        switch (state) {
            case "success":
                return 1;

            case "syncing":
                return 2;

            case "paused":
                return 3;

            case "failed":
                return 4;
        }
    }
    data.sort((a, b) => {
        return getImportance(a.status) - getImportance(b.status);
    });
    const model = document.querySelector("#model");
    const table = document.querySelector(".mirror-table");
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const node = model.cloneNode(true);
        node.id = "data" + i;
        console.log(item);
        node.querySelector(".distro-name").innerHTML = item.name;
        node.querySelector(".is-master").innerHTML = item.is_master ? "<i class=\"fas fa-check\"></i>" : "<i class=\"fas fa-times\"></i>";
        setSyncingState(node.querySelector(".status"), item.status);
        node.querySelector(".last-update").innerHTML = item.last_update.substr(0, item.last_update.length - 5);
        node.querySelector(".last-ended").innerHTML = item.last_ended.substr(0, item.last_ended.length - 5);
        node.querySelector(".update-schedule").innerHTML = item.next_schedule.substr(0, item.next_schedule.length - 5);
        setProtocol(node.querySelector(".upstream"), item.upstream);
        node.querySelector(".size").innerHTML = item.size;
        table.lastElementChild.appendChild(node);
    }
}

function setSyncingState(el, res) {
    switch (res) {
        case "success":
            el.innerHTML = "<i class=\"fas fa-check\"></i>";
            el.classList.add("success");
            break;

        case "syncing":
            el.innerHTML = "<i class=\"fas fa-spinner\"></i>";
            break;

        case "paused":
            el.innerHTML = "<i class=\"fas fa-pause\"></i>";
            break;

        case "failed":
            el.innerHTML = "<i class=\"fas fa-times\"></i>";
            el.classList.add("failed");
            break;
    }
}

function setProtocol(el, res) {
    el.setAttribute("prompt", res);
    el.innerHTML = "<a href=\"" + res + "\">" + res.split(":")[0] + "</a>";
}