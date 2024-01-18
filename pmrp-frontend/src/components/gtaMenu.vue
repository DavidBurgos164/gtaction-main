<template>
    <div id="report-system" style="user-select: none;">
        <div id="header" style="user-select: none;">
            <div class="container-login100">
                <div class="popup2">
                    <menu-button style="position:absolute; margin-left:38.2vw;"></menu-button>
                    <div class="navBaseReports">
                        <ul v-for="navI in navItems" :key="navI">
                            <li class="hNav"><b @click="browsingType = navI">{{ navI }}</b></li>
                        </ul>
                    </div>
                   
                    <!--*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* AYUDA *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-->
                    <div class="systemCluster" style="overflow:scroll; height:16vw; overflow-x: hidden; margin-top: 1vw;">
                         <!--*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* INICIO // CARGAR EVENTOS *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-->
                        <div class="head1"><a style="color: #b1a1ff;">{{ browsingType }}</a>
                            <table v-if="browsingType === 'Inicio'" class="tableOne" cellspacing="2">
                                <tr>
                                    <th style="max-width: 5vw;">Prueba</th>
                                    <th>Uso</th>
                                </tr>
                            </table>
                        </div>
                        <table v-if="browsingType === 'Ayuda'" class="tableOne" cellspacing="2">
                            <tr>
                                <th style="max-width: 5vw;">Taclas</th>
                                <th>Uso</th>
                            </tr>
                        </table>
                    
                        <!--*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* FACCIONES LEGALES *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-->
                    
                        <table v-if="browsingType === 'Empresas'" class="tableOne" cellspacing="2">
                            <tr>
                                <th style="max-width: 5vw;">Nombre</th>
                                <th>Nivel</th>
                            </tr>
                            <tr v-for="faction in factions" :key="faction.id">
                                <td v-if="faction.tipo == 'empresa'">{{ faction.name }}</td>
                                <td v-if="faction.tipo == 'empresa'">{{ faction.level }}</td>
                            </tr>
                        </table>
                    
                        <!--*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* AYUDA *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-->
                    
                        <table v-if="browsingType === 'Ayuda'" class="tableOne" cellspacing="2">
                            <tr>
                                <th style="max-width: 5vw;">Taclas</th>
                                <th>Uso</th>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import menuButton from "./menuButton.vue";

export default {
    data: function () {
        return {
            navItems: ["Inicio", "Empresas", "Ayuda", "Faccion 1", "Faccion 2"],
            browsingType: "Inicio",
        };
    },
    components: {
        menuButton
    },
    methods: {
        close: function () {
            if (window.mp) {
                window.mp.trigger("closeRoute");
            }
        },
        async loadFactions() {
            try {
                // FALTA HACER LA CONSULTA
                const response = await fetch(''); 
                const factionsData = await response.json();

            
                factionsData.forEach(faction => {
                    this.addFaction(faction);
                });
            } catch (error) {
                console.error('Error al cargar las facciones:', error);
            }
        },
        ...mapMutations(["addFaction"]),
    },
    computed: {
        ...mapGetters({
            factions: "factionsList"
        })
    },
    created() {
        // Ejemplo de cómo llamar a la mutación
        this.loadFactions();
    }
};
</script>


<style scoped>
.navBaseReports {
    opacity: 1;
    width: 7vw;
    height: 15vw;
    border-radius: 15px;
    /*background-color: rgba(0, 0, 0, 0.85);*/
    color: rgba(10, 10, 10, 0.644);
    background: -webkit-linear-gradient(right,
            rgba(10, 10, 10, 0.944),
            rgba(1, 1, 1, 0.651));
    margin-left: -0.6vw;
    --notchSize: 20px;

    clip-path: polygon(0% var(--notchSize),
            var(--notchSize) 0%,
            calc(100% - var(--notchSize)) 0%,
            100% var(--notchSize),
            100% calc(100% - var(--notchSize)),
            calc(100% - var(--notchSize)) 100%,
            var(--notchSize) 100%,
            0% calc(100% - var(--notchSize)));
    position: absolute;
    text-align: center;
}

.hNav {
    margin-top: 1vw;
    display: block;
    color: #ffffff;
    text-decoration: none;
    font-size: 1vw;
    line-height: 50px;
    line-height: 1.5em;
    text-transform: normal;
    letter-spacing: normal;
    list-style-type: none;
    transition: 0.1s;
}

.hNav:hover {
    border-bottom: solid rgba(70, 255, 175, 0.767) 5px;
}

