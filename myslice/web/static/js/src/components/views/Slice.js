import React from 'react';

import store from '../../stores/views/Slice';
import actions from '../../actions/views/Slice';

import View from '../base/View';
import Panel from '../base/Panel';
import PanelHeader from '../base/PanelHeader';
import PanelBody from '../base/PanelBody';
import Title from '../base/Title';
import Text from '../base/Text';

import SelectResourceDialog from '../dialogs/SelectResource';
//
//
const SliceTitle = ({slice}) => {
    var title = slice.name || slice.shortname || '';
    var subtitle = slice.hrn || '';

    return <Title title={title} subtitle={subtitle} />;
};

SliceTitle.propTypes = {
    slice: React.PropTypes.object.isRequired
};


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

    addResources(testbed) {
        actions.selectResourceDialog(testbed);
    }

    
    render() {

        var panelRight = null;
        var dialog = null;

        if (this.state.errorMessage) {
            return (
                <div>Something is wrong</div>
            );
        }

        switch(this.state.dialog) {
            case 'selectResource':
                dialog = <SelectResourceDialog testbed={this.state.testbed} close={this.closeDialog} />;
                break;
            case 'users':
                dialog = <UsersDialog close={this.closeDialog} />;
                break;

        }

        if (this.state.current) {
            var slice_title = this.state.current.name;

            return (
                <View>
                    <Panel>
                        <PanelHeader>
                            <Title title={slice_title} subtitle={this.state.current.shortname}/>
                        </PanelHeader>
                        <PanelBody>
                        </PanelBody>
                        {dialog}
                    </Panel>
                    {panelRight}
                </View>
            );
        } else {
            return (
                <View>
                    <Panel>
                        <PanelHeader>
                            <SliceTitle slice={this.state.slice} />
                        </PanelHeader>
                        <PanelBody>


                        </PanelBody>
                    </Panel>
                    <Panel>
                        <PanelHeader>

                        </PanelHeader>
                        <PanelBody>
                            <Text>
                                Please select the resources to reserve by choosing a Testbed (text to change)
                            </Text>
                            <ul>
                            {
                                this.state.testbeds.filter(function(testbed) {
                                    return testbed.type == 'AM';
                                }).map(function(testbed) {
                                        return <li key={testbed.id} onClick={() => this.addResources(testbed)}>{testbed.name}</li>;
                                }.bind(this))
                            }
                            </ul>
                        </PanelBody>
                        {dialog}
                    </Panel>

                </View>
            );
        }
    }
}

export default SliceView;