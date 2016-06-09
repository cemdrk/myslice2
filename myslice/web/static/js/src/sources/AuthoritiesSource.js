var axios = require('axios');
var actions = require('../actions/Authorities');

module.exports = {
    fetch: {
        // remotely fetch something (required)
        remote(state) {
            return axios.get('/api/v1/authorities');
        },

        // this function checks in our local cache first
        // if the value is present it'll use that instead (optional).
        local(state) {
            return state.results[state.value] ? state.results : null;
        },

        // here we setup some actions to handle our response
        //loading: actions.loadingResults, // (optional)
        success: actions.updateAuthorities, // (required)
        error: actions.errorAuthorities, // (required)

        // should fetch has precedence over the value returned by local in determining whether remote should be called
        // in this particular example if the value is present locally it would return but still fire off the remote request (optional)
        shouldFetch(state) {
            return true
        }
    }
};