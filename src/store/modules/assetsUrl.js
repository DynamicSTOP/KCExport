const state = {
    /**
     * link to kc3 extension. reuse kc3 avatars instead of loading sprites
     */
    assetsUrl: false
};

const getters = {
    assetsUrl: state => state.assetsUrl
};


const mutations = {
    updateAssetsUrl(state, shipIconBaseUrl) {
        if (shipIconBaseUrl) {
            state.assetsUrl = shipIconBaseUrl;
            try {
                localStorage.setItem('kce_assetsUrl', shipIconBaseUrl);
            } catch (e) {
                console.error(e);
            }
        }
    }
};

const actions = {
    updateAssetsUrl(context, assetsUrl) {
        context.commit('updateAssetsUrl', assetsUrl);
    },

    loadStoredUrl(context){
        if (localStorage.getItem('kce_assetsUrl')) {
            const assetsUrl = localStorage.getItem('kce_assetsUrl');
            if (assetsUrl.length > 0) {
                context.commit('updateAssetsUrl', assetsUrl);
            }
        }
    }
};

export default {state, getters, mutations, actions};