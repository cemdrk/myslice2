import React from 'react';
import store from '../stores/UserProfileStore';
import actions from '../actions/UserProfileActions';

import AuthorityName from './AuthorityName';
import LoadingPanel from './LoadingPanel';
import Avatar from 'react-avatar';


export default class UserProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = store.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        store.listen(this.onChange);
        actions.fetchProfile();
    }

    componentWillUnmount() {
        store.unlisten(this.onChange);
    }
    
    // listen to the Store once something changes
    onChange(state) {
        this.setState(state);
    }

    // change the state and view
    updateLastname(event) {
        actions.updateLastname(event.target.value);
    }

    updateFirstname(event) {
        actions.updateFirstname(event.target.value);
    }

    updateBio(event) {
        actions.updateBio(event.target.value);
    }

    updateUrl(event) {
        actions.updateUrl(event.target.value);
    }

    submitForm(event) {
        event.preventDefault();
        actions.onSubmit();
    }

    render() {
        let name = [this.state.first_name,this.state.last_name].join(' ');

        return (
            <div>
                <h3> Your Details</h3>

                <Avatar email={this.state.email} name={name} round={true} />
                <form onSubmit={this.submitForm}>
                    <div>
                        <input  value={this.state.first_name} 
                                placeholder="First name" 
                                type="text" 
                                name="first_name"
                                onChange={this.updateFirstname.bind(this)}
                                />
                    </div>
                    <div>
                        <input  value={this.state.last_name} 
                                placeholder="Last name" 
                                type="text" 
                                name="last_name"
                                onChange={this.updateLastname.bind(this)}
                                />
                    </div>
                    <div>
                        <input  value={this.state.email} 
                                name="email"
                                placeholder="Email address"
                                type="text"
                                readOnly
                                />
                    </div>
                    <div>
                        <AuthorityName id={this.state.authority} />
                    </div>
                    <div>
                        <input  value={this.state.bio}
                                placeholder="Bio"
                                type="text"
                                name="bio"
                                onChange={this.updateBio.bind(this)}
                                />
                    </div>
                    <div>
                        <input  value={this.state.url}
                                placeholder="Your Url"
                                type="text"
                                name="url"
                                onChange={this.updateUrl.bind(this)}
                                />
                    </div>
                    
                    <button type="submit" className="btn btn-default">Update Profile</button>  
                </form>
                <LoadingPanel show={this.state.loading} />
            </div>
            )
    }

}
