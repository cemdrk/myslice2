import alt from '../../alt';

class SliceView {

    constructor() {
        this.generateActions(
            'fetchSlice',
            'updateSlice',
            'errorSlice',

            'saveSlice',
            'saveSliceSuccess',
            'saveSliceError',

            'removeResources',

            'fetchTestbeds',
            'updateTestbeds',
            'errorTestbeds',

            'selectResourceDialog',
            'selectUserDialog',
            'closeDialog',
            'deleteSlice'
        );
    }

}

export default alt.createActions(SliceView);


