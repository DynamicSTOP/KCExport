<template>
    <div class="section">
        <div class="title is-2">Welcome!</div>
        <div>
            <p>This site was made so you could easily exchange ship lists (and potentially equip lists in future)
                without posting stuff to imgur and other image exchange sites.</p>
            <p>Actually you still can, but can you do Ctrl+F in those? Hmmmmm?</p>

            <div class="title is-4">How do i import my ship list?</div>
            <p>While this site is still in <em>"alpha"</em> you can run
                <a href="https://github.com/DynamicSTOP/kcexport/blob/dev/chromeSnippets/messageChannelsKC3.js"
                   target="_blank">this script</a>
                in your KC3 Strategy room. Just open devtools and paste it into console.</p>
            <p>There would probably be better ways like button in KC3 viewer once we settle with
                <a href="https://github.com/DynamicSTOP/kcexport/projects" target="_blank">primary tasks</a>.</p>

            <div class="title is-4">How do i share my ship list?</div>
            <p>Once you've imported ship list you should be able to see it
                <router-link :to="{name:'ShipList'}">here</router-link>
                .
                Now there should be button at the top that says "Save". Use it!
            </p>
            <p>Now your ship list is stored in browser localstorage. Look for
                <router-link :to="{name:'Storage'}">storage</router-link>
                button at the top. This should lead you to table containing all ship lists that you've stored so far.
                You will see Full Link column with huuuuuge Raw link. This one should work forever, but it's hard to
                share it.
            </p>
            <p>
                You should see "Make short link" button. Click it once and button will be replaced with short link in
                couple seconds. How long that one will be alive? I dunno. May be it would be wiped once in a year.
                May be it will remain forever. That depends on how popular service would be.
                You could also use other service for short links. Here is one from
                <a href="https://goo.gl/" target="_blank" rel="noopener">google</a>.
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

            <div class="title is-4">Can i post\request ship lists directly from my app?</div>
            <p>Yes. But you would have to deal with specific data packer format.</p>
            <p>Check <a href="https://github.com/DynamicSTOP/kcexport/tree/dev/src/datapacker" target="_blank">this</a>
                and shortifyShipList request <a
                        href="https://github.com/DynamicSTOP/kcexport/blob/dev/src/store/modules/shipLists.js"
                        target="_blank">here</a></p>
            <p>And you should probably guess that i have no idea how long data would be alive in db.</p>

            <div class="title is-3">Have fun!</div>

            <p>
                P.S. boring stuff regarding "legal stuff" for EU etc. This site uses browser <a
                    href="https://www.w3schools.com/html/html5_webstorage.asp">localstorage</a> to store ship lists and
                settings. Besides stuff that you've personally chose to share via raw links or short links
                (api.kc-db.info) nothing goes outside. Theoretically, since part of the shared data is ship ids,
                it may be use as uniq fingerprint to identify you. For now api.kc-db.info remembers only hash (i.e. list
                id)
                raw link and timestamp when it was added. There are amazon logs that can contain you browser header as
                well as ip,
                but they aren't parsed (for now) in any way. We might add google analytics later to understand what
                features of site
                are useless and what should probably be improved. We aren't planning to use that data for commercial
                purposes.
                We aren't planning to add any way of ads. If you see those, better check that you are using <strong>HTTPS</strong>
                protocol and your antivirus software is up to date and doing it's job. Yes it's free. If you want to support KC3 team check <a
                    href="https://www.patreon.com/kc3kai">Patreon</a>. We are not responsible for how any of your
                browser extensions
                deal with our site and(or) any 3rd party link shortification services that you chose instead deal with
                privacy etc. Though we might take steps to fix compatibility issues.
                We would only wipe your data by request from your side if you would be able to proof that it was submitted by you and only you
                (i.e. that's impossible). Just wait a bit, i bet in 1 year it will be gone.
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