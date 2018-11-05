<template>
    <div class="section padding">
        <div class="title is-2">Welcome!</div>
        <div>
            <p>This site was made so you could easily exchange ship lists (and potentially equip lists in future)
                without posting stuff to imgur and other image exchange sites.</p>
            <p>Actually you still can, but can you do Ctrl+F in those? Hmmmmm?</p>
            <p>Also since it alpha, some features may be removed and <span title="equip lists!">new one</span> added.
            </p>

            <div class="title is-4">How do i ... ?</div>
            <p>First check
                <router-link :to="{name:'Help'}">help</router-link>
                page.
                If it didn't helped you can see a way to contact devs through links bellow
            </p>

            <div class="title is-4">I have an idea! I have questions! I got a problem!</div>
            <p>If it's not part of <a href="https://github.com/DynamicSTOP/kcexport/projects" target="_blank">planned
                features or fixes</a>, you can:</p>
            <ul>
                <li>contact <strong>DynamicSTOP#6314</strong> in <a href="https://discord.gg/QP6N8QQ" target="_blank">KC3discord</a>
                </li>
                <li>or open a new issue on <a href="https://github.com/DynamicSTOP/kcexport/issues"
                                              target="_blank">github</a>
                </li>
            </ul>

            <div class="title is-4"></div>
            <p>
                If you feel generous enough and want to support KC3 team check <a
                    href="https://www.patreon.com/kc3kai">Patreon</a>.
            </p>
            <div class="title is-3">Have fun!</div>

            <p>
                P.S. boring stuff regarding "legal stuff" for EU etc. This site uses browser <a
                    href="https://www.w3schools.com/html/html5_webstorage.asp">localstorage</a> to store ship lists and
                settings. Besides stuff that you've personally chose to share via raw links or short links
                (api.kc-db.info) nothing goes outside. Theoretically, since part of the shared data is ship ids,
                it may be use as uniq fingerprint to identify you, but other then ship ids we aren't storing anything
                that
                can directly identify you.
                For now api.kc-db.info remembers only hash (i.e. list id)
                raw link and timestamp when it was added. There are amazon logs that can contain you browser header as
                well as ip,
                but they aren't parsed (for now) in any way. We might add google analytics later to understand what
                features of site are useless and what should probably be improved.
            </p>
        </div>

    </div>
</template>
<style type="scss" scoped>
    .section {
        padding-top: 0;
    }

    strong {
        color: #fff;
    }

    .title {
        margin-top: 30px;
        color: #fff;
    }
</style>