import React from 'react';

import List from './base/List';
import UsersFilter from './UsersFilter';
import UsersRow from'./UsersRow';

class UsersList extends React.Component {

    render() {
        return (
            <div>
                <List>
                {
                    this.props.users.map(function(user) {
                        return <UsersRow key={user.id} user={user} setCurrent={this.props.setCurrent} current={this.props.current} addUser={this.props.addUser} removeUser={this.props.removeUser} />;
                    }.bind(this))
                }
                </List>
            </div>
        );
    }
}

UsersList.propTypes = {
    users: React.PropTypes.array.isRequired,
    current: React.PropTypes.object,
    addUser: React.PropTypes.bool,
    removeUser: React.PropTypes.bool,
    setCurrent: React.PropTypes.func
};

UsersList.defaultProps = {
    current: null,
    setCurrent: null,
    addUser: false,
    removeUser: false,
};

export default UsersList;
