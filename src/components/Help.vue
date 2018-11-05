<template>
    <div class="section padding">
        <div class="title is-2">Help.</div>

        <div class="title is-4">How do i import my ship list?</div>
        <p>If you are using kc3 you should see new option in strategy room showcase export options. If not check how
            it's done manually bellow.</p>
        <p>While this site is still in <em>"early&nbsp;early&nbsp;alpha"</em> you can run
            <a href="https://github.com/DynamicSTOP/kcexport/blob/dev/chromeSnippets/messageChannelsKC3.js"
               target="_blank">this script</a>
            in your KC3 Strategy room. Just open devtools and paste it into console.</p>
        <p>There would probably be better ways like button in KC3 viewer once we settle with
            <a href="https://github.com/DynamicSTOP/kcexport/projects" target="_blank">primary tasks</a>.</p>

        <div class="title is-4">Can i change how list looks?</div>
        <p>Yes! Check out
            <router-link :to="{name:'Options'}">options</router-link>
            .
        </p>
        <p>Right now there are only two modes: <strong>regular</strong> and <strong>senpoi</strong>(for
            helpers).
            You can tweak each one independently with your own settings. Later we will add an ability to add more modes.
        </p>
        <p>So what can you setup? Will it use original names or romanization, compact display or not, stats to show, min
            luck to display,
            highlight ships by master id, filter ships by master id.</p>

        <div class="title is-4">Ok, how do i share my ship list now?</div>
        <p>Once you've imported ship list, it's saved into localstorage as current one.
            Your browser will remember it until you switch to other list or clear cache.
            If you never imported this list before you should be able to see save button at the top while you on
            <router-link :to="{name:'ShipList'}">shiplist</router-link> tab.
        </p>
        <p>Now your ship list is stored in your list storage. You can see all saved lists in
            <router-link :to="{name:'Storage'}">it</router-link>
            .
            Link to the storage also available in top bar. Once you in it, you will see <strong>Full Link</strong>
            column with huuuuuge Raw link. This one should work forever, but it's hard to
            share it, right?
        </p>
        <p>
            You can make short one with "Make short link" button. Click it once and button will be replaced with
            short link in couple seconds. There are pretty high chances that short links will live for 2+ years
            if not for eternity. Now you send it to your friend or wherever you want.
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

        <div class="title is-4">(For developers) Can i post\request ship lists directly from my app?</div>
        <p>Yes. But you would have to deal with specific data packer format.</p>
        <p>Check <a href="https://github.com/DynamicSTOP/kcexport/tree/dev/src/datapacker" target="_blank">this</a>
            and shortifyShipList request <a
                    href="https://github.com/DynamicSTOP/kcexport/blob/dev/src/store/modules/shipLists.js"
                    target="_blank">here</a></p>
    </div>
</template>
<style type="scss" scoped>
    .section {
        padding-top: 0;
    }

    strong {
        color: #fff;
        font-weight: 600;
    }

    .title {
        margin-top: 30px;
        color: #fff;
    }
</style>