import React from 'react';

import store from '../../stores/views/Slice';
import actions from '../../actions/views/Slice';

import { View, ViewHeader, ViewBody, Panel  } from '../base/View';
import { ElementSummary } from '../base/Element';
import Title from '../base/Title';
import Text from '../base/Text';
import { DateTime } from '../base/DateTime';

import { ResourcesSection } from '../sections/Resource';
import { TestbedSectionPanel } from '../sections/Testbed';
import { ResourceList } from '../objects/Resource';

import SelectResourceDialog from '../dialogs/SelectResource';

class SliceView extends React.Component {

    constructor(props) {
        super(props);
        this.state = store.getState();
        this.onChange = this.onChange.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    componentDidMount() {
        store.listen(this.onChange);
        actions.fetchSlice(this.props.slice);
        actions.fetchTestbeds();
    }

    componentWillUnmount() {
        store.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    closeDialog() {
        actions.closeDialog();
    }

    /*
        Shows the add resources dialog for the selected testbed
     */
    selectResourceDialog(testbed) {
        actions.selectResourceDialog(testbed);
    }

    /*
        Once user select some resources and apply this wil be called.
     */
    addResources(resources, leases=[]) {
        actions.saveSlice({'resources': resources, 'leases': leases})
    }
    removeResources(resources, leases=[]) {
        if(!Array.isArray(resources)){
            resources = Array(resources);
        }
        console.log(resources);
        actions.removeResources({'resources': resources, 'leases': leases})
        //actions.saveSlice({remove_resource: resource});
    }

    renderSliceTitle() {
        return this.state.slice.name || this.state.slice.shortname || ''
    }
    renderSliceProjectTitle() {
        if (this.state.slice.project) {
            return this.state.slice.project.name || this.state.slice.project.shortname
        }else{
            return "";
        }
    }
    render() {
        let dialog = null;

        if (this.state.errorMessage) {
            return (
                <div>Something is wrong</div>
            );
        }

        switch(this.state.dialog) {
            case 'selectResource':
                dialog = <SelectResourceDialog testbed={this.state.testbed} apply={this.addResources} cancel={this.closeDialog} />;
                break;

        }
        console.log(this.state.slice);

        /*
        *  Define options for testbed panel
        * */

        let testbedListOptions = [
            {
                'label' : 'Add Resources',
                'icon' : 'add',
                'callback' : this.selectResourceDialog
            }
        ];
        console.log(this.state.slice);
        /*
         *  Define options for ResourcesSummary
         * */
        let resourcesOptions = [
            {
                'label' : 'remove',
                'callback' : this.removeResources
            }
        ];

        return (<View>
            <ViewHeader>
                <Title
                    title={this.renderSliceProjectTitle()}
                    subtitle={this.renderSliceTitle()}
                    separator="/"
                />
            </ViewHeader>
            <ViewBody>
                <Panel>
                    <div>
                        <p>
                            {this.state.slice.id}
                        </p>
                        <DateTime label="Created" timestamp={this.state.slice.created} />
                        <DateTime label="Last updated" timestamp={this.state.slice.updated} />
                    </div>
                    <ElementSummary elements={this.state.slice.resources} type="resource"  />
                    <ElementSummary elements={this.state.slice.users} type="user"  />
                </Panel>
                <Panel>
                    <TestbedSectionPanel testbeds={this.state.testbeds} listOptions={testbedListOptions} />
                </Panel>
            </ViewBody>
            {dialog}
        </View>);
    }

}

export default SliceView;
