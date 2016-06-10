import React from 'react';
import axios from 'axios'

export default class AuthorityName extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authname: ''
        }

        this.fetchAuthorityName = this.fetchAuthorityName.bind(this);
    }
    
    componentDidUpdate() {
        var re = /(urn:publicid:IDN\+[\w\+]*)/;
        
        if (re.test(this.props.id) && !this.state.authname) {
            this.fetchAuthorityName(this.props.id);
        }
    }

    fetchAuthorityName() {
        axios.get('/api/v1/authorities/'+ this.props.id)
        .then(function (response) {
            this.updateAuthorityName(response.data.result);
        }.bind(this)).catch(function (response) {
            console.log(response);
            this.errorAuthorityName('error');
        }.bind(this));
       
    }

    updateAuthorityName(data) {
        this.state.authname = data[0].name;
        this.setState({value: this.state.authname});
    }

    // return 
    errorAuthorityName(date) {
        this.state.authname = this.prop.id;
        this.setState({value: this.state.authname});
    }

    render() {
        return (
            <div>
                <input  value={this.state.authname || this.props.id}
                        placeholder="Authority" 
                        type="text" 
                        name="authority"
                        />
            </div>
        )
    }
}