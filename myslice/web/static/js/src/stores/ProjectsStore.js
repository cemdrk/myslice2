import alt from '../alt';
import actions from '../actions/ProjectsActions';
import source from '../sources/ProjectsSource';

import common from '../utils/Commons';

class ProjectsStore {

    constructor() {
        // list of project
        this.projects = [];

        // the currently active project
        this.current = {
            project: null,
            users: [],
            pi_users: [],
            slices: []
        };

        // the saving project
        this.saving = {};

        this.filter = [];








        this.addUserToProject = null;
        this.removeUserFromProject = null;
        this.removedUsers = {};

        this.deleteSliceFromProject = null;
        this.deletedSlices = {};

        this.deleteProj = null;
        this.deletedProjects = [];

        this.dialog = null;

        this.errorMessage = null;

        this.bindListeners({
            updateProjectElement: actions.UPDATE_PROJECT_ELEMENT,
            updateProjects: actions.UPDATE_PROJECTS,
            setCurrentProject: actions.SET_CURRENT_PROJECT,
            updateUsers: actions.UPDATE_USERS,
            addUser: actions.ADD_USER,
            updateAddUser: actions.UPDATE_ADD_USER,
            errorAddUser: actions.ERROR_ADD_USER,

            removeUser: actions.REMOVE_USER,
            updateRemoveUser: actions.UPDATE_REMOVE_USER,
            errorRemoveUser: actions.ERROR_REMOVE_USER,

            deleteSlice: actions.DELETE_SLICE,
            updateDeleteSlice: actions.UPDATE_DELETE_SLICE,
            errorDeleteSlice: actions.ERROR_DELETE_SLICE,

            deleteProject: actions.DELETE_PROJECT,
            updateDeleteProject: actions.UPDATE_DELETE_PROJECT,
            errorDeleteProject: actions.ERROR_DELETE_PROJECT,


            updateSlices: actions.UPDATE_SLICES,
            fetchProjects: actions.FETCH_PROJECTS,
            errorProjects: actions.ERROR_PROJECTS,
            showDialog: actions.SHOW_DIALOG,

            addUsers: actions.ADD_USERS,

            saveProject: actions.SAVE_PROJECT,
            saveProjectError: actions.SAVE_PROJECT_ERROR,
            saveProjectSuccess: actions.SAVE_PROJECT_SUCCESS,
        });

        this.registerAsync(source);
    }

    fetchProjects(filter) {

        this.filter = filter;

        if (!this.getInstance().isLoading()) {
            this.getInstance().fetch();
        }

    }

    updateProjectElement(project) {
        let index = this.projects.findIndex(function(projectElement) {
            return (projectElement.id === project.id);
        });

        if (index !== -1) {
            this.projects[index] = project;
        } else {
            this.projects.unshift(project);
        }

        this.errorMessage = null;
    }

    setCurrentProject(project) {
        this.current.users = [];
        this.current.slices = [];
        this.current.project = project;
        if(!(project.id in this.removedUsers)){
            this.removedUsers[project.id] = [];
        }
        if(!(project.id in this.deletedSlices)){
            this.deletedSlices[project.id] = [];
        }

        if (!this.getInstance().isLoading()) {
            this.getInstance().users();
            this.getInstance().slices();
        }

        if ((typeof(project.isCurrent) === 'undefined') || (!project.isCurrent)) {
            for (let i = 0; i < this.projects.length; i++) {
                this.projects[i].isCurrent = false;
            }
            project.isCurrent = true;
        } else {
            project.isCurrent = false;
        }
    }

    updateProjects(projects) {
        if (projects.hasOwnProperty('data')) {
            this.projects = projects.data.result;
        } else {
            this.projects = projects;
        }
    }

    errorProjects(errorMessage) {
        console.log(errorMessage);
    }

    addUsers(users) {
        this.getInstance().addUsers(users);
    }



    updateUsers(users) {
        if (users.hasOwnProperty('data')) {
            this.current.users = users.data.result;
        } else {
            this.current.users = users;
        }
    }
    addUser(user) {
        this.addUserToProject = user;
        this.getInstance().addUser();
    }
    updateAddUser(message) {
        this.current.users.push(this.addUserToProject);
        this.addUserToProject=null;
    }
    errorAddUser(errorMessage) {
        console.log(errorMessage);
    }

    removeUser(user) {
        console.log(user);
        this.removeUserFromProject = user;
        this.getInstance().removeUser();
    }
    updateRemoveUser(message) {
        console.log(message);
        this.removedUsers[this.current.project.id].push(this.removeUserFromProject);
        this.current.project.pi_users = common.removeFromArray(this.current.project.pi_users, this.removeUserFromProject.id);
        this.removeUserFromProject=null;
        //this.current.users = common.removeFromArray(this.current.users, this.removeUserFromProject.id, 'id');
    }
    errorRemoveUser(errorMessage) {
        console.log(errorMessage);
    }

    deleteSlice(slice) {
        this.deleteSliceFromProject = slice;
        this.getInstance().deleteSlice();
    }
    updateDeleteSlice(message) {
        this.deletedSlices[this.current.project.id].push(this.deleteSliceFromProject);
        this.current.project.slices = common.removeFromArray(this.current.project.slices, this.deleteSliceFromProject.id);
        this.deleteSliceFromProject=null;
    }
    errorDeleteSlice(errorMessage) {
        console.log(errorMessage);
    }

    deleteProject(project) {
        console.log("delete project");
        this.deleteProj = project;
        this.getInstance().deleteProject();
    }
    updateDeleteProject(message) {
        this.deletedProjects.push(this.deleteProj);
        this.deleteProj=null;
    }
    errorDeleteProject(errorMessage) {
        console.log(errorMessage);
    }

    errorUsers(errorMessage) {
        console.log(errorMessage);
    }

    updateSlices(slices) {
        if (slices.hasOwnProperty('data')) {
            this.current.slices = slices.data.result;
        } else {
            this.current.slices = slices;
        }
    }

    errorSlices(errorMessage) {
        console.log(errorMessage);
    }

    showDialog(dialog) {
        this.dialog = dialog;
    }


    /*
        Save Project
        The "saveProject" state will be used
     */
    saveProject(save) {
        this.saving = this.current.project;
        console.log(this.saving);
        if (save.hasOwnProperty('users')) {
            save.users.map(r => {
                if (!this.saving.pi_users.includes(r.id)) {
                    this.saving.pi_users.push(r.id);
                }
            });
        }

        if (save.hasOwnProperty('remove_user')) {
            if (index = this.saving.pi_users.indexOf(save.remove_user.id)) {
                this.saving.pi_users.splice(index, 1);
            }
        }

        if (!this.getInstance().isLoading()) {
            this.getInstance().saveProject();
        }

    }

    saveProjectSuccess(x) {
        console.log(x);
        // {"result": "success", "debug": null, "error": null, "events": [["858dddc3-5500-4ba1-a6b3-430ef32434d6"]]}

        this.saving = {};
    }

    saveProjectError(x) {
        console.log(x);

        this.saving = {};
    }

    errorSave() {

    }

    successSave() {
        // reset the saving state
        this.saving = [];
    }



}


export default alt.createStore(ProjectsStore, 'ProjectsStore');

