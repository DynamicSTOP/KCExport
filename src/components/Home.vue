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
        </div>

    </div>
</template>
<style type="scss" scoped>
    .section {
        padding-top: 0;
    }

    .title {
        margin-top: 30px;
        color: #fff;
    }
</style>