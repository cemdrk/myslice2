import React from 'react';

import View from './base/View';
import { Panel, PanelHeader, PanelBody } from './base/Panel';
import PanelMenu from './base/PanelMenu';
import PanelMenuEntry from './base/PanelMenuEntry';
import Title from './base/Title';

import actions from '../actions/SettingsActions'
import store from '../stores/SettingsStore'

import LoadingPanel from './LoadingPanel'
import SettingsProfile from './SettingsProfile';
import SettingsRights from './SettingsRights';
import SettingsSsh from './SettingsSsh';
import SettingsPassword from './SettingsPassword';

class SettingsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = store.getState();
        this.handleSelect = this.handleSelect.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        store.listen(this.onChange);
        actions.fetchSettings();
    }

    componentWillUnmount(){
        store.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }
    // for Profile
    submitProfile() {
        actions.submitProfile();
    }

    updateProfile(name, value) {
        actions.updateProfile(name, value);
    }

    // for Keys
    generateKeys() {
        actions.generateKeys();
    }

    // for Password
    updateOldpassword(oldPassword){
        actions.updateOldpassword(oldPassword);
    }

    updateNewpassword(newPassword){
        actions.updateNewpassword(newPassword);
    }

    submitPassword(){
        actions.submitPassword();
    }

    handleSelect(name) {
        actions.updateSelected(name);
    }

    render () {

        var menuElement = (
            <PanelMenu>
                <PanelMenuEntry icon="user" name="profile" handleSelect={this.handleSelect}>
                    Profile
                </PanelMenuEntry>
                <PanelMenuEntry icon="institution" name="rights" handleSelect={this.handleSelect}>
                    Access rights
                </PanelMenuEntry>
                <PanelMenuEntry icon="key" name="ssh" handleSelect={this.handleSelect}>
                    SSH Keys
                </PanelMenuEntry>
                <PanelMenuEntry icon="unlock-alt" name="password" handleSelect={this.handleSelect}>
                    Password
                </PanelMenuEntry>
            </PanelMenu>
        );

        var panel = '';

        switch(this.state.menuSelected) {
            default:
            case 'profile':
                panel = (<Panel>
                    <PanelHeader>
                        <Title title="Profile" />
                    </PanelHeader>
                    <PanelBody>
                        <SettingsProfile profile={this.state.profile}
                                             submitProfile={this.submitProfile.bind(this)}
                                             updateProfile={this.updateProfile.bind(this)}
                                            />
                        <LoadingPanel show={this.state.loading}/>
                    </PanelBody>
                </Panel>);
                break;
            case 'rights':
                panel = (<Panel>
                    <PanelHeader>
                        <Title title="Access rights" />
                    </PanelHeader>
                    <PanelBody>
                        <SettingsRights profile={this.state.profile}
                                             submitProfile={this.submitProfile.bind(this)}
                                             updateProfile={this.updateProfile.bind(this)}
                                            />
                        <LoadingPanel show={this.state.loading}/>
                    </PanelBody>
                </Panel>);
                break;
            case 'ssh':
                panel = (<Panel>
                    <PanelHeader>
                        <Title title="SSH" />
                    </PanelHeader>
                    <PanelBody>
                        <SettingsSsh generateKeys={this.generateKeys.bind(this)}
                                     public_key={this.state.profile.public_key}
                                     private_key={this.state.profile.private_key}
                                     />            
                        <LoadingPanel show={this.state.loading}/>
                    </PanelBody>
                </Panel>);
                break;

            case 'password':
                panel = (<Panel>
                    <PanelHeader>
                        <Title title="Reset Password" />
                    </PanelHeader>
                    <PanelBody>
                        <SettingsPassword newPassword={this.updateNewpassword.bind(this)}
                                          oldPassword={this.updateOldpassword.bind(this)}
                                          submitPassword={this.submitPassword.bind(this)}
                                        />            
                        <LoadingPanel show={this.state.loading}/>
                    </PanelBody>
                </Panel>);
                break;

        }

        return (
            <View>
                {menuElement}
                {panel}
            </View>
            
                
        );
    }

}

export default SettingsView;
