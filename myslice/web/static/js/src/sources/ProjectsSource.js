var axios = require('axios');
import ProjectsActions from '../actions/ProjectsActions';
import ProjectsFormActions from '../actions/ProjectsFormActions';

module.exports = function() {
    return {
        fetch: {
            // remotely fetch something (required)
            remote(state) {
                return axios.get('/api/v1/projects');
            },

            // this function checks in our local cache first
            // if the value is present it'll use that instead (optional).
            // local(state) {
            //     return state.authorities ? state.authorities : null;
            // },

            // here we setup some actions to handle our response
            //loading: ProjectsActions.loadingResults, // (optional)
            success: ProjectsActions.updateProjects, // (required)
            error: ProjectsActions.errorProjects, // (required)

            // should fetch has precedence over the value returned by local in determining whether remote should be called
            // in this particular example if the value is present locally it would return but still fire off the remote request (optional)
            shouldFetch(state) {
                return true
            }
        },

        submit: {
            // remotely fetch something (required)
            remote(state) {
                var v = 'public';
                if (state.v_public) v = 'public';
                if (state.v_protected) v = 'protected';
                if (state.v_private) v = 'private';
                return axios.post('/api/v1/projects', {
                        'label': state.label,
                        'name':  state.name,
                        'visibility': v,
                        'url': state.url,
                        'description': state.description,
                        'start_date': state.start_date,
                        'end_date': state.end_date,
                    });
            },

            // this function checks in our local cache first
            // if the value is present it'll use that instead (optional).
            // local(state) {
            //     return state.authorities ? state.authorities : null;
            // },

            // here we setup some actions to handle our response
            //loading: ProjectsActions.loading, // (optional)
            success: ProjectsFormActions.submitSuccess, // (required)
            error: ProjectsFormActions.submitError, // (required)

            // should fetch has precedence over the value returned by local in determining whether remote should be called
            // in this particular example if the value is present locally it would return but still fire off the remote request (optional)
            shouldFetch(state) {
                return true
            }
        }
    }
};