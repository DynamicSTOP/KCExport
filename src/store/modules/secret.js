const state = {
    /**
     * secret key. 40 \w\d char string
     */
    secretKey: false
};

const getters = {
    secretKey: state => state.secretKey
};


const mutations = {
    updateSecretKey(state, secretKey) {
        if (secretKey) {
            state.secretKey = secretKey;
            try {
                localStorage.setItem('kce_secretKey', secretKey);
            } catch (e) {
                console.error(e);
            }
        }
    }
};

const actions = {
    loadSecretKey(context) {
        if (localStorage.getItem('kce_secretKey')) {
            const secretKey = localStorage.getItem('kce_secretKey');
            if (secretKey && secretKey.length === 40) {
                return context.commit('updateSecretKey', secretKey);
            }
        }
        const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let key = "";
        for (let i = 0; i < 40; i++) key += abc[Math.floor(Math.random() * abc.length)];
        context.commit('updateSecretKey', key);
    }
};

export default {state, getters, mutations, actions};