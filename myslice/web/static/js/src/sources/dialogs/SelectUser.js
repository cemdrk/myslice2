import axios from 'axios';
import actions from '../actions/UsersActions';

const UsersSource = () => {
    return {
        fetch: {
            remote(state) {
                return axios.get('/api/v1/users');
            },

            // this function checks in our local cache first
            // if the value is present it'll use that instead (optional).
            // local(state) {
            //     return state.authorities ? state.authorities : null;
            // },

            // here we setup some actions to handle our response
            //loading: actions.loadingResults, // (optional)
            success: actions.updateUsers, // (required)
            error: actions.errorUsers, // (required)

            // should fetch has precedence over the value returned by local in determining whether remote should be called
            // in this particular example if the value is present locally it would return but still fire off the remote request (optional)
            shouldFetch(state) {
                return true
            }
        },

        fetchFromUserAuthority: {
            remote(state) {
                return axios.get('/api/v1/authorities/users');
            },
            success: actions.updateUsers, // (required)
            error: actions.errorUsers, // (required)

            shouldFetch(state) {
                return true
            }
        },

        fetchFromAuthority: {
            remote(state) {
                return axios.get('/api/v1/authorities/'+state.authority+'/users');
            },
            success: actions.updateUsers, // (required)
            error: actions.errorUsers, // (required)

            shouldFetch(state) {
                return true
            }
        },

    }
};

export default UsersSource;