* {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/*rgba(210, 133, 255, 0.822)     border-radius: 0px 0px 5px 5px;
*/

.systemCluster {
    border-bottom: none;
}

/* width */
::-webkit-scrollbar {
    width: 5px;
    position: relative;
}

/* Track */
::-webkit-scrollbar-track {
    background: rgba(10, 10, 10, 0);
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #b1a1ff;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #838383;
}

.popup2 {
    opacity: 1;
    width: 40vw;
    border-top: solid rgb(183, 119, 255) 5px;
    border-right: solid rgba(255, 255, 255, 0.311) 2px;
    border-left: solid rgba(255, 255, 255, 0.311) 2px;
    height: 15vw;
    /*background-color: rgba(0, 0, 0, 0.85);*/
    color: rgba(10, 10, 10, 0.644);
    background: -webkit-linear-gradient(right,
            rgba(10, 10, 10, 1),
            rgba(1, 1, 1, 0.851));
    backdrop-filter: blur(20px);

    --notchSize: 15px;

    clip-path: polygon(0% var(--notchSize),
            var(--notchSize) 0%,
            calc(100% - var(--notchSize)) 0%,
            100% var(--notchSize),
            100% calc(100% - var(--notchSize)),
            calc(100% - var(--notchSize)) 100%,
            var(--notchSize) 100%,
            0% calc(100% - var(--notchSize)));

    margin-left: auto;
    margin-right: auto;
    margin-bottom: 25vw;
    overflow-y: hidden;
    overflow-x: hidden;
    /* Hide horizontal scrollbar */

    background-color: #000000ec;
}

#moveablediv {
    position: absolute;
    resize: both;
}

.tableOne {
    width: 100%;
    width: 30vw;
    margin-left: 7.6vw;
    font-family: Myriad Pro, Segoe UI, Verdana, sans-serif;
    background: -webkit-linear-gradient(right,
            rgba(10, 10, 10, 1),
            rgba(1, 1, 1, 0.851));
    backdrop-filter: blur(20px);
    border-right: solid rgba(255, 255, 255, 0.311) 2px;
    border-left: solid rgba(255, 255, 255, 0.311) 2px;
}

.sectionContainer {
    width: 100%;
    width: 30vw;
    margin-left: 7.6vw;
    font-family: Myriad Pro, Segoe UI, Verdana, sans-serif;
}

th {
    background: -webkit-linear-gradient(right, #929292, #929292);
    color: #000000;
}

td {
    text-align: center;
    background-color: rgb(156, 156, 156);
    font-weight: 650;
    max-width: 20vw;
    word-wrap: break-word;
}

h4 {
    margin: auto;
}

.widthLimit {
    max-width: 10px;
}

.head1 {
    color: #fff;
    /*font-family: 'OSL';*/
    font-family: "OSL";
    font-family: Myriad Pro, Segoe UI, Verdana, sans-serif;
    font-weight: 1000;
    src: url("../assets/fonts/OSL.ttf") format("truetype");
    font-size: 0.7vw;
    text-align: center;
    margin-top: 0.5vw;
    font-size: 29px;
    line-height: 1vw;
    margin-left: 4.3vw;
}

@keyframes fadeout {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

a::after {
    display: block;
    content: "";
    width: 100%;
    height: 0.2vw;
    background: rgba(220, 171, 255, 20);
    opacity: 0.5;
    border-radius: 20px;
    position: absolute;
    bottom: 0;
    left: 0;
}

a {
    position: relative;
}

.actionBtn {
    background-color: rgba(0, 0, 0, 0);
    transition: 0.2s;
    font-size: 1vw;
    line-height: 1vw;
    margin-left: 5px;
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 10px;
}

.btnAccept {
    border-bottom: solid rgba(0, 255, 42, 0.678) 2px;
}

.btnClose {
    border-bottom: solid rgba(255, 0, 0, 0.678) 2px;
}

.btnTeleport {
    border-bottom: solid rgba(0, 187, 255, 0.678) 2px;
}

.btnSpec {
    border-bottom: solid rgba(217, 91, 255, 0.678) 2px;
}

.switch {
    position: absolute;
    width: 60px;
    height: 34px;
}

.switch input {
    opacity: 1;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    background: rgb(255, 0, 0);
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: rgb(255, 255, 255);
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

.toggle:checked+.slider {
    background-color: #00ff2a;
}

.toggle:focus+.slider {
    box-shadow: 0 0 1px #00ff2a;
}

.toggle:checked+.slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}

.textOne {
    color: #fff;
    /*font-family: 'OSL';*/
    font-family: "OSL";
    font-family: Myriad Pro, Segoe UI, Verdana, sans-serif;
    font-weight: 1000;
    src: url("../assets/fonts/OSL.ttf") format("truetype");
    font-size: 0.7vw;
    text-align: center;
    font-size: 10px;
    line-height: 1vw;
}
</style>