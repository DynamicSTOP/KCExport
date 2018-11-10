<template>
    <div class="section padding">
        <div class="title is-2">Help.</div>

        <div class="title is-4">How do i import my ship list?</div>
        <p>If you are using KC3 you should see new option on <strong>Strategy&nbsp;Room > Ships > Ship&nbsp;List</strong> page.
            Look for <strong>Export to</strong>: <strong>kc3.moe</strong> (Ctrl+F). If it's not there check how it's done manually bellow.</p>
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
        <p>So what can you setup right now? Will it show original names or romanization, compact display or not, stats to show, min
            luck to display,
            highlight ships by master id, filter ships by master id.</p>
        <p>You can also check
            <router-link :to="{name:'ShipTable'}">ship table</router-link>
            . It should be pretty similar to KC3 ships tab inside Strategy Room.
        </p>

        <div class="title is-4">Ok, how do i share my ship list now?</div>
        <p>Once you've imported ship list, it's saved into localstorage as current one.
            Your browser will remember it until you switch to other ship list or clear cache.
            If you never imported this list before you should be able to see <strong>save</strong> and <strong>shortify</strong>(in case you've added it)
            buttons at the top while you are on
            <router-link :to="{name:'ShipList'}">shiplist</router-link>
            tab.
        </p>
        <p>Once you click <strong>save</strong>, your ship list would be stored in <strong>your</strong> list storage. You can see all saved lists in
            <router-link :to="{name:'Storage'}">it</router-link>
            . Later you will be able to edit comments in storage, import\export to csv etc.
        </p>
        <p>If you click <strong>Shortify</strong>, saving process from above would be done as well as link shortifing.
            You should see button text changing to <strong>Shorting...</strong> and once it's done to <strong>Short Link</strong>.
            You can right click and copy and share it now. It should be tiny!<br>
            Another way would be to save list and use <strong>"Make short link"</strong> button inside list storage.
        </p>
        <p>
            P.S. There are pretty high chances that short links will live for 2+ years if not for eternity.
        </p>

        <div class="title is-4">I have an idea! I have questions! I got a problem!</div>
        <p>If it's not part of <a href="https://github.com/DynamicSTOP/kcexport/projects" target="_blank">planned
            features or fixes</a>, you can:</p>
        <ul>
            <li>contact <strong>DynamicSTOP#6314</strong> in <a href="https://discord.gg/QP6N8QQ" target="_blank">KC3discord</a>
            </li>
            <li>or open a new issue on <a href="https://github.com/DynamicSTOP/kcexport/issues"
                                          target="_blank">github</a>.
            </li>
        </ul>

        <div class="title is-4">(For developers) Can i post\request ship lists directly from my app?</div>
        <p>Yes. But you would have to deal with specific data packer format.</p>
        <p>Check <a href="https://github.com/DynamicSTOP/kcexport/tree/dev/src/datapacker" target="_blank">this</a>
            and shortifyKCList request <a
                    href="https://github.com/DynamicSTOP/kcexport/blob/dev/src/store/modules/shipLists.js"
                    target="_blank">here</a>.</p>
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